import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/admin/InvoicePDF';
import type { Invoice } from '@/types/invoice';

export async function POST(req: NextRequest) {
  try {
    const invoice = await req.json() as Invoice;

    if (!invoice?.documentNumber) {
      return NextResponse.json({ error: 'Invalid invoice data.' }, { status: 400 });
    }

    const element = createElement(InvoicePDF, { invoice }) as ReactElement<DocumentProps>;
    const buffer  = await renderToBuffer(element);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${invoice.documentNumber}.pdf"`,
      },
    });

  } catch (err) {
    console.error('[admin/invoice/pdf]', err);
    return NextResponse.json({ error: 'PDF generation failed.' }, { status: 500 });
  }
}
