import { NextRequest, NextResponse } from 'next/server';
import { stkPush } from '@/services/mpesaService';
import {
  createBooking,
  getBookingById,
  updateBookingById,
} from '@/services/bookingService';

const FEE = Number(process.env.CONSULTATION_FEE) || 1000;

// ── POST /api/booking — initiate booking + STK push ──────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, service } = await req.json() as Record<string, string>;

    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required.' },
        { status: 400 }
      );
    }

    // Create a pending booking so we have an ID for the M-Pesa reference
    const bookingId = await createBooking({
      name:              name.trim(),
      email:             email.trim().toLowerCase(),
      phone:             phone.trim(),
      service:           service?.trim() || 'General Consultation',
      amount:            FEE,
      checkoutRequestId: '',
      merchantRequestId: '',
      status:            'pending',
    });

    // Fire STK push
    let mpesa;
    try {
      mpesa = await stkPush(phone.trim(), FEE, bookingId);
    } catch (err) {
      await updateBookingById(bookingId, { status: 'failed' });
      throw err;
    }

    if (mpesa.ResponseCode !== '0') {
      await updateBookingById(bookingId, { status: 'failed' });
      return NextResponse.json(
        { error: mpesa.ResponseDescription || 'Payment initiation failed. Please try again.' },
        { status: 400 }
      );
    }

    // Persist the M-Pesa request IDs so the callback can match this booking
    await updateBookingById(bookingId, {
      checkoutRequestId: mpesa.CheckoutRequestID,
      merchantRequestId: mpesa.MerchantRequestID,
    });

    return NextResponse.json({
      success:   true,
      bookingId,
      message:   mpesa.CustomerMessage || 'Check your phone for the M-Pesa prompt.',
    });

  } catch (err) {
    console.error('[booking/POST]', err);
    return NextResponse.json(
      { error: 'Could not initiate payment. Please try again or reach us on WhatsApp.' },
      { status: 500 }
    );
  }
}

// ── GET /api/booking?id=X — poll payment status ──────────────────────────────

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing booking id' }, { status: 400 });
  }

  try {
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ status: booking.status, name: booking.name });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
