import { notFound } from 'next/navigation';
import { getSavedQuoteById } from '@/services/quoteService';
import { getAdminSession } from '@/lib/adminToken';
import QuoteFormClient from './QuoteFormClient';

export default async function EditQuotePage({
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

  const { id } = await params;
  const quote  = await getSavedQuoteById(id);
  if (!quote) notFound();

  return <QuoteFormClient quote={quote} />;
}
