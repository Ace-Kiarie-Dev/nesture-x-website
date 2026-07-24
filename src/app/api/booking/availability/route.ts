import { NextRequest, NextResponse } from 'next/server';
import { getTakenSlotsForDate } from '@/services/bookingService';
import { parseDateKey, isSelectableDate } from '@/lib/bookingSlots';

// ── GET /api/booking/availability?date=YYYY-MM-DD — taken slots for a day ────

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date');
  const parsed = date ? parseDateKey(date) : null;

  if (!date || !parsed || !isSelectableDate(parsed)) {
    return NextResponse.json({ error: 'Missing or invalid date.' }, { status: 400 });
  }

  try {
    const takenSlots = await getTakenSlotsForDate(date);
    return NextResponse.json({ takenSlots });
  } catch (err) {
    console.error('[booking/availability/GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
