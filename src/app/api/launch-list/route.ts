import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { sendLaunchSignup } from '@/emails/send';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let indexEnsured = false;

async function ensureIndex(db: Awaited<ReturnType<typeof getDb>>) {
  if (indexEnsured) return;
  await db.collection('launchSignups').createIndex(
    { email: 1, projectSlug: 1 },
    { unique: true }
  );
  indexEnsured = true;
}

// ── POST /api/launch-list — join a project's launch notification list ───────

export async function POST(req: NextRequest) {
  try {
    const { email, projectSlug, projectName } = await req.json() as Record<string, string>;

    if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (!projectSlug?.trim() || !projectName?.trim()) {
      return NextResponse.json({ error: 'Missing project details.' }, { status: 400 });
    }

    const db = await getDb();
    await ensureIndex(db);

    try {
      await db.collection('launchSignups').insertOne({
        email:       email.trim().toLowerCase(),
        projectSlug: projectSlug.trim(),
        projectName: projectName.trim(),
        createdAt:   new Date(),
      });
    } catch (err) {
      if (err instanceof Error && (err as { code?: number }).code === 11000) {
        return NextResponse.json(
          { error: "You're already on the list for this one." },
          { status: 409 }
        );
      }
      throw err;
    }

    // Confirmation email is a courtesy, not a requirement — never block the signup on it.
    try {
      await sendLaunchSignup({ to: email.trim(), productName: projectName.trim() });
    } catch (emailErr) {
      console.error('[launch-list] confirmation email failed:', emailErr);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('[launch-list/POST]', err);
    return NextResponse.json(
      { error: 'Could not join the launch list. Please try again.' },
      { status: 500 }
    );
  }
}
