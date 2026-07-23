import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createBooking, getTakenSlotsForDate } from '@/services/bookingService';
import { isValidBookingSlot, formatDateLabel, formatSlotLabel } from '@/lib/bookingSlots';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Email templates ───────────────────────────────────────────────────────────
// Relocated from api/mpesa/callback/route.ts — these used to fire only once
// Safaricom confirmed payment; now the booking itself is the confirmation.

function clientEmail(name: string, date: string, timeSlot: string): string {
  return `
Hey ${name},

Your Nesture-X consultation booking is confirmed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date : ${formatDateLabel(date)}
Time : ${formatSlotLabel(timeSlot)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If anything comes up and you need to reschedule, just reach us on WhatsApp.

See you then,
Peter Kiarie
Founder, Nesture-X
Nairobi, Kenya · +254 717 164 951
  `.trim();
}

function peterEmail(name: string, email: string, phone: string, service: string, date: string, timeSlot: string): string {
  return `
New Consultation Booking — Nesture-X

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NAME     : ${name}
EMAIL    : ${email}
PHONE    : ${phone}
SERVICE  : ${service}
DATE     : ${formatDateLabel(date)}
TIME     : ${formatSlotLabel(timeSlot)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}

// ── POST /api/booking — validate, save, confirm ───────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, service, date, timeSlot } = await req.json() as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !date?.trim() || !timeSlot?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, phone, date, and time slot are all required.' },
        { status: 400 }
      );
    }

    if (!isValidBookingSlot(date.trim(), timeSlot.trim())) {
      return NextResponse.json(
        { error: 'That date or time slot is not available. Please pick another.' },
        { status: 400 }
      );
    }

    // Re-check for a race between the client's last availability fetch and this submit.
    const taken = await getTakenSlotsForDate(date.trim());
    if (taken.includes(timeSlot.trim())) {
      return NextResponse.json(
        { error: 'That slot was just booked by someone else. Please pick another.' },
        { status: 409 }
      );
    }

    const booking = {
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      phone:    phone.trim(),
      service:  service?.trim() || 'General Consultation',
      date:     date.trim(),
      timeSlot: timeSlot.trim(),
    };

    const bookingId = await createBooking(booking);

    await Promise.allSettled([
      resend.emails.send({
        from:    'Peter at Nesture-X <onboarding@resend.dev>',
        to:      booking.email,
        subject: 'Your Nesture-X Consultation is Confirmed ✓',
        text:    clientEmail(booking.name, booking.date, booking.timeSlot),
      }),
      resend.emails.send({
        from:    'Nesture-X Bookings <onboarding@resend.dev>',
        to:      'nesturex@gmail.com',
        subject: `New Consultation — ${booking.name} — ${formatDateLabel(booking.date)}`,
        text:    peterEmail(booking.name, booking.email, booking.phone, booking.service, booking.date, booking.timeSlot),
      }),
    ]);

    return NextResponse.json({ success: true, bookingId });

  } catch (err) {
    console.error('[booking/POST]', err);
    return NextResponse.json(
      { error: 'Could not save your booking. Please try again or reach us on WhatsApp.' },
      { status: 500 }
    );
  }
}
