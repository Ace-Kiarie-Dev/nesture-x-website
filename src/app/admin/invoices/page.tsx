'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminPage, EmptyState, Notice, PageHeader, SkeletonRows, StatusChip, type Tone } from '@/components/admin/ui';
import { ClayButton } from '@/components/redesign';
import type { SavedInvoice } from '@/services/invoiceService';
import { fetchInvoices, deleteInvoice } from '@/services/invoiceClient';
import { fmt, fmtDate, grandTotal, type PaymentStatus } from '@/types/invoice';

// ── Status chip tones (colour + text, see components/admin/ui.tsx) ────────────

const PAYMENT_TONE: Record<PaymentStatus, Tone> = {
  unpaid:  'red',
  partial: 'amber',
  paid:    'green',
};
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
    <>
      <AdminTopBar
        active="invoices"
        actions={
          <ClayButton onClick={() => router.push('/admin/invoices/new')} className="nxad-btn">
            <Plus size={16} aria-hidden /> New Invoice
          </ClayButton>
        }
      />

      <AdminPage aria-busy={loading || undefined}>
        <PageHeader
          title="INVOICES"
          count={!loading && invoices.length > 0 ? `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}` : undefined}
        />

        {/* Error */}
        {error && <Notice>{error}</Notice>}

        {/* Loading */}
        {loading ? (
          <SkeletonRows rows={5} label="Loading invoices…" />
        ) : invoices.length === 0 ? (
          /* Empty state */
          <EmptyState
            title="No invoices yet"
            art="tool-receipt"
            action={
              <ClayButton onClick={() => router.push('/admin/invoices/new')} className="nxad-btn">
                <Plus size={16} aria-hidden /> Create first invoice
              </ClayButton>
            }
          />
        ) : (
          /* Invoices table: stacks into cards below 640px */
          <div className="nxad-table-wrap">
            <table className="nxad-table nxad-table--stack">
              <thead>
                <tr>
                  <th scope="col">Invoice No.</th>
                  <th scope="col">Client</th>
                  <th scope="col">Due Date</th>
                  <th scope="col" className="is-num">Total</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="is-actions"><span className="nx-sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const total = grandTotal(inv.lines, inv.discountType, inv.discountValue);
                  return (
                    <tr key={inv._id}>
                      <td data-label="Invoice No." className="nxad-mono nxad-link">{inv.documentNumber}</td>
                      <td data-label="Client" className="is-full">
                        <span className="nxad-strong nxad-trunc" title={inv.clientName}>{inv.clientName}</span>
                        {inv.clientCompany && <span className="nxad-sub nxad-trunc" title={inv.clientCompany}>{inv.clientCompany}</span>}
                      </td>
                      <td data-label="Due Date" className="nxad-mono nxad-dim">{fmtDate(inv.dueDate)}</td>
                      <td data-label="Total" className="is-num nxad-mono nxad-strong">{fmt(total)}</td>
                      <td data-label="Status"><StatusChip tone={PAYMENT_TONE[inv.paymentStatus]}>{inv.paymentStatus}</StatusChip></td>
                      <td className="is-actions">
                        <span className="nxad-row-actions">
                          <button
                            type="button"
                            title="Edit invoice"
                            aria-label={`Edit invoice ${inv.documentNumber}`}
                            onClick={() => router.push(`/admin/invoices/${inv._id}`)}
                            className="nxad-icon-btn"
                          >
                            <ExternalLink size={16} aria-hidden />
                          </button>
                          <button
                            type="button"
                            title="Delete invoice"
                            aria-label={`Delete invoice ${inv.documentNumber}`}
                            onClick={() => removeInvoice(inv._id)}
                            disabled={deleting === inv._id}
                            aria-busy={deleting === inv._id || undefined}
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
