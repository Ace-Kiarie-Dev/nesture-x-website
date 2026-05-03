import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { QuotePDF } from '@/components/admin/QuotePDF';
import type { Quote } from '@/types/quote';

export async function POST(req: NextRequest) {
  try {
    const quote = await req.json() as Quote;

    if (!quote?.quoteNumber) {
      return NextResponse.json({ error: 'Invalid quote data.' }, { status: 400 });
    }

    const element = createElement(QuotePDF, { quote }) as ReactElement<DocumentProps>;
    const buffer  = await renderToBuffer(element);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${quote.quoteNumber}.pdf"`,
      },
    });

  } catch (err) {
    console.error('[admin/quote/pdf]', err);
    return NextResponse.json({ error: 'PDF generation failed.' }, { status: 500 });
  }
}
