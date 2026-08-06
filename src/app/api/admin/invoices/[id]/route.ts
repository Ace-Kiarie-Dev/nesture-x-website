import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import {
  getSavedInvoiceById,
  updateSavedInvoice,
  deleteSavedInvoice,
} from '@/services/invoiceService';
import type { Invoice } from '@/types/invoice';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

// GET /api/admin/invoices/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id }    = await params;
  const invoice   = await getSavedInvoiceById(id);
  if (!invoice) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(invoice);
}

// PUT /api/admin/invoices/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id }   = await params;
  const body     = await req.json() as Partial<Invoice>;
  const updated  = await updateSavedInvoice(id, body);
  if (!updated) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/admin/invoices/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  const ok     = await deleteSavedInvoice(id);
  if (!ok) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
