import { NextResponse } from 'next/server';

// Health check — M-Pesa operations are handled by:
//   POST /api/booking         → initiate STK push
//   POST /api/mpesa/callback  → Safaricom Daraja webhook
export async function GET() {
  return NextResponse.json({ ok: true });
}
