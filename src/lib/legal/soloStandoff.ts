import fs from 'node:fs/promises';
import path from 'node:path';
import { PRIVACY, SUPPORT } from '@/lib/contactEmails';

// Solo Standoff legal copy lives as markdown in content/solo-standoff/ and is
// rendered as written. Only the title and "Last updated" line are lifted out
// so the shared layout can show them in its header.
//
// Email addresses are written as tokens ({{PRIVACY_EMAIL}}, {{SUPPORT_EMAIL}}) and
// filled in here from lib/contactEmails.ts. An unknown token fails loudly rather
// than reaching the page.
const TOKENS: Record<string, string> = {
  PRIVACY_EMAIL: PRIVACY,
  SUPPORT_EMAIL: SUPPORT,
};

function fillTokens(text: string, slug: string): string {
  return text.replace(/\{\{\s*([A-Z_]+)\s*\}\}/g, (token, name: string) => {
    const value = TOKENS[name];
    if (!value) throw new Error(`Unknown token ${token} in content/solo-standoff/${slug}.md`);
    return value;
  });
}

export const SOLO_STANDOFF_DOCS = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  'delete-account': 'Delete Your Account',
} as const;

export type SoloStandoffDocSlug = keyof typeof SOLO_STANDOFF_DOCS;

export interface LegalDoc {
  title: string;
  lastUpdated: string | null;
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'solo-standoff');

const LAST_UPDATED_LINE = /^[ \t]*[*_]*[ \t]*last updated[ \t]*[*_]*[ \t]*:?[ \t]*[*_]*[ \t]*(.+?)[ \t]*[*_]*[ \t]*$/im;

export function isSoloStandoffDoc(slug: string): slug is SoloStandoffDocSlug {
  return slug in SOLO_STANDOFF_DOCS;
}

export async function loadSoloStandoffDoc(slug: SoloStandoffDocSlug): Promise<LegalDoc | null> {
  let raw: string;
  try {
    raw = await fs.readFile(path.join(CONTENT_DIR, `${slug}.md`), 'utf8');
  } catch {
    return null;
  }

  let body = fillTokens(raw.replace(/\r\n/g, '\n'), slug);
  let title: string = SOLO_STANDOFF_DOCS[slug];
  let lastUpdated: string | null = null;

  // Optional frontmatter: title and lastUpdated / last_updated / updated / date
  const front = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (front) {
    body = body.slice(front[0].length);
    for (const line of front[1].split('\n')) {
      const [, key, value] = line.match(/^\s*([\w-]+)\s*:\s*(.+?)\s*$/) ?? [];
      if (!key || !value) continue;
      const clean = value.replace(/^['"]|['"]$/g, '');
      if (key === 'title') title = clean;
      if (['lastUpdated', 'last_updated', 'updated', 'date'].includes(key)) lastUpdated = clean;
    }
  }

  // A leading "# Heading" becomes the page title
  const h1 = body.match(/^\s*#\s+(.+?)\s*\n/);
  if (h1) {
    title = h1[1];
    body = body.slice(h1[0].length);
  }

  // A "Last updated: ..." line in the body moves to the header
  const updated = body.match(LAST_UPDATED_LINE);
  if (updated) {
    lastUpdated ??= updated[1];
    body = body.replace(updated[0], '');
  }

  return { title, lastUpdated, body: body.trim() };
}
