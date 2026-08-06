import { notFound } from 'next/navigation';
import { getSavedInvoiceById } from '@/services/invoiceService';
import { getAdminSession } from '@/lib/adminToken';
import InvoiceFormClient from './InvoiceFormClient';

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Server-side auth guard
  const authed = await getAdminSession();
  if (!authed) {
    // Redirect via the login page (soft redirect handled client-side)
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace('/admin');`,
        }}
      />
    );
  }

  const { id }    = await params;
  const invoice   = await getSavedInvoiceById(id);
  if (!invoice) notFound();

  return <InvoiceFormClient invoice={invoice} />;
}
