import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  updateBookingByCheckoutId,
  getBookingByCheckoutId,
  type Booking,
} from '@/services/bookingService';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Email templates ───────────────────────────────────────────────────────────

function clientEmail(name: string, mpesaRef: string): string {
  const calendly = process.env.CALENDLY_URL || '';
  return `
Hey ${name},

Your Nesture-X consultation booking is confirmed. Payment received.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
M-Pesa Reference : ${mpesaRef}
Amount Paid      : KES 1,000
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next step — pick your time slot:
${calendly}

Available slots (Monday – Friday):
  12:00 PM – 12:45 PM
   3:00 PM –  3:45 PM

The consultation fee is fully redeemable against your project cost
if we proceed to build together.

See you soon,
Peter Kiarie
Founder, Nesture-X
Nairobi, Kenya · +254 717 164 951
  `.trim();
}

function peterEmail(booking: Booking, mpesaRef: string): string {
  return `
New Consultation Booking — Nesture-X

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAME     : ${booking.name}
EMAIL    : ${booking.email}
PHONE    : ${booking.phone}
SERVICE  : ${booking.service}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
M-PESA   : ${mpesaRef}
AMOUNT   : KES ${booking.amount}
STATUS   : PAID ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Client has been sent the Calendly link to book their time slot.
  `.trim();
}

// ── POST /api/mpesa/callback — Safaricom Daraja webhook ──────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const stkCallback = body?.Body?.stkCallback;

    // Always ACK with 200 — Safaricom retries if it doesn't get a success response
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { CheckoutRequestID, ResultCode, CallbackMetadata } = stkCallback;

    if (ResultCode === 0) {
      // Payment confirmed
      const items: Array<{ Name: string; Value: unknown }> =
        CallbackMetadata?.Item ?? [];

      const mpesaRef = String(
        items.find(i => i.Name === 'MpesaReceiptNumber')?.Value ?? ''
      );

      await updateBookingByCheckoutId(CheckoutRequestID, {
        status:   'paid',
        mpesaRef,
        paidAt:   new Date(),
      });

      const booking = await getBookingByCheckoutId(CheckoutRequestID);
      if (booking) {
        await Promise.allSettled([
          resend.emails.send({
            from:    'Peter at Nesture-X <onboarding@resend.dev>',
            to:      booking.email,
            subject: 'Your Nesture-X Consultation is Confirmed ✓',
            text:    clientEmail(booking.name, mpesaRef),
          }),
          resend.emails.send({
            from:    'Nesture-X Bookings <onboarding@resend.dev>',
            to:      'nesturex@gmail.com',
            subject: `New Consultation — ${booking.name} — KES ${booking.amount} PAID`,
            text:    peterEmail(booking, mpesaRef),
          }),
        ]);
      }
    } else {
      // Payment was cancelled or failed
      await updateBookingByCheckoutId(CheckoutRequestID, { status: 'failed' });
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (err) {
    console.error('[mpesa/callback]', err);
    // Return 200 regardless — prevents Safaricom from retrying indefinitely
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
}
