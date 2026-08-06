'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Trash2, ExternalLink } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import type { SavedInvoice } from '@/services/invoiceService';
import { fetchInvoices, deleteInvoice } from '@/services/invoiceClient';
import { fmt, fmtDate, grandTotal, type PaymentStatus } from '@/types/invoice';

// ── Status badge colours ──────────────────────────────────────────────────────

const STATUS_COLORS: Record<PaymentStatus, { bg: string; color: string }> = {
  unpaid:  { bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
  partial: { bg: 'rgba(234,179,8,0.1)',   color: '#fbbf24' },
  paid:    { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
};

function StatusPill({ status }: { status: PaymentStatus }) {
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

export default function AdminInvoicesList() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<SavedInvoice[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error,    setError]    = useState('');

  // Auth guard
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        loadInvoices();
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadInvoices() {
    setLoading(true);
    setError('');
    try {
      setInvoices(await fetchInvoices());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  }

  async function removeInvoice(id: string) {
    if (!confirm('Delete this invoice? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteInvoice(id);
      setInvoices(prev => prev.filter(inv => inv._id !== id));
    } catch {
      setError('Delete failed. Try again.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body), sans-serif', color: '#f5f5f5' }}>

      {/* Grid overlay */}
      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <AdminTopBar
        active="invoices"
        actions={
          <button
            onClick={() => router.push('/admin/invoices/new')}
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
            <Plus size={11} /> New Invoice
          </button>
        }
      />

      {/* Body */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)' }}>

        {/* Page heading */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.65)', marginBottom: '0.4rem' }}>
            Nesture-X Admin
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--color-text)', lineHeight: 0.95, margin: 0 }}>
            INVOICES
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
              Loading invoices…
            </p>
          </div>
        ) : invoices.length === 0 ? (
          /* Empty state */
          <div style={{
            border: '1px dashed rgba(26,111,212,0.2)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}>
            <FileText size={32} color="rgba(26,111,212,0.25)" style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.5rem' }}>
              No invoices yet
            </p>
            <button
              onClick={() => router.push('/admin/invoices/new')}
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
              <Plus size={12} /> Create first invoice
            </button>
          </div>
        ) : (
          /* Invoices table */
          <div style={{ border: '1px solid rgba(26,111,212,0.12)', overflow: 'hidden' }}>

            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 120px 110px 90px 80px',
              background: 'rgba(13,27,62,0.6)',
              borderBottom: '1px solid rgba(26,111,212,0.15)',
              padding: '0.6rem 1rem',
            }}>
              {['Invoice No.', 'Client', 'Due Date', 'Total', 'Status', ''].map(h => (
                <span key={h} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {invoices.map((inv, i) => {
              const total = grandTotal(inv.lines, inv.discountType, inv.discountValue);
              return (
                <div
                  key={inv._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr 120px 110px 90px 80px',
                    padding: '0.85rem 1rem',
                    borderBottom: i < invoices.length - 1 ? '1px solid rgba(26,111,212,0.07)' : 'none',
                    background: 'rgba(13,27,62,0.2)',
                    transition: 'background 0.15s',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(26,111,212,0.07)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(13,27,62,0.2)')}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#5ba8f5', letterSpacing: '0.05em' }}>
                    {inv.documentNumber}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 500, color: '#f5f5f5', marginBottom: '0.15rem' }}>
                      {inv.clientName}
                    </div>
                    {inv.clientCompany && (
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
                        {inv.clientCompany}
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>
                    {fmtDate(inv.dueDate)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#f5f5f5', fontWeight: 600 }}>
                    {fmt(total)}
                  </span>
                  <StatusPill status={inv.paymentStatus} />
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      title="Edit invoice"
                      onClick={() => router.push(`/admin/invoices/${inv._id}`)}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(26,111,212,0.55)', cursor: 'pointer', padding: '0.3rem', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#5ba8f5')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(26,111,212,0.55)')}
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button
                      title="Delete invoice"
                      onClick={() => removeInvoice(inv._id)}
                      disabled={deleting === inv._id}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,80,80,0.35)', cursor: deleting === inv._id ? 'wait' : 'pointer', padding: '0.3rem', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
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

        {/* Invoice count */}
        {!loading && invoices.length > 0 && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.22)', marginTop: '1rem', textAlign: 'right' }}>
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
          </p>
        )}

      </div>
    </div>
  );
}
