// Writes src/data/portfolio-media.json: the pixel size of every image the portfolio
// shows (design work, PDF covers, digital product shots), keyed by public path, so
// next/image can reserve each box before it loads (no layout shift).
// Read-only on the originals. Re-run after adding work: npm run portfolio:media
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const portfolio = JSON.parse(read('src/data/portfolio.json'));
const paths = new Set();
for (const item of portfolio) {
  if (!item.isPDF) paths.add(`/images/portfolio/${item.filename}`);
  else if (item.coverImage) paths.add(`/images/portfolio/${item.coverImage}`);
}
// Digital products: image paths from the two TS data files.
for (const file of ['src/data/nxOriginals.ts', 'src/data/devProjects.ts']) {
  for (const [, p] of read(file).matchAll(/(?:imageSrc|image):\s*'([^']+)'/g)) paths.add(p);
}

const out = {};
const missing = [];
for (const p of [...paths].sort()) {
  const file = path.join(root, 'public', p);
  if (!fs.existsSync(file)) { missing.push(p); continue; }
  const { width, height, pages } = await sharp(file, { animated: true }).metadata();
  // Animated GIF/WebP report the full sprite height; one frame is height / pages.
  out[p] = [width, pages > 1 ? Math.round(height / pages) : height];
}

fs.writeFileSync(path.join(root, 'src/data/portfolio-media.json'), JSON.stringify(out, null, 0).replace(/\],/g, '],\n') + '\n');
console.log(`portfolio-media.json: ${Object.keys(out).length} images` + (missing.length ? `, missing: ${missing.join(', ')}` : ''));
