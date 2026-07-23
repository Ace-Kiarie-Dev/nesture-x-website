import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export interface Booking {
  _id?:               ObjectId;
  name:                string;
  email:               string;
  phone:               string;
  service:             string;
  date:                string; // 'YYYY-MM-DD'
  timeSlot:            string; // e.g. '09:00'
  createdAt:           Date;
  // Parked M-Pesa fields — unused now that booking is payment-free, kept so
  // the schema doesn't need re-migrating if payment comes back.
  checkoutRequestId?: string;
  merchantRequestId?: string;
  mpesaRef?:          string;
  paidAt?:            Date;
}

export async function createBooking(
  data: Omit<Booking, '_id' | 'createdAt'>
): Promise<string> {
  const db = await getDb();
  const { insertedId } = await db.collection('bookings').insertOne({
    ...data,
    createdAt: new Date(),
  });
  return insertedId.toString();
}

// Time slots already taken on a given date — used to grey out unavailable
// slots in the calendar and to re-check for a race on submit.
export async function getTakenSlotsForDate(date: string): Promise<string[]> {
  const db = await getDb();
  const bookings = await db
    .collection<Booking>('bookings')
    .find({ date }, { projection: { timeSlot: 1 } })
    .toArray();
  return bookings.map(b => b.timeSlot);
}

// ── Parked M-Pesa helpers ─────────────────────────────────────────────────
// Unused now that the STK push flow is removed (see api/booking/route.ts),
// kept alongside the parked checkoutRequestId/merchantRequestId fields above
// so re-enabling payment later doesn't require rebuilding this lookup path.

export async function getBookingByCheckoutId(
  checkoutRequestId: string
): Promise<Booking | null> {
  const db = await getDb();
  return db.collection<Booking>('bookings').findOne({ checkoutRequestId });
}

export async function updateBookingByCheckoutId(
  checkoutRequestId: string,
  update: Partial<Booking>
): Promise<void> {
  const db = await getDb();
  await db.collection('bookings').updateOne(
    { checkoutRequestId },
    { $set: update }
  );
}
