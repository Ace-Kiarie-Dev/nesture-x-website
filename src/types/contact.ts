// Contact details printed on quotes and invoices.
//
// SNAPSHOT RULE: a document stores its own copy of these fields (`contact`)
// at save time. Renderers read only that copy — never a ContactProfile by id —
// so editing or deleting a profile later can't change an existing document.

import { HELLO } from '@/lib/contactEmails';

export const COMPANY_NAME     = 'Nesture-X';
export const COMPANY_LOCATION = 'Nairobi, Kenya';
export const COMPANY_WEBSITE  = 'nesturex.com';

export interface ContactSnapshot {
  contactName: string;
  phone:       string;
  whatsapp:    string; // optional — '' when unused
  email:       string;
}

export interface ContactProfileInput extends ContactSnapshot {
  label:     string;
  isDefault: boolean;
}

/**
 * The default document contact. Seeds the "NX Main" profile (only when it
 * doesn't exist yet) and is the render fallback for documents saved before
 * snapshots existed.
 */
export const FALLBACK_CONTACT: ContactSnapshot = {
  contactName: COMPANY_NAME,
  phone:       '+254 717 164 951',
  whatsapp:    '',
  email:       HELLO,
};

const MAX_LEN = 120;

function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim().slice(0, MAX_LEN) : '';
}

/** Coerces untrusted input into a ContactSnapshot, or null if nothing usable. */
export function sanitizeContact(raw: unknown): ContactSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const c = {
    contactName: clean(r.contactName),
    phone:       clean(r.phone),
    whatsapp:    clean(r.whatsapp),
    email:       clean(r.email),
  };
  return c.contactName || c.phone || c.email ? c : null;
}

export function toSnapshot(c: ContactSnapshot): ContactSnapshot {
  return { contactName: c.contactName, phone: c.phone, whatsapp: c.whatsapp || '', email: c.email };
}

export function sameContact(a: ContactSnapshot, b: ContactSnapshot): boolean {
  return a.contactName === b.contactName
    && a.phone === b.phone
    && (a.whatsapp || '') === (b.whatsapp || '')
    && a.email === b.email;
}

/** The document's snapshot, or the legacy hardcoded values for old documents. */
export function resolveContact(snapshot?: ContactSnapshot | null): ContactSnapshot {
  return snapshot ?? FALLBACK_CONTACT;
}

/**
 * Footer contact line segments, joined by the caller with its own separator.
 * For FALLBACK_CONTACT this yields:
 *   Nairobi, Kenya · +254 717 164 951 · hello@nesturex.com · nesturex.com
 * The contact name is only printed when it isn't the company name, and
 * WhatsApp only when it differs from the phone number.
 */
export function footerContactParts(c: ContactSnapshot): string[] {
  return [
    COMPANY_LOCATION,
    c.contactName && c.contactName !== COMPANY_NAME ? c.contactName : '',
    c.phone,
    c.whatsapp && c.whatsapp !== c.phone ? `WhatsApp ${c.whatsapp}` : '',
    c.email,
    COMPANY_WEBSITE,
  ].filter(Boolean);
}
