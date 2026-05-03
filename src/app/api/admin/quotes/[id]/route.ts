import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import {
  getSavedQuoteById,
  updateSavedQuote,
  deleteSavedQuote,
} from '@/services/quoteService';
import type { Quote } from '@/types/quote';
import type { QuoteStatus } from '@/services/quoteService';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

// GET /api/admin/quotes/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  const quote  = await getSavedQuoteById(id);
  if (!quote) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(quote);
}

// PUT /api/admin/quotes/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id }   = await params;
  const body     = await req.json() as Partial<Quote & { status: QuoteStatus }>;
  const updated  = await updateSavedQuote(id, body);
  if (!updated) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/admin/quotes/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  const ok     = await deleteSavedQuote(id);
  if (!ok) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
