'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminPage, EmptyState, Notice, PageHeader, SkeletonRows, StatRow, StatTile, StatusChip } from '@/components/admin/ui';
import type { AdminBooking } from '@/services/bookingService';
import { formatDateLabel, formatSlotLabel, toDateKey } from '@/lib/bookingSlots';

function fmtCreated(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function whenLabel(b: AdminBooking): string {
  if (b.date) return `${formatDateLabel(b.date)}${b.timeSlot ? ' · ' + formatSlotLabel(b.timeSlot) : ''}`;
  return b.status ? `Legacy record · ${b.status}` : 'Legacy record';
}

function BookingRow({ b }: { b: AdminBooking }) {
  return (
    <tr>
      <td data-label="Name" className="is-full"><span className="nxad-strong nxad-trunc" title={b.name}>{b.name || '—'}</span></td>
      <td data-label="Email" className="is-full"><span className="nxad-mono nxad-trunc" title={b.email}>{b.email || '—'}</span></td>
      <td data-label="Phone" className="nxad-mono nxad-dim nxad-nowrap">{b.phone || '—'}</td>
      <td data-label="Service">{b.service || '—'}</td>
      <td data-label="Date & Time" className="is-full">
        {b.date
          ? <span className="nxad-mono nxad-link">{whenLabel(b)}</span>
          : <StatusChip tone="amber">{whenLabel(b)}</StatusChip>}
      </td>
      <td data-label="Booked" className="nxad-mono nxad-dim nxad-nowrap">{fmtCreated(b.createdAt)}</td>
    </tr>
  );
}

function BookingTable({ bookings }: { bookings: AdminBooking[] }) {
  if (bookings.length === 0) {
    return (
      <p className="nxad-none">Nothing here</p>
    );
  }
  return (
    <div className="nxad-table-wrap">
      <table className="nxad-table nxad-table--stack">
        <thead>
          <tr>
            {['Name', 'Email', 'Phone', 'Service', 'Date & Time', 'Booked'].map(h => (
              <th key={h} scope="col">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => <BookingRow key={b._id} b={b} />)}
        </tbody>
      </table>
    </div>
  );
}
export default function AdminBookingsList() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [showPast, setShowPast] = useState(false);

  // Auth guard
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        loadBookings();
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadBookings() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/bookings');
      if (!res.ok) throw new Error('Failed to load bookings.');
      setBookings(await res.json() as AdminBooking[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }

  const todayKey = toDateKey(new Date());

  // No date at all (legacy schema) is treated as past — there's nothing "upcoming" about it.
  const upcoming = bookings
    .filter(b => !!b.date && b.date >= todayKey)
    .sort((a, b) => `${a.date}${a.timeSlot ?? ''}`.localeCompare(`${b.date}${b.timeSlot ?? ''}`));

  const past = bookings
    .filter(b => !b.date || b.date < todayKey)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <AdminTopBar active="bookings" />

      <AdminPage aria-busy={loading || undefined}>
        <PageHeader title="BOOKINGS" />

        {error && <Notice>{error}</Notice>}

        {loading ? (
          <SkeletonRows rows={4} label="Loading bookings…" />
        ) : bookings.length === 0 ? (
          <EmptyState title="No bookings yet" art="calendar-cutout" />
        ) : (
          <>
            <StatRow>
              <StatTile label={`Upcoming consultation${upcoming.length !== 1 ? 's' : ''}`} value={upcoming.length} />
              <StatTile label="Past & legacy" value={past.length} />
            </StatRow>

            <section className="nxad-block" aria-labelledby="nxad-upcoming">
              <h2 id="nxad-upcoming" className="nxad-kicker">
                {upcoming.length} upcoming consultation{upcoming.length !== 1 ? 's' : ''}
              </h2>
              <BookingTable bookings={upcoming} />
            </section>

            <section className="nxad-block">
              <button
                type="button"
                onClick={() => setShowPast(p => !p)}
                aria-expanded={showPast}
                className="nxad-disclosure"
              >
                {showPast ? <ChevronDown size={16} aria-hidden /> : <ChevronRight size={16} aria-hidden />}
                Past &amp; legacy bookings ({past.length})
              </button>

              {showPast && <BookingTable bookings={past} />}
            </section>
          </>
        )}
      </AdminPage>
    </>
  );
}
