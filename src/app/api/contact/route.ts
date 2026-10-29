import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDb } from '@/lib/mongodb';
import { sendContactReply } from '@/emails/send';
import { buildContactOwner } from '@/emails/contact-owner';
import { FROM, OWNER_INBOX } from '@/lib/contactEmails';
import {
  BodyTooLargeError, EMAIL_RE, checkRateLimit, isHoneypotFilled, rateLimitedResponse, readJsonBody, tooLargeResponse,
} from '@/lib/formGuard';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await readJsonBody(req, 'contact');

    // Honeypot filled: answer like a normal send, but store and send nothing.
    if (isHoneypotFilled(body)) {
      console.info('[contact] honeypot filled, submission dropped');
      return NextResponse.json({ success: true });
    }

    const { name, email, phone, service, brief, budget, timeline } = body as Record<string, string>;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !brief?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and project brief are required.' },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    // Only submissions that would actually store and send count against the limit.
    const rate = await checkRateLimit('contact', req);
    if (!rate.allowed) return rateLimitedResponse(rate.retryAfterSeconds, true);

    const lead = {
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      phone:     phone?.trim() || null,
      service:   service || null,
      brief:     brief.trim(),
      budget:    budget || null,
      timeline:  timeline || null,
      source:    'website-form',
      status:    'new',
      createdAt: new Date(),
    };

    // ── 1. Log to MongoDB ─────────────────────────────────────────────────────
    try {
      const db = await getDb();
      await db.collection('leads').insertOne(lead);
    } catch (dbErr) {
      // Don't fail the request if DB is down — email is the safety net
      console.error('[contact] MongoDB insert failed:', dbErr);
    }

    // ── 2. Internal notification + auto-reply — email failure never blocks the lead ──
    const [internalResult, replyResult] = await Promise.allSettled([
      resend.emails.send({
        from:    FROM.ownerInquiry,
        to:      OWNER_INBOX,
        replyTo: email.trim(),
        subject: `New Inquiry — ${service || 'General'} — ${name}`,
        ...buildContactOwner({ name, email, phone, service, brief, budget, timeline }),
      }),
      sendContactReply({
        to:         email.trim(),
        clientName: name,
        message:    brief,
      }),
    ]);

    if (internalResult.status === 'rejected') {
      console.error('[contact] internal notification email failed:', internalResult.reason);
    }
    if (replyResult.status === 'rejected') {
      console.error('[contact] auto-reply email failed:', replyResult.reason);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    if (err instanceof BodyTooLargeError) return tooLargeResponse();
    console.error('[contact] error:', err);
    return NextResponse.json(
      { error: 'Failed to send. Please reach us directly on WhatsApp.' },
      { status: 500 }
    );
  }
}
