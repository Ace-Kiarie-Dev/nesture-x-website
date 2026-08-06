import { getDb } from './mongodb';

const COLLECTION = 'counters';

interface CounterDoc {
  _id: string;
  seq: number;
}

/**
 * Atomically increments and returns the next sequence value for `key`.
 * Backed by a single-document-per-key collection so concurrent admins never
 * collide on the same number (unlike the old localStorage quote counter).
 */
export async function getNextSequence(key: string): Promise<number> {
  const db  = await getDb();
  const res = await db.collection<CounterDoc>(COLLECTION).findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  if (!res) throw new Error(`Failed to allocate sequence for "${key}".`);
  return res.seq;
}
