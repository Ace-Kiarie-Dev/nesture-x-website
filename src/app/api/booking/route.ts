import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { Resend } from 'resend';
import { createBooking, getTakenSlotsForDate } from '@/services/bookingService';
import { isValidBookingSlot, formatDateLabel, formatSlotLabel } from '@/lib/bookingSlots';
import { sendBookingConfirmation } from '@/emails/send';
import { buildBookingOwner } from '@/emails/booking-owner';
import { FROM, OWNER_INBOX } from '@/lib/contactEmails';
import {
  BodyTooLargeError, EMAIL_RE, checkRateLimit, isHoneypotFilled, rateLimitedResponse, readJsonBody, tooLargeResponse,
} from '@/lib/formGuard';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── POST /api/booking — validate, save, confirm ───────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await readJsonBody(req, 'booking');

    // Honeypot filled: answer like a normal booking (with an unused reference),
    // but store nothing, hold no slot and send no email.
    if (isHoneypotFilled(body)) {
      console.info('[booking] honeypot filled, booking dropped');
      return NextResponse.json({ success: true, bookingId: new ObjectId().toHexString(), emailSent: true });
    }

    const { name, email, phone, service, date, timeSlot } = body as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !date?.trim() || !timeSlot?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, phone, date, and time slot are all required.' },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    // Only bookings that would actually be saved count against the limit.
    const rate = await checkRateLimit('booking', req);
    if (!rate.allowed) return rateLimitedResponse(rate.retryAfterSeconds, true);

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

    const [clientResult, peterResult] = await Promise.allSettled([
      sendBookingConfirmation({
        to:         booking.email,
        clientName: booking.name,
        service:    booking.service,
        date:       formatDateLabel(booking.date),
        time:       formatSlotLabel(booking.timeSlot),
        bookingRef: bookingId,
      }),
      resend.emails.send({
        from:    FROM.ownerBooking,
        to:      OWNER_INBOX,
        subject: `New Consultation — ${booking.name} — ${formatDateLabel(booking.date)}`,
        ...buildBookingOwner({
          name:    booking.name,
          email:   booking.email,
          phone:   booking.phone,
          service: booking.service,
          date:    formatDateLabel(booking.date),
          time:    formatSlotLabel(booking.timeSlot),
        }),
      }),
    ]);

    if (clientResult.status === 'rejected') {
      console.error('[booking] confirmation email failed:', clientResult.reason);
    }
    if (peterResult.status === 'rejected') {
      console.error('[booking] internal notification email failed:', peterResult.reason);
    }

    return NextResponse.json({
      success:      true,
      bookingId,
      emailSent:    clientResult.status === 'fulfilled',
    });

  } catch (err) {
    if (err instanceof BodyTooLargeError) return tooLargeResponse();
    console.error('[booking/POST]', err);
    return NextResponse.json(
      { error: 'Could not save your booking. Please try again or reach us on WhatsApp.' },
      { status: 500 }
    );
  }
}
