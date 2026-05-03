import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import { getSavedQuotes, createSavedQuote } from '@/services/quoteService';
import type { Quote } from '@/types/quote';
import type { QuoteStatus } from '@/services/quoteService';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

// GET /api/admin/quotes  — list all quotes
export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const quotes = await getSavedQuotes();
    return NextResponse.json(quotes);
  } catch (err) {
    console.error('[admin/quotes GET]', err);
    return NextResponse.json({ error: 'Failed to fetch quotes.' }, { status: 500 });
  }
}

// POST /api/admin/quotes  — create a new quote
export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const body = await req.json() as { quote: Quote; status?: QuoteStatus };
    if (!body.quote?.quoteNumber) {
      return NextResponse.json({ error: 'Invalid quote data.' }, { status: 400 });
    }
    const saved = await createSavedQuote(body.quote, body.status ?? 'draft');
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('[admin/quotes POST]', err);
    return NextResponse.json({ error: 'Failed to save quote.' }, { status: 500 });
  }
}
