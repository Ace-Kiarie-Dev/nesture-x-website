'use client';

import QuoteForm from '@/components/admin/QuoteForm';
import type { SavedQuote } from '@/services/quoteService';

export default function QuoteFormClient({ quote }: { quote: SavedQuote }) {
  return <QuoteForm mode="edit" initial={quote} />;
}
