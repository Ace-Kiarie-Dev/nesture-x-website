import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'nx-admin-token';
const MAX_AGE     = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('Missing JWT_SECRET env var');
  return s;
}

/** Sign a payload string with HMAC-SHA256 and return "payload.signature" */
function sign(payload: string): string {
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

/** Verify a "payload.signature" token. Returns the payload or null if invalid. */
function verify(token: string): string | null {
  const dot = token.lastIndexOf('.');
  if (dot < 0) return null;
  const payload   = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected  = createHmac('sha256', getSecret()).update(payload).digest('hex');
  try {
    if (!timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) {
      return null;
    }
  } catch {
    return null;
  }
  return payload;
}

/** Issue an admin session cookie. Call from the auth POST route. */
export async function issueAdminSession(): Promise<void> {
  const payload = `admin:${Date.now()}`;
  const token   = sign(payload);
  const jar     = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   MAX_AGE,
    // secure: true only in production (Next.js sets this automatically via deployment)
    secure:   process.env.NODE_ENV === 'production',
  });
}

/** Clear the admin session cookie. Call from the logout route. */
export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/**
 * Read and verify the admin session from the incoming request cookies.
 * Returns true if the session is valid, false otherwise.
 */
export async function getAdminSession(): Promise<boolean> {
  const jar   = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verify(token) !== null;
}
