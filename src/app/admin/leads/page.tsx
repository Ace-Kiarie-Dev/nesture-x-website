'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminPage, EmptyState, Notice, PageHeader, SkeletonRows } from '@/components/admin/ui';

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
    <>
      <AdminTopBar active="leads" />

      <AdminPage aria-busy={loading || undefined}>
        <PageHeader
          title="LEADS"
          count={!loading && leads.length > 0 ? `${leads.length} lead${leads.length !== 1 ? 's' : ''}` : undefined}
        />

        {error && <Notice>{error}</Notice>}

        {loading ? (
          <SkeletonRows rows={4} tall label="Loading leads…" />
        ) : leads.length === 0 ? (
          <EmptyState title="No leads yet" art="envelope-cutout" />
        ) : (
          <ul className="nxad-cards">
            {leads.map(l => (
              <li key={l._id} className="nxad-card">
                <div className="nxad-card-top">
                  <span className="nxad-strong">{l.name || '—'}</span>
                  <span className="nxad-mono nxad-dim nxad-nowrap">{fmtCreated(l.createdAt)}</span>
                </div>
                <div className="nxad-card-meta">
                  <span className="nxad-mono nxad-trunc" title={l.email}>{l.email || '—'}</span>
                  <span className="nxad-mono nxad-dim nxad-nowrap">{l.phone || '—'}</span>
                </div>
                <p title={l.brief} className="nxad-card-text">
                  {l.brief || '—'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminPage>
    </>
  );
}
