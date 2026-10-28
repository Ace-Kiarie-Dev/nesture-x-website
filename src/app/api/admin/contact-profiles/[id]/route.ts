import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import {
  updateContactProfile,
  deleteContactProfile,
  parseProfileInput,
} from '@/services/contactProfileService';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

// PUT /api/admin/contact-profiles/[id]
// Body: full profile fields to edit, and/or { isDefault: true } to make it the default.
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id }        = await params;
  const body          = await req.json() as Record<string, unknown>;
  const makeDefault   = body.isDefault === true;
  const editsFields   = 'label' in body || 'contactName' in body || 'phone' in body || 'email' in body;
  const input         = editsFields ? parseProfileInput(body) : null;
  if (editsFields && !input) {
    return NextResponse.json({ error: 'Label, name, phone and email are required.' }, { status: 400 });
  }
  const updated = await updateContactProfile(id, input, makeDefault);
  if (!updated) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/admin/contact-profiles/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getAdminSession())) return unauthorized();
  const { id } = await params;
  const result = await deleteContactProfile(id);
  if (result === 'not-found')  return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  if (result === 'is-default') {
    return NextResponse.json({ error: 'Set another profile as default before deleting this one.' }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
