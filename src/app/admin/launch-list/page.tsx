'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';

interface LaunchSignupEntry {
  email:     string;
  createdAt: string; // ISO
}

interface AdminLaunchGroup {
  projectSlug: string;
  projectName: string;
  count:       number;
  signups:     LaunchSignupEntry[];
}

function fmtCreated(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AdminLaunchListView() {
  const router = useRouter();
  const [groups,  setGroups]  = useState<AdminLaunchGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Auth guard
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        loadGroups();
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadGroups() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/launch-list');
      if (!res.ok) throw new Error('Failed to load launch list.');
      setGroups(await res.json() as AdminLaunchGroup[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load launch list.');
    } finally {
      setLoading(false);
    }
  }

  const totalSignups = groups.reduce((sum, g) => sum + g.count, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body), sans-serif', color: '#f5f5f5' }}>

      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <AdminTopBar active="launch-list" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.65)', marginBottom: '0.4rem' }}>
            Nesture-X Admin
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)', lineHeight: 0.95, margin: 0 }}>
            LAUNCH LIST
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
              Loading launch list…
            </p>
          </div>
        ) : groups.length === 0 ? (
          <div style={{ border: '1px dashed rgba(26,111,212,0.2)', padding: '4rem 2rem', textAlign: 'center' }}>
            <Rocket size={32} color="rgba(26,111,212,0.25)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              No signups yet
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.7)', marginBottom: '1.25rem' }}>
              {totalSignups} signup{totalSignups !== 1 ? 's' : ''} across {groups.length} project{groups.length !== 1 ? 's' : ''}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {groups.map(g => (
                <div key={g.projectSlug} style={{ border: '1px solid rgba(26,111,212,0.12)', overflow: 'hidden' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(13,27,62,0.6)', borderBottom: '1px solid rgba(26,111,212,0.15)', padding: '0.75rem 1rem',
                  }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--color-text)', letterSpacing: '0.02em' }}>
                      {g.projectName}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: '#5ba8f5', background: 'rgba(26,111,212,0.15)', border: '1px solid rgba(26,111,212,0.3)', padding: '0.2rem 0.6rem',
                    }}>
                      {g.count} waiting
                    </span>
                  </div>
                  {g.signups.map((s, i) => (
                    <div
                      key={`${g.projectSlug}-${i}`}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.65rem 1rem',
                        borderBottom: i < g.signups.length - 1 ? '1px solid rgba(26,111,212,0.07)' : 'none',
                        background: 'rgba(13,27,62,0.2)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>{s.email || '—'}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>{fmtCreated(s.createdAt)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
