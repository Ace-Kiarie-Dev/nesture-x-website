import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDb } from '@/lib/mongodb';

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Email templates ────────────────────────────────────────────────────────────

function internalEmail(data: {
  name: string; email: string; phone: string;
  service: string; brief: string; budget: string; timeline: string;
}): string {
  return `
New project inquiry — Nesture-X

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NAME:      ${data.name}
EMAIL:     ${data.email}
PHONE:     ${data.phone || 'Not provided'}

SERVICE:   ${data.service || 'Not specified'}
BUDGET:    ${data.budget || 'Not specified'}
TIMELINE:  ${data.timeline || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT THEY'RE BUILDING:
${data.brief}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply directly to this email to respond to ${data.name}.
  `.trim();
}

function autoReply(name: string): string {
  return `
Hey ${name},

We've received your message — appreciate you taking the time to share what you're building.

I'll personally take a look and get back to you shortly.

If it's something we can help with, we'll map out the next steps together.

— Peter
Nesture-X

────────────────────────────
Nairobi, Kenya
+254 717 164 951
nesturex@gmail.com
  `.trim();
}

// ─── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, service, brief, budget, timeline } = body as Record<string, string>;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !brief?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and project brief are required.' },
        { status: 400 }
      );
    }

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

    // ── 2. Internal notification email ────────────────────────────────────────
    await resend.emails.send({
      from:    'Nesture-X Inquiries <inquiries@nesturex.com>',
      to:      'nesturex@gmail.com',
      replyTo: email.trim(),
      subject: `New Inquiry — ${service || 'General'} — ${name}`,
      text:    internalEmail({ name, email, phone, service, brief, budget, timeline }),
    });

    // ── 3. Auto-reply to the sender ───────────────────────────────────────────
    await resend.emails.send({
      from:    'Peter at Nesture-X <inquiries@nesturex.com>',
      to:      email.trim(),
      replyTo: 'nesturex@gmail.com',
      subject: "Got it — we're looking at your idea 👀",
      text:    autoReply(name),
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[contact] error:', err);
    return NextResponse.json(
      { error: 'Failed to send. Please reach us directly on WhatsApp.' },
      { status: 500 }
    );
  }
}
