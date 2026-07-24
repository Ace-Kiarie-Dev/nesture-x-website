import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// Cron-triggered — never statically cache this route.
export const dynamic = 'force-dynamic';

// GET /api/keepalive — pings MongoDB Atlas so the free-tier (M0) cluster
// doesn't auto-pause after ~30 days of inactivity. Scheduled via Vercel
// Cron (see vercel.json); requires CRON_SECRET in Vercel env vars.
export async function GET(req: NextRequest) {
  const expected = process.env.CRON_SECRET;
  const provided =
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    req.nextUrl.searchParams.get('secret');

  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[keepalive/GET]', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
