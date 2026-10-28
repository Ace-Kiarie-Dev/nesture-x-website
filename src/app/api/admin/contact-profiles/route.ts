import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import {
  getContactProfiles,
  createContactProfile,
  parseProfileInput,
} from '@/services/contactProfileService';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

// GET /api/admin/contact-profiles  — list all (seeds "NX Main" on first call)
export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  try {
    return NextResponse.json(await getContactProfiles());
  } catch (err) {
    console.error('[admin/contact-profiles GET]', err);
    return NextResponse.json({ error: 'Failed to fetch contact profiles.' }, { status: 500 });
  }
}

// POST /api/admin/contact-profiles  — create
export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const body  = await req.json() as Record<string, unknown>;
    const input = parseProfileInput(body);
    if (!input) {
      return NextResponse.json({ error: 'Label, name, phone and email are required.' }, { status: 400 });
    }
    const saved = await createContactProfile(input, body.isDefault === true);
    return NextResponse.json(saved, { status: 201 });
  } catch (err) {
    console.error('[admin/contact-profiles POST]', err);
    return NextResponse.json({ error: 'Failed to save contact profile.' }, { status: 500 });
  }
}
