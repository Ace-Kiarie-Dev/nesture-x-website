// Browser-side fetch wrapper for the invoices API — keeps invoice network
// calls out of components, unlike the quote form's inline fetch() calls.
import type { Invoice } from '@/types/invoice';
import type { SavedInvoice } from '@/services/invoiceService';

export async function fetchInvoices(): Promise<SavedInvoice[]> {
  const res = await fetch('/api/admin/invoices');
  if (!res.ok) throw new Error('Failed to load invoices.');
  return res.json() as Promise<SavedInvoice[]>;
}

export async function createInvoice(invoice: Invoice): Promise<SavedInvoice> {
  const res = await fetch('/api/admin/invoices', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ invoice }),
  });
  if (!res.ok) throw new Error('Save failed.');
  return res.json() as Promise<SavedInvoice>;
}

export async function updateInvoice(id: string, invoice: Invoice): Promise<SavedInvoice> {
  const res = await fetch(`/api/admin/invoices/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(invoice),
  });
  if (!res.ok) throw new Error('Save failed.');
  return res.json() as Promise<SavedInvoice>;
}

export async function deleteInvoice(id: string): Promise<void> {
  const res = await fetch(`/api/admin/invoices/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed.');
}

/** Requests the invoice PDF and triggers a browser download. */
export async function downloadInvoicePDF(invoice: Invoice): Promise<void> {
  const res = await fetch('/api/admin/invoice/pdf', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(invoice),
  });
  if (!res.ok) throw new Error('PDF generation failed.');
  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `${invoice.documentNumber}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
