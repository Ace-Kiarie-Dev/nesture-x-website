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

// ── Admin listing ────────────────────────────────────────────────────────
// Some records predate the calendar migration (see git history) and have no
// date/timeSlot, carrying instead a pending/paid/failed/expired `status`
// field from the old M-Pesa flow. Read every field defensively so those rows
// render instead of crashing the admin view.

export interface AdminBooking {
  _id:       string;
  name?:     string;
  email?:    string;
  phone?:    string;
  service?:  string;
  date?:     string;
  timeSlot?: string;
  status?:   string;
  createdAt: string; // ISO
}

export async function getAllBookings(): Promise<AdminBooking[]> {
  const db   = await getDb();
  const docs = await db.collection('bookings').find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(d => ({
    _id:       d._id.toString(),
    name:      typeof d.name === 'string' ? d.name : undefined,
    email:     typeof d.email === 'string' ? d.email : undefined,
    phone:     typeof d.phone === 'string' ? d.phone : undefined,
    service:   typeof d.service === 'string' ? d.service : undefined,
    date:      typeof d.date === 'string' ? d.date : undefined,
    timeSlot:  typeof d.timeSlot === 'string' ? d.timeSlot : undefined,
    status:    typeof d.status === 'string' ? d.status : undefined,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date(0).toISOString(),
  }));
}
