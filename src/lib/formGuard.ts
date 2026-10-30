import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { HONEYPOT_FIELD } from '@/lib/honeypot';

// Spam protection shared by the public form endpoints (/api/contact,
// /api/launch-list, /api/booking): a body size cap, a honeypot field and a
// per-IP rate limit kept in MongoDB, so every serverless instance shares the
// same counters. The limiter fails open: if the store can't be reached, the
// request goes through and the failure is logged.

export type GuardedForm = 'contact' | 'launch-list' | 'booking';

// Requests per IP per window, and the largest body each endpoint accepts.
export const FORM_GUARD: Record<GuardedForm, { limit: number; windowMs: number; maxBodyBytes: number }> = {
  'contact':     { limit: 5,  windowMs: 60 * 60 * 1000, maxBodyBytes: 32 * 1024 },
  'launch-list': { limit: 10, windowMs: 60 * 60 * 1000, maxBodyBytes: 2 * 1024 },
  'booking':     { limit: 5,  windowMs: 60 * 60 * 1000, maxBodyBytes: 4 * 1024 },
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COLLECTION = 'rateLimits';
// How long the limiter may wait on the store before letting the request through.
const STORE_TIMEOUT_MS = 2000;

// ── Body ────────────────────────────────────────────────────────────────────

export class BodyTooLargeError extends Error {}

/**
 * Reads the JSON body, refusing anything over the form's size cap. Malformed
 * JSON still throws a SyntaxError, so each route's existing catch handles it
 * exactly as before.
 */
export async function readJsonBody(req: NextRequest, form: GuardedForm): Promise<Record<string, unknown>> {
  const max = FORM_GUARD[form].maxBodyBytes;
  const declared = Number(req.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > max) throw new BodyTooLargeError();

  const text = await req.text();
  if (Buffer.byteLength(text, 'utf8') > max) throw new BodyTooLargeError();
  return JSON.parse(text) as Record<string, unknown>;
}

export function tooLargeResponse() {
  return NextResponse.json(
    { error: 'That message is too long. Please shorten it and try again.' },
    { status: 413 }
  );
}

// ── Honeypot ────────────────────────────────────────────────────────────────

/** True when the hidden field came back filled, i.e. a bot filled every input. */
export function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === 'string' && value.trim() !== '';
}

// ── Client IP ───────────────────────────────────────────────────────────────

/**
 * The caller's IP, hashed. Only Vercel's own headers are trusted: Vercel sets
 * x-real-ip and overwrites x-forwarded-for at its edge, so a client can't
 * choose them there. Anywhere else (local dev, tests) those headers are
 * client-supplied, so every request shares one 'unknown' bucket instead.
 */
export function clientKey(req: NextRequest): string {
  let ip = 'unknown';
  if (process.env.VERCEL) {
    ip = req.headers.get('x-real-ip')?.trim()
      || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || 'unknown';
  }
  const salt = process.env.RATE_LIMIT_SALT || 'nesture-x-form-guard';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

// ── Rate limit ──────────────────────────────────────────────────────────────

type RateDoc = { _id: string; count: number; resetAt: Date };

export type RateResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

let indexEnsured = false;

async function hit(form: GuardedForm, key: string): Promise<RateResult> {
  const { limit, windowMs } = FORM_GUARD[form];
  const db = await getDb();
  const col = db.collection<RateDoc>(COLLECTION);

  if (!indexEnsured) {
    // Mongo drops each counter once its window has passed.
    await col.createIndex({ resetAt: 1 }, { expireAfterSeconds: 0 });
    indexEnsured = true;
  }

  const now = new Date();
  const fresh = new Date(now.getTime() + windowMs);
  // Fixed window in one atomic update: count up inside the current window,
  // or start a new window when there is none or it has passed.
  const update = [{
    $set: {
      count:   { $cond: [{ $gt: ['$resetAt', now] }, { $add: ['$count', 1] }, 1] },
      resetAt: { $cond: [{ $gt: ['$resetAt', now] }, '$resetAt', fresh] },
    },
  }];
  const id = `${form}:${key}`;

  let doc: RateDoc | null;
  try {
    doc = await col.findOneAndUpdate({ _id: id }, update, { upsert: true, returnDocument: 'after' });
  } catch (err) {
    // Two first requests racing to create the same counter: one wins, retry once.
    if ((err as { code?: number }).code !== 11000) throw err;
    doc = await col.findOneAndUpdate({ _id: id }, update, { upsert: true, returnDocument: 'after' });
  }

  if (!doc || doc.count <= limit) return { allowed: true };
  return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((doc.resetAt.getTime() - now.getTime()) / 1000)) };
}

/** Counts this request against the caller's limit. Fails open on any store error or timeout. */
export async function checkRateLimit(form: GuardedForm, req: NextRequest): Promise<RateResult> {
  const attempt = hit(form, clientKey(req));
  attempt.catch(() => {}); // a late failure after the timeout must not go unhandled

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`rate-limit store timed out after ${STORE_TIMEOUT_MS}ms`)), STORE_TIMEOUT_MS);
  });

  try {
    return await Promise.race([attempt, timeout]);
  } catch (err) {
    console.error(`[form-guard] rate limit check failed for ${form}, letting the request through:`, err);
    return { allowed: true };
  } finally {
    clearTimeout(timer);
  }
}

export function rateLimitedResponse(retryAfterSeconds: number, contactHint: boolean) {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  const wait = minutes <= 1 ? 'a minute' : `${minutes} minutes`;
  const message = `Too many attempts. Please try again in ${wait}${contactHint ? ', or reach us on WhatsApp' : ''}.`;
  return NextResponse.json(
    { error: message },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
  );
}
