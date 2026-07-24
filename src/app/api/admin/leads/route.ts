import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import { getDb } from '@/lib/mongodb';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

interface AdminLead {
  _id:       string;
  name?:     string;
  email?:    string;
  phone?:    string;
  brief?:    string;
  createdAt: string; // ISO
}

// GET /api/admin/leads — list all contact-form leads (read-only)
export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const db   = await getDb();
    const docs = await db.collection('leads').find({}).sort({ createdAt: -1 }).toArray();
    const leads: AdminLead[] = docs.map(d => ({
      _id:       d._id.toString(),
      name:      typeof d.name === 'string' ? d.name : undefined,
      email:     typeof d.email === 'string' ? d.email : undefined,
      phone:     typeof d.phone === 'string' ? d.phone : undefined,
      brief:     typeof d.brief === 'string' ? d.brief : undefined,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date(0).toISOString(),
    }));
    return NextResponse.json(leads);
  } catch (err) {
    console.error('[admin/leads GET]', err);
    return NextResponse.json({ error: 'Failed to fetch leads.' }, { status: 500 });
  }
}
