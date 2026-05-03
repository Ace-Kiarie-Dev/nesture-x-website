import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export type BookingStatus = 'pending' | 'paid' | 'failed' | 'expired';

export interface Booking {
  _id?:              ObjectId;
  name:              string;
  email:             string;
  phone:             string;
  service:           string;
  amount:            number;
  checkoutRequestId: string;
  merchantRequestId: string;
  mpesaRef?:         string;
  status:            BookingStatus;
  createdAt:         Date;
  paidAt?:           Date;
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

export async function getBookingById(id: string): Promise<Booking | null> {
  const db = await getDb();
  return db.collection<Booking>('bookings').findOne({ _id: new ObjectId(id) });
}

export async function getBookingByCheckoutId(
  checkoutRequestId: string
): Promise<Booking | null> {
  const db = await getDb();
  return db.collection<Booking>('bookings').findOne({ checkoutRequestId });
}

export async function updateBookingById(
  id: string,
  update: Partial<Booking>
): Promise<void> {
  const db = await getDb();
  await db.collection('bookings').updateOne(
    { _id: new ObjectId(id) },
    { $set: update }
  );
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
