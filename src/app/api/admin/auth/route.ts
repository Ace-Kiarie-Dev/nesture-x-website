import { NextRequest, NextResponse } from 'next/server';
import { issueAdminSession, clearAdminSession, getAdminSession } from '@/lib/adminToken';

// POST /api/admin/auth  — login
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json() as { password: string };

    if (!password) {
      return NextResponse.json({ ok: false, error: 'Password required.' }, { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      await new Promise(r => setTimeout(r, 800)); // brute-force delay
      return NextResponse.json({ ok: false, error: 'Invalid password.' }, { status: 401 });
    }

    await issueAdminSession();
    return NextResponse.json({ ok: true });

  } catch {
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 });
  }
}

// GET /api/admin/auth  — check session validity (used by client-side auth guards)
export async function GET() {
  const ok = await getAdminSession();
  return NextResponse.json({ ok });
}

// DELETE /api/admin/auth  — logout
export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
