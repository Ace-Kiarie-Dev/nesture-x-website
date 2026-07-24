import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import { getAllBookings } from '@/services/bookingService';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

// GET /api/admin/bookings — list all bookings (read-only)
export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const bookings = await getAllBookings();
    return NextResponse.json(bookings);
  } catch (err) {
    console.error('[admin/bookings GET]', err);
    return NextResponse.json({ error: 'Failed to fetch bookings.' }, { status: 500 });
  }
}
