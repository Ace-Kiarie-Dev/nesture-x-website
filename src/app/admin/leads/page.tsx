'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Inbox } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';

interface AdminLead {
  _id:       string;
  name?:     string;
  email?:    string;
  phone?:    string;
  brief?:    string;
  createdAt: string; // ISO
}

function fmtCreated(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminLeadsList() {
  const router = useRouter();
  const [leads,   setLeads]   = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Auth guard
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        loadLeads();
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLeads() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) throw new Error('Failed to load leads.');
      setLeads(await res.json() as AdminLead[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body), sans-serif', color: '#f5f5f5' }}>

      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <AdminTopBar active="leads" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.65)', marginBottom: '0.4rem' }}>
            Nesture-X Admin
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)', lineHeight: 0.95, margin: 0 }}>
            LEADS
          </h1>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#f87171', letterSpacing: '0.04em' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.5)' }}>
              Loading leads…
            </p>
          </div>
        ) : leads.length === 0 ? (
          <div style={{ border: '1px dashed rgba(26,111,212,0.2)', padding: '4rem 2rem', textAlign: 'center' }}>
            <Inbox size={32} color="rgba(26,111,212,0.25)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              No leads yet
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.7)', marginBottom: '0.75rem' }}>
              {leads.length} lead{leads.length !== 1 ? 's' : ''}
            </p>

            <div style={{ border: '1px solid rgba(26,111,212,0.12)', overflow: 'hidden' }}>
              {leads.map((l, i) => (
                <div
                  key={l._id}
                  style={{
                    padding: '1rem', borderBottom: i < leads.length - 1 ? '1px solid rgba(26,111,212,0.07)' : 'none',
                    background: 'rgba(13,27,62,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#f5f5f5' }}>{l.name || '—'}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>{l.email || '—'}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)' }}>{l.phone || '—'}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', marginLeft: 'auto' }}>{fmtCreated(l.createdAt)}</span>
                  </div>
                  <p
                    title={l.brief}
                    style={{
                      fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}
                  >
                    {l.brief || '—'}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
