'use client';

import QuoteForm from '@/components/admin/QuoteForm';
import type { SavedInvoice } from '@/services/invoiceService';

export default function InvoiceFormClient({ invoice }: { invoice: SavedInvoice }) {
  return <QuoteForm mode="edit" initialInvoice={invoice} />;
}
