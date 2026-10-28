'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminPage, EmptyState, Notice, PageHeader, SkeletonRows, StatusChip, type Tone } from '@/components/admin/ui';
import { ClayButton } from '@/components/redesign';
import type { SavedQuote, QuoteStatus } from '@/services/quoteService';
import { fmt, fmtDate, grandTotal } from '@/types/quote';

// ── Status chip tones (colour + text, see components/admin/ui.tsx) ────────────

const QUOTE_TONE: Record<QuoteStatus, Tone> = {
  draft:    'neutral',
  sent:     'blue',
  approved: 'green',
  declined: 'red',
  expired:  'amber',
};
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

  return (
    <>
      <AdminTopBar
        active="quotes"
        actions={
          <ClayButton onClick={() => router.push('/admin/quotes/new')} className="nxad-btn">
            <Plus size={16} aria-hidden /> New Quote
          </ClayButton>
        }
      />

      <AdminPage aria-busy={loading || undefined}>
        <PageHeader
          title="QUOTATIONS"
          count={!loading && quotes.length > 0 ? `${quotes.length} quote${quotes.length !== 1 ? 's' : ''}` : undefined}
        />

        {/* Error */}
        {error && <Notice>{error}</Notice>}

        {/* Loading */}
        {loading ? (
          <SkeletonRows rows={5} label="Loading quotes…" />
        ) : quotes.length === 0 ? (
          /* Empty state */
          <EmptyState
            title="No quotes yet"
            art="tool-receipt"
            action={
              <ClayButton onClick={() => router.push('/admin/quotes/new')} className="nxad-btn">
                <Plus size={16} aria-hidden /> Create first quote
              </ClayButton>
            }
          />
        ) : (
          /* Quotes table: stacks into cards below 640px */
          <div className="nxad-table-wrap">
            <table className="nxad-table nxad-table--stack">
              <thead>
                <tr>
                  <th scope="col">Quote No.</th>
                  <th scope="col">Client</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="is-num">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="is-actions"><span className="nx-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {quotes.map(q => {
                  const total = grandTotal(q.lines, q.discountType, q.discountValue);
                  return (
                    <tr key={q._id}>
                      <td data-label="Quote No." className="nxad-mono nxad-link">{q.quoteNumber}</td>
                      <td data-label="Client" className="is-full">
                        <span className="nxad-strong nxad-trunc" title={q.clientName}>{q.clientName}</span>
                        {q.clientCompany && <span className="nxad-sub nxad-trunc" title={q.clientCompany}>{q.clientCompany}</span>}
                      </td>
                      <td data-label="Date" className="nxad-mono nxad-dim">{fmtDate(q.date)}</td>
                      <td data-label="Total" className="is-num nxad-mono nxad-strong">{fmt(total)}</td>
                      <td data-label="Status"><StatusChip tone={QUOTE_TONE[q.status]}>{q.status}</StatusChip></td>
                      <td className="is-actions">
                        <span className="nxad-row-actions">
                          <button
                            type="button"
                            title="Edit quote"
                            aria-label={`Edit quote ${q.quoteNumber}`}
                            onClick={() => router.push(`/admin/quotes/${q._id}`)}
                            className="nxad-icon-btn"
                          >
                            <ExternalLink size={16} aria-hidden />
                          </button>
                          <button
                            type="button"
                            title="Delete quote"
                            aria-label={`Delete quote ${q.quoteNumber}`}
                            onClick={() => deleteQuote(q._id)}
                            disabled={deleting === q._id}
                            aria-busy={deleting === q._id || undefined}
                            className="nxad-icon-btn nxad-icon-btn--danger"
                          >
                            <Trash2 size={16} aria-hidden />
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminPage>
    </>
  );
}
