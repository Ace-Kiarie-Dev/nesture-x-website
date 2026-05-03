import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import type { Quote } from '@/types/quote';

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'declined' | 'expired';

export interface SavedQuote extends Quote {
  _id:       string;
  status:    QuoteStatus;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

const COLLECTION = 'quotes';

// ── helpers ───────────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

/** Strip undefined fields MongoDB would reject and cast _id to string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSaved(doc: any): SavedQuote {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest } as SavedQuote;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createSavedQuote(
  quote: Quote,
  status: QuoteStatus = 'draft',
): Promise<SavedQuote> {
  const db  = await getDb();
  const ts  = now();
  const doc = { ...quote, status, createdAt: ts, updatedAt: ts };
  const res = await db.collection(COLLECTION).insertOne(doc);
  return toSaved({ _id: res.insertedId, ...doc });
}

export async function getSavedQuotes(): Promise<SavedQuote[]> {
  const db   = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toSaved);
}

export async function getSavedQuoteById(id: string): Promise<SavedQuote | null> {
  if (!ObjectId.isValid(id)) return null;
  const db  = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toSaved(doc) : null;
}

export async function updateSavedQuote(
  id:      string,
  updates: Partial<Quote & { status: QuoteStatus }>,
): Promise<SavedQuote | null> {
  if (!ObjectId.isValid(id)) return null;
  const db  = await getDb();
  const res = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: now() } },
    { returnDocument: 'after' },
  );
  return res ? toSaved(res) : null;
}

export async function deleteSavedQuote(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db  = await getDb();
  const res = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount === 1;
}
