import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import { getSavedInvoices, createSavedInvoice } from '@/services/invoiceService';
import type { Invoice } from '@/types/invoice';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

// GET /api/admin/invoices  — list all invoices
export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const invoices = await getSavedInvoices();
    return NextResponse.json(invoices);
  } catch (err) {
    console.error('[admin/invoices GET]', err);
    return NextResponse.json({ error: 'Failed to fetch invoices.' }, { status: 500 });
  }
}

// POST /api/admin/invoices  — create a new invoice (documentNumber allocated server-side)
export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const body = await req.json() as { invoice: Invoice };
    if (!body.invoice?.clientName) {
      return NextResponse.json({ error: 'Invalid invoice data.' }, { status: 400 });
    }
    const { documentNumber: _ignored, ...invoiceData } = body.invoice;
    const saved = await createSavedInvoice(invoiceData);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('[admin/invoices POST]', err);
    return NextResponse.json({ error: 'Failed to save invoice.' }, { status: 500 });
  }
}
