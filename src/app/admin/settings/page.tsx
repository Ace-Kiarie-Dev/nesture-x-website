'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Star, X, Save } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { inp, lbl } from '@/components/admin/QuoteForm';
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

const btn: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(26,111,212,0.3)', color: 'rgba(26,111,212,0.85)',
  fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase',
  padding: '0.35rem 0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
};

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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body), sans-serif', color: '#f5f5f5' }}>

      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <AdminTopBar active="settings" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.65)', marginBottom: '0.4rem' }}>
            Nesture-X Admin
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)', lineHeight: 0.95, margin: 0 }}>
            SETTINGS
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.7)', margin: 0 }}>
              Contact Profiles
            </p>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: '0.3rem 0 0' }}>
              The contact printed on quotes and invoices. The default is preselected on new documents.
              Each document keeps a copy, so edits here never change documents already saved.
            </p>
          </div>
          {editing === null && (
            <button onClick={openNew} disabled={loading} style={btn}><Plus size={11} /> Add profile</button>
          )}
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.75rem 1rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#f87171', letterSpacing: '0.04em' }}>
            {error}
          </div>
        )}

        {editing !== null && (
          <div style={{ background: 'rgba(13,27,62,0.45)', border: '1px solid rgba(26,111,212,0.25)', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label style={lbl}>{f.label}</label>
                  <input
                    type={f.type ?? 'text'}
                    value={draft[f.key]}
                    placeholder={f.placeholder}
                    onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                    style={inp}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                onClick={save}
                disabled={!draftValid || busy}
                style={{ ...btn, background: draftValid && !busy ? 'var(--color-primary)' : 'rgba(26,111,212,0.2)', color: '#fff', border: 'none', cursor: draftValid && !busy ? 'pointer' : 'not-allowed' }}
              >
                <Save size={11} /> {busy ? 'Saving…' : editing === 'new' ? 'Create' : 'Update'}
              </button>
              <button onClick={() => setEditing(null)} disabled={busy} style={{ ...btn, color: 'rgba(255,255,255,0.5)', borderColor: 'rgba(255,255,255,0.15)' }}>
                <X size={11} /> Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.5)', padding: '2rem 0', textAlign: 'center' }}>
            Loading profiles…
          </p>
        ) : (
          <div style={{ border: '1px solid rgba(26,111,212,0.12)', overflow: 'hidden' }}>
            {profiles.map((p, i) => (
              <div
                key={p._id}
                style={{
                  padding: '1rem', borderBottom: i < profiles.length - 1 ? '1px solid rgba(26,111,212,0.07)' : 'none',
                  background: p.isDefault ? 'rgba(26,111,212,0.08)' : 'rgba(13,27,62,0.2)',
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem',
                }}
              >
                <div style={{ flex: '1 1 260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{p.label}</span>
                    {p.isDefault && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4ade80', background: 'rgba(34,197,94,0.12)', padding: '0.15rem 0.45rem' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                    {p.contactName} · {p.phone}{p.whatsapp ? ` · WhatsApp ${p.whatsapp}` : ''} · {p.email}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {!p.isDefault && (
                    <button onClick={() => run(() => updateContactProfile(p._id, { isDefault: true }))} disabled={busy} style={btn}>
                      <Star size={11} /> Set default
                    </button>
                  )}
                  <button onClick={() => openEdit(p)} disabled={busy} style={btn}><Pencil size={11} /> Edit</button>
                  {!p.isDefault && (
                    <button onClick={() => remove(p)} disabled={busy} style={{ ...btn, color: 'rgba(255,80,80,0.75)', borderColor: 'rgba(255,80,80,0.3)' }}>
                      <Trash2 size={11} /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
