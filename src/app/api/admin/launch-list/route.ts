import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/adminToken';
import { getDb } from '@/lib/mongodb';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

interface LaunchSignupEntry {
  email:     string;
  createdAt: string; // ISO
}

interface AdminLaunchGroup {
  projectSlug: string;
  projectName: string;
  count:       number;
  signups:     LaunchSignupEntry[];
}

// GET /api/admin/launch-list — launch-notification signups, grouped by project (read-only)
export async function GET() {
  if (!(await getAdminSession())) return unauthorized();
  try {
    const db   = await getDb();
    const docs = await db.collection('launchSignups').find({}).sort({ createdAt: -1 }).toArray();

    const groups = new Map<string, AdminLaunchGroup>();
    for (const d of docs) {
      const projectSlug = typeof d.projectSlug === 'string' ? d.projectSlug : 'unknown';
      const projectName = typeof d.projectName === 'string' ? d.projectName : projectSlug;
      const email        = typeof d.email === 'string' ? d.email : '';
      const createdAt     = d.createdAt ? new Date(d.createdAt).toISOString() : new Date(0).toISOString();

      if (!groups.has(projectSlug)) {
        groups.set(projectSlug, { projectSlug, projectName, count: 0, signups: [] });
      }
      const group = groups.get(projectSlug)!;
      group.count += 1;
      group.signups.push({ email, createdAt });
    }

    const result = Array.from(groups.values()).sort((a, b) => b.count - a.count);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[admin/launch-list GET]', err);
    return NextResponse.json({ error: 'Failed to fetch launch list.' }, { status: 500 });
  }
}
