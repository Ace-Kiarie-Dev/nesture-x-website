'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, LogOut, Trash2, ExternalLink } from 'lucide-react';
import type { SavedQuote, QuoteStatus } from '@/services/quoteService';
import { fmt, fmtDate, grandTotal } from '@/types/quote';

// ── Status badge colours ──────────────────────────────────────────────────────

const STATUS_COLORS: Record<QuoteStatus, { bg: string; color: string }> = {
  draft:    { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' },
  sent:     { bg: 'rgba(26,111,212,0.15)',  color: '#5ba8f5' },
  approved: { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80' },
  declined: { bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
  expired:  { bg: 'rgba(234,179,8,0.1)',    color: '#fbbf24' },
};

function StatusPill({ status }: { status: QuoteStatus }) {
  const col = STATUS_COLORS[status];
  return (
    <span style={{
      display:       'inline-block',
      background:    col.bg,
      color:         col.color,
      border:        `1px solid ${col.color}30`,
      fontFamily:    'var(--font-mono)',
      fontSize:      '0.55rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      padding:       '0.2rem 0.55rem',
    }}>
      {status}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AdminQuotesList() {
  const router = useRouter();
  const [quotes,   setQuotes]   = useState<SavedQuote[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState('');

  // Auth guard
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        loadQuotes();
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadQuotes() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/quotes');
      if (!res.ok) throw new Error('Failed to load quotes.');
      setQuotes(await res.json() as SavedQuote[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quotes.');
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuote(id: string) {
    if (!confirm('Delete this quote? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/quotes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed.');
      setQuotes(prev => prev.filter(q => q._id !== id));
    } catch {
      setError('Delete failed. Try again.');
    } finally {
      setDeleting(null);
    }
  }

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.replace('/admin');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body), sans-serif', color: '#f5f5f5' }}>

      {/* Grid overlay */}
      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26,111,212,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-text)', letterSpacing: '0.05em' }}>
            NX ADMIN
          </span>
          <span style={{ width: '1px', height: '18px', background: 'rgba(26,111,212,0.3)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={13} color="rgba(26,111,212,0.7)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              Quotations
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => router.push('/admin/quotes/new')}
            style={{
              background: 'var(--color-primary)', border: 'none', color: '#fff',
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.4rem 1rem', cursor: 'pointer', transition: 'opacity 0.18s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <Plus size={11} /> New Quote
          </button>
          <button
            onClick={logout}
            style={{
              background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.4rem 0.6rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.18s',
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)')}
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)' }}>

        {/* Page heading */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.65)', marginBottom: '0.4rem' }}>
            Nesture-X Admin
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)', lineHeight: 0.95, margin: 0 }}>
            QUOTATIONS
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', padding: '0.75rem 1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#f87171', letterSpacing: '0.04em' }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.5)' }}>
              Loading quotes…
            </p>
          </div>
        ) : quotes.length === 0 ? (
          /* Empty state */
          <div style={{
            border: '1px dashed rgba(26,111,212,0.2)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}>
            <FileText size={32} color="rgba(26,111,212,0.25)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
              No quotes yet
            </p>
            <button
              onClick={() => router.push('/admin/quotes/new')}
              style={{
                background: 'transparent', border: '1px solid rgba(26,111,212,0.35)',
                color: 'rgba(26,111,212,0.8)', fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '0.6rem 1.2rem', cursor: 'pointer', transition: 'all 0.18s',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(26,111,212,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Plus size={12} /> Create first quote
            </button>
          </div>
        ) : (
          /* Quotes table */
          <div style={{ border: '1px solid rgba(26,111,212,0.12)', overflow: 'hidden' }}>

            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 120px 110px 90px 80px',
              background: 'rgba(13,27,62,0.6)',
              borderBottom: '1px solid rgba(26,111,212,0.15)',
              padding: '0.6rem 1rem',
            }}>
              {['Quote No.', 'Client', 'Date', 'Total', 'Status', ''].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {quotes.map((q, i) => {
              const total = grandTotal(q.lines, q.discountType, q.discountValue);
              return (
                <div
                  key={q._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 120px 110px 90px 80px',
                    padding: '0.85rem 1rem',
                    borderBottom: i < quotes.length - 1 ? '1px solid rgba(26,111,212,0.07)' : 'none',
                    background: 'rgba(13,27,62,0.2)',
                    transition: 'background 0.15s',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(26,111,212,0.07)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(13,27,62,0.2)')}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#5ba8f5', letterSpacing: '0.05em' }}>
                    {q.quoteNumber}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#f5f5f5', marginBottom: '0.15rem' }}>
                      {q.clientName}
                    </div>
                    {q.clientCompany && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                        {q.clientCompany}
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>
                    {fmtDate(q.date)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#f5f5f5', fontWeight: 600 }}>
                    {fmt(total)}
                  </span>
                  <StatusPill status={q.status} />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      title="Edit quote"
                      onClick={() => router.push(`/admin/quotes/${q._id}`)}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(26,111,212,0.55)', cursor: 'pointer', padding: '0.3rem', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#5ba8f5')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(26,111,212,0.55)')}
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button
                      title="Delete quote"
                      onClick={() => deleteQuote(q._id)}
                      disabled={deleting === q._id}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,80,80,0.35)', cursor: deleting === q._id ? 'wait' : 'pointer', padding: '0.3rem', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,0.8)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,0.35)')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

          </div>
        )}

        {/* Quote count */}
        {!loading && quotes.length > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.22)', marginTop: '1rem', textAlign: 'right' }}>
            {quotes.length} quote{quotes.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
}
