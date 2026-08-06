import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { getNextSequence } from '@/lib/counters';
import type { Invoice } from '@/types/invoice';

const COLLECTION = 'invoices';

export interface SavedInvoice extends Invoice {
  _id:       string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// ── helpers ───────────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

/** Strip undefined fields MongoDB would reject and cast _id to string. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSaved(doc: any): SavedInvoice {
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest } as SavedInvoice;
}

/**
 * Atomically allocates the next invoice number: NX-INV-YYYY-NNN, zero-padded,
 * resetting every calendar year. Independent of the quote numbering sequence.
 */
export async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const seq  = await getNextSequence(`invoice-${year}`);
  return `NX-INV-${year}-${String(seq).padStart(3, '0')}`;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

/** Creates a new invoice, allocating its documentNumber server-side. */
export async function createSavedInvoice(
  invoice: Omit<Invoice, 'documentNumber'>,
): Promise<SavedInvoice> {
  const db  = await getDb();
  const ts  = now();
  const doc = { ...invoice, documentNumber: await nextInvoiceNumber(), createdAt: ts, updatedAt: ts };
  const res = await db.collection(COLLECTION).insertOne(doc);
  return toSaved({ _id: res.insertedId, ...doc });
}

export async function getSavedInvoices(): Promise<SavedInvoice[]> {
  const db   = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toSaved);
}

export async function getSavedInvoiceById(id: string): Promise<SavedInvoice | null> {
  if (!ObjectId.isValid(id)) return null;
  const db  = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? toSaved(doc) : null;
}

export async function updateSavedInvoice(
  id:      string,
  updates: Partial<Invoice>,
): Promise<SavedInvoice | null> {
  if (!ObjectId.isValid(id)) return null;
  const db  = await getDb();
  // documentNumber is immutable once allocated — never let a client overwrite it.
  const { documentNumber: _ignored, ...safeUpdates } = updates;
  const res = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...safeUpdates, updatedAt: now() } },
    { returnDocument: 'after' },
  );
  return res ? toSaved(res) : null;
}

export async function deleteSavedInvoice(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db  = await getDb();
  const res = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount === 1;
}
