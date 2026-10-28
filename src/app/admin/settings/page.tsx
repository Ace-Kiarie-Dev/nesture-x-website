'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Star, X, Save } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminPage, EmptyState, Notice, PageHeader, Section, SkeletonRows, StatusChip } from '@/components/admin/ui';
import { ClayButton } from '@/components/redesign';
import type { ContactProfileInput } from '@/types/contact';
import type { SavedContactProfile } from '@/services/contactProfileService';
import {
  fetchContactProfiles,
  createContactProfile,
  updateContactProfile,
  deleteContactProfile,
} from '@/services/contactProfileClient';

type Draft = Omit<ContactProfileInput, 'isDefault'>;

function blankDraft(): Draft {
  return { label: '', contactName: '', phone: '', whatsapp: '', email: '' };
}

const FIELDS: { key: keyof Draft; label: string; placeholder: string; type?: string }[] = [
  { key: 'label',       label: 'Label *',             placeholder: 'e.g. NX Main, Sales – Jane' },
  { key: 'contactName', label: 'Contact Name *',      placeholder: 'Jane Doe' },
  { key: 'phone',       label: 'Phone *',             placeholder: '+254 7XX XXX XXX' },
  { key: 'whatsapp',    label: 'WhatsApp (optional)', placeholder: 'Only if different from phone' },
  { key: 'email',       label: 'Email *',             placeholder: 'jane@nesturex.com', type: 'email' },
];

export default function AdminSettings() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<SavedContactProfile[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [busy,     setBusy]     = useState(false);
  const [error,    setError]    = useState('');
  // null = form closed, 'new' = creating, otherwise the _id being edited
  const [editing,  setEditing]  = useState<string | null>(null);
  const [draft,    setDraft]    = useState<Draft>(blankDraft());

  // Auth guard
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        load();
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setProfiles(await fetchContactProfiles());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contact profiles.');
    } finally {
      setLoading(false);
    }
  }

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError('');
    try {
      await action();
      await load();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  function openNew() {
    setDraft(blankDraft());
    setEditing('new');
  }

  function openEdit(p: SavedContactProfile) {
    setDraft({ label: p.label, contactName: p.contactName, phone: p.phone, whatsapp: p.whatsapp || '', email: p.email });
    setEditing(p._id);
  }

  async function save() {
    const ok = await run(() => editing === 'new'
      ? createContactProfile({ ...draft, isDefault: false })
      : updateContactProfile(editing!, draft));
    if (ok) setEditing(null);
  }

  async function remove(p: SavedContactProfile) {
    if (!confirm(`Delete contact profile "${p.label}"? Existing documents keep their saved contact details.`)) return;
    await run(() => deleteContactProfile(p._id));
  }

  const draftValid = !!(draft.label.trim() && draft.contactName.trim() && draft.phone.trim() && draft.email.trim());

  return (
    <>
      <AdminTopBar active="settings" />

      <AdminPage aria-busy={loading || undefined}>
        <PageHeader title="SETTINGS" />

        <div className="nxad-head">
          <div className="nxad-head-copy">
            <h2 className="nxad-kicker">Contact Profiles</h2>
            <p className="nxad-desc">
              The contact printed on quotes and invoices. The default is preselected on new documents.
              Each document keeps a copy, so edits here never change documents already saved.
            </p>
          </div>
          {editing === null && (
            <div className="nxad-head-action">
              <ClayButton onClick={openNew} disabled={loading} className="nxad-btn">
                <Plus size={16} aria-hidden /> Add profile
              </ClayButton>
            </div>
          )}
        </div>

        {error && <Notice>{error}</Notice>}

        {editing !== null && (
          <Section title={editing === 'new' ? 'New profile' : 'Edit profile'} className="nxad-editor">
            <div className="nxad-form-grid">
              {FIELDS.map(f => (
                <div key={f.key} className="nx-field">
                  <label htmlFor={`nxad-cp-${f.key}`}>{f.label}</label>
                  <input
                    id={`nxad-cp-${f.key}`}
                    type={f.type ?? 'text'}
                    value={draft[f.key]}
                    placeholder={f.placeholder}
                    onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    className="nx-input"
                  />
                </div>
              ))}
            </div>
            <div className="nxad-form-actions">
              <ClayButton variant="ghost" onClick={() => setEditing(null)} disabled={busy} className="nxad-btn">
                <X size={16} aria-hidden /> Cancel
              </ClayButton>
              <ClayButton onClick={save} disabled={!draftValid || busy} aria-busy={busy || undefined} className="nxad-btn">
                {busy ? <span className="nxad-spinner" aria-hidden="true" /> : <Save size={16} aria-hidden />}
                {busy ? 'Saving…' : editing === 'new' ? 'Create' : 'Update'}
              </ClayButton>
            </div>
          </Section>
        )}

        {loading ? (
          <SkeletonRows rows={2} tall label="Loading profiles…" />
        ) : profiles.length === 0 ? (
          <EmptyState title="No contact profiles" art="contact-chat" />
        ) : (
          <ul className="nxad-cards">
            {profiles.map(p => (
              <li key={p._id} className={p.isDefault ? 'nxad-card is-default' : 'nxad-card'}>
                <div className="nxad-profile">
                  <div className="nxad-profile-copy">
                    <div className="nxad-card-top nxad-card-top--start">
                      <span className="nxad-strong">{p.label}</span>
                      {p.isDefault && <StatusChip tone="green">Default</StatusChip>}
                    </div>
                    <p className="nxad-mono nxad-dim nxad-profile-line">
                      {p.contactName} · {p.phone}{p.whatsapp ? ` · WhatsApp ${p.whatsapp}` : ''} · {p.email}
                    </p>
                  </div>
                  <div className="nxad-profile-actions">
                    {!p.isDefault && (
                      <ClayButton variant="ghost" onClick={() => run(() => updateContactProfile(p._id, { isDefault: true }))} disabled={busy} className="nxad-btn">
                        <Star size={16} aria-hidden /> Set default
                      </ClayButton>
                    )}
                    <ClayButton variant="ghost" onClick={() => openEdit(p)} disabled={busy} className="nxad-btn">
                      <Pencil size={16} aria-hidden /> Edit
                    </ClayButton>
                    {!p.isDefault && (
                      <ClayButton onClick={() => remove(p)} disabled={busy} className="nxad-btn nxad-btn--danger">
                        <Trash2 size={16} aria-hidden /> Delete
                      </ClayButton>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPage>
    </>
  );
}
