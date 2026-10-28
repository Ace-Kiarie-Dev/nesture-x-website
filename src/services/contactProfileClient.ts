// Browser-side fetch wrapper for the contact profiles API.
import type { ContactProfileInput } from '@/types/contact';
import type { SavedContactProfile } from '@/services/contactProfileService';

async function errorFrom(res: Response, fallback: string): Promise<Error> {
  try {
    const d = await res.json() as { error?: string };
    return new Error(d.error || fallback);
  } catch {
    return new Error(fallback);
  }
}

export async function fetchContactProfiles(): Promise<SavedContactProfile[]> {
  const res = await fetch('/api/admin/contact-profiles');
  if (!res.ok) throw await errorFrom(res, 'Failed to load contact profiles.');
  return res.json() as Promise<SavedContactProfile[]>;
}

export async function createContactProfile(profile: ContactProfileInput): Promise<SavedContactProfile> {
  const res = await fetch('/api/admin/contact-profiles', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(profile),
  });
  if (!res.ok) throw await errorFrom(res, 'Save failed.');
  return res.json() as Promise<SavedContactProfile>;
}

export async function updateContactProfile(
  id:      string,
  updates: Partial<ContactProfileInput>,
): Promise<SavedContactProfile> {
  const res = await fetch(`/api/admin/contact-profiles/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(updates),
  });
  if (!res.ok) throw await errorFrom(res, 'Save failed.');
  return res.json() as Promise<SavedContactProfile>;
}

export async function deleteContactProfile(id: string): Promise<void> {
  const res = await fetch(`/api/admin/contact-profiles/${id}`, { method: 'DELETE' });
  if (!res.ok) throw await errorFrom(res, 'Delete failed.');
}
