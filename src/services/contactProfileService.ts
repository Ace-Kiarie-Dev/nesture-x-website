import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import {
  FALLBACK_CONTACT,
  sanitizeContact,
  toSnapshot,
  type ContactProfileInput,
  type ContactSnapshot,
} from '@/types/contact';

const COLLECTION = 'contactProfiles';
const SEED_KEY   = 'nx-main';

export interface SavedContactProfile extends ContactProfileInput {
  _id:       string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

// ── helpers ───────────────────────────────────────────────────────────────────

function now(): string {
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSaved(doc: any): SavedContactProfile {
  const { _id, seedKey: _seed, ...rest } = doc;
  return { _id: _id.toString(), ...rest } as SavedContactProfile;
}

/**
 * Validates profile input. Label, name, phone and email are required;
 * WhatsApp is optional. Returns null when invalid.
 */
export function parseProfileInput(raw: unknown): Omit<ContactProfileInput, 'isDefault'> | null {
  const c = sanitizeContact(raw);
  const label = typeof (raw as { label?: unknown })?.label === 'string'
    ? ((raw as { label: string }).label).trim().slice(0, 60)
    : '';
  if (!c || !label || !c.contactName || !c.phone || !c.email) return null;
  return { label, ...c };
}

/**
 * Seeds the "NX Main" default profile from the old hardcoded footer values
 * the first time the collection is read. Upsert on a fixed key so concurrent
 * first reads can't insert it twice.
 */
async function ensureSeeded(): Promise<void> {
  const db  = await getDb();
  const col = db.collection(COLLECTION);
  if (await col.countDocuments({}, { limit: 1 }) > 0) return;
  const ts = now();
  await col.updateOne(
    { seedKey: SEED_KEY },
    { $setOnInsert: { seedKey: SEED_KEY, label: 'NX Main', ...FALLBACK_CONTACT, isDefault: true, createdAt: ts, updatedAt: ts } },
    { upsert: true },
  );
}

async function clearDefaults(exceptId?: ObjectId): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION).updateMany(
    exceptId ? { isDefault: true, _id: { $ne: exceptId } } : { isDefault: true },
    { $set: { isDefault: false, updatedAt: now() } },
  );
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getContactProfiles(): Promise<SavedContactProfile[]> {
  await ensureSeeded();
  const db   = await getDb();
  const docs = await db
    .collection(COLLECTION)
    .find({})
    .sort({ isDefault: -1, createdAt: 1 })
    .toArray();
  return docs.map(toSaved);
}

/** The default profile's contact fields, for snapshotting onto a document. */
export async function getDefaultContactSnapshot(): Promise<ContactSnapshot> {
  const [first] = await getContactProfiles(); // sorted default-first
  return first ? toSnapshot(first) : FALLBACK_CONTACT;
}

export async function createContactProfile(
  input: Omit<ContactProfileInput, 'isDefault'>,
  makeDefault: boolean,
): Promise<SavedContactProfile> {
  await ensureSeeded();
  const db  = await getDb();
  const ts  = now();
  const _id = new ObjectId();
  if (makeDefault) await clearDefaults(_id);
  const doc = { _id, ...input, isDefault: makeDefault, createdAt: ts, updatedAt: ts };
  await db.collection(COLLECTION).insertOne(doc);
  return toSaved(doc);
}

export async function updateContactProfile(
  id:          string,
  input:       Omit<ContactProfileInput, 'isDefault'> | null,
  makeDefault: boolean,
): Promise<SavedContactProfile | null> {
  if (!ObjectId.isValid(id)) return null;
  const db  = await getDb();
  const oid = new ObjectId(id);
  if (!(await db.collection(COLLECTION).findOne({ _id: oid }))) return null;
  // Default can only be moved *to* a profile, never switched off directly —
  // that guarantees exactly one default at all times.
  if (makeDefault) await clearDefaults(oid);
  const res = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: oid },
    { $set: { ...(input ?? {}), ...(makeDefault ? { isDefault: true } : {}), updatedAt: now() } },
    { returnDocument: 'after' },
  );
  return res ? toSaved(res) : null;
}

export type DeleteResult = 'ok' | 'not-found' | 'is-default';

export async function deleteContactProfile(id: string): Promise<DeleteResult> {
  if (!ObjectId.isValid(id)) return 'not-found';
  const db  = await getDb();
  const oid = new ObjectId(id);
  const doc = await db.collection(COLLECTION).findOne({ _id: oid });
  if (!doc) return 'not-found';
  if (doc.isDefault) return 'is-default';
  await db.collection(COLLECTION).deleteOne({ _id: oid });
  return 'ok';
}
