import { readFile } from 'node:fs/promises';
import path from 'node:path';

// NX Gaming 2048 is a standalone static game in public/nx-gaming/2048
// (source: Ace-Kiarie-Dev/2048-JS-Game). This serves its index.html at the
// clean URL. Next.js drops the trailing slash, so the game's relative asset
// paths would resolve into /nx-gaming/ — a <base> tag points them back into
// /nx-gaming/2048/. Rendered once at build time.
export const dynamic = 'force-static';

const GAME_DIR = path.join(process.cwd(), 'public', 'nx-gaming', '2048');

export async function GET() {
  const html = await readFile(path.join(GAME_DIR, 'index.html'), 'utf8');
  const withBase = html.replace(
    /<meta charset[^>]*>/i,
    (meta) => `${meta}\n    <base href="/nx-gaming/2048/">`,
  );
  return new Response(withBase, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
