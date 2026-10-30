'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminPage, EmptyState, Notice, PageHeader, Section, SkeletonRows, StatRow, StatTile, StatusChip } from '@/components/admin/ui';

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
    <>
      <AdminTopBar active="launch-list" />

      <AdminPage aria-busy={loading || undefined}>
        <PageHeader title="LAUNCH LIST" />

        {error && <Notice>{error}</Notice>}

        {loading ? (
          <SkeletonRows rows={4} label="Loading launch list…" />
        ) : groups.length === 0 ? (
          <EmptyState title="No signups yet" art="misc-rocket" />
        ) : (
          <>
            <StatRow>
              <StatTile label={`Signup${totalSignups !== 1 ? 's' : ''}`} value={totalSignups} />
              <StatTile label={`Project${groups.length !== 1 ? 's' : ''}`} value={groups.length} />
            </StatRow>

            <p className="nxad-kicker">
              {totalSignups} signup{totalSignups !== 1 ? 's' : ''} across {groups.length} project{groups.length !== 1 ? 's' : ''}
            </p>

            <div className="nxad-groups">
              {groups.map(g => (
                <Section
                  key={g.projectSlug}
                  title={g.projectName}
                  className="nxad-group"
                  aside={<StatusChip tone="blue">{g.count} waiting</StatusChip>}
                >
                  <ul className="nxad-rows">
                    {g.signups.map((s, i) => (
                      <li key={`${g.projectSlug}-${i}`} className="nxad-row">
                        <span className="nxad-mono nxad-trunc" title={s.email}>{s.email || '—'}</span>
                        <span className="nxad-mono nxad-dim nxad-nowrap">{fmtCreated(s.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              ))}
            </div>
          </>
        )}
      </AdminPage>
    </>
  );
}
