'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarDays, ChevronDown, ChevronRight } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import type { AdminBooking } from '@/services/bookingService';
import { formatDateLabel, formatSlotLabel, toDateKey } from '@/lib/bookingSlots';

const COLUMNS = '1.1fr 1.3fr 130px 1fr 190px 110px';

function fmtCreated(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function whenLabel(b: AdminBooking): string {
  if (b.date) return `${formatDateLabel(b.date)}${b.timeSlot ? ' · ' + formatSlotLabel(b.timeSlot) : ''}`;
  return b.status ? `Legacy record · ${b.status}` : 'Legacy record';
}

function BookingRow({ b, last }: { b: AdminBooking; last: boolean }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: COLUMNS, padding: '0.85rem 1rem',
      borderBottom: last ? 'none' : '1px solid rgba(26,111,212,0.07)',
      background: 'rgba(13,27,62,0.2)', alignItems: 'center', gap: '0.5rem',
    }}>
      <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#f5f5f5' }}>{b.name || '—'}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', wordBreak: 'break-all' }}>{b.email || '—'}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>{b.phone || '—'}</span>
      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)' }}>{b.service || '—'}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: b.date ? '#5ba8f5' : 'rgba(234,179,8,0.7)' }}>{whenLabel(b)}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{fmtCreated(b.createdAt)}</span>
    </div>
  );
}

function BookingTable({ bookings }: { bookings: AdminBooking[] }) {
  if (bookings.length === 0) {
    return (
      <div style={{ border: '1px dashed rgba(26,111,212,0.2)', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
          Nothing here
        </p>
      </div>
    );
  }
  return (
    <div style={{ border: '1px solid rgba(26,111,212,0.12)', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: COLUMNS, background: 'rgba(13,27,62,0.6)', borderBottom: '1px solid rgba(26,111,212,0.15)', padding: '0.6rem 1rem', gap: '0.5rem' }}>
        {['Name', 'Email', 'Phone', 'Service', 'Date & Time', 'Booked'].map(h => (
          <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
            {h}
          </span>
        ))}
      </div>
      {bookings.map((b, i) => <BookingRow key={b._id} b={b} last={i === bookings.length - 1} />)}
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
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body), sans-serif', color: '#f5f5f5' }}>

      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <AdminTopBar active="bookings" />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.65)', marginBottom: '0.4rem' }}>
            Nesture-X Admin
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)', lineHeight: 0.95, margin: 0 }}>
            BOOKINGS
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
              Loading bookings…
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ border: '1px dashed rgba(26,111,212,0.2)', padding: '4rem 2rem', textAlign: 'center' }}>
            <CalendarDays size={32} color="rgba(26,111,212,0.25)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
              No bookings yet
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.7)', marginBottom: '0.75rem' }}>
              {upcoming.length} upcoming consultation{upcoming.length !== 1 ? 's' : ''}
            </p>

            <div style={{ marginBottom: '2rem' }}>
              <BookingTable bookings={upcoming} />
            </div>

            <button
              onClick={() => setShowPast(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', padding: '0.4rem 0', marginBottom: showPast ? '0.75rem' : 0,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
            >
              {showPast ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Past &amp; legacy bookings ({past.length})
            </button>

            {showPast && <BookingTable bookings={past} />}
          </>
        )}

      </div>
    </div>
  );
}
