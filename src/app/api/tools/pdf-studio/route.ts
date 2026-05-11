import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';
import JSZip from 'jszip';

const MAX_BYTES = 4 * 1024 * 1024;

// ── Helpers ───────────────────────────────────────────────────────────────────

function err400(msg: string) { return NextResponse.json({ error: msg }, { status: 400 }); }

function isPdf(buf: Buffer) {
  return buf.length >= 4 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46;
}

function parseRanges(str: string, total: number): number[] {
  const out = new Set<number>();
  for (const part of str.split(',').map(s => s.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      for (let i = a; i <= b; i++) { if (i >= 1 && i <= total) out.add(i - 1); }
    } else {
      const n = Number(part);
      if (n >= 1 && n <= total) out.add(n - 1);
    }
  }
  return [...out].sort((a, b) => a - b);
}

function validateRanges(str: string, total: number): string | null {
  for (const part of str.split(',').map(s => s.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      if (isNaN(a) || isNaN(b) || a < 1 || b > total || a > b)
        return `Range "${part}" is invalid — document has ${total} pages.`;
    } else {
      const n = Number(part);
      if (isNaN(n) || n < 1 || n > total)
        return `Page "${part}" does not exist — document has ${total} pages.`;
    }
  }
  return null;
}

function pdfResp(bytes: Uint8Array, name: string, origSize?: number) {
  const h: Record<string, string> = {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${name}"`,
    'Cache-Control': 'no-store',
  };
  if (origSize !== undefined) {
    h['X-Original-Size'] = String(origSize);
    h['X-Processed-Size'] = String(bytes.length);
  }
  return new NextResponse(new Uint8Array(bytes), { status: 200, headers: h });
}

async function zipResp(zip: JSZip, name: string) {
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${name}"`,
      'Cache-Control': 'no-store',
    },
  });
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const operation = formData.get('operation') as string | null;
    const configRaw = formData.get('config') as string | null;

    if (!operation) return err400('No operation specified.');

    let config: Record<string, unknown> = {};
    try { if (configRaw) config = JSON.parse(configRaw); } catch { return err400('Invalid config JSON.'); }

    // ── Compress ────────────────────────────────────────────────────────────

    if (operation === 'compress') {
      const file = formData.get('file') as File | null;
      if (!file) return err400('No file provided.');
      const buf = Buffer.from(await file.arrayBuffer());
      if (!isPdf(buf)) return err400('File is not a valid PDF.');
      if (buf.length > MAX_BYTES) return err400('File exceeds the 4 MB limit.');

      const level = (config.level as string) ?? 'medium';
      const doc = await PDFDocument.load(buf);

      // pdf-lib compression is structural (object streams) — true image
      // recompression would require an external library such as ghostscript.
      if (level === 'high') {
        doc.setTitle('');
        doc.setAuthor('');
        doc.setSubject('');
        doc.setKeywords([]);
        doc.setProducer('');
        doc.setCreator('');
      }

      const saved = await doc.save({ useObjectStreams: level !== 'low' });
      return pdfResp(saved, 'compressed.pdf', buf.length);
    }

    // ── Merge ───────────────────────────────────────────────────────────────

    if (operation === 'merge') {
      const files = formData.getAll('files') as File[];
      if (files.length < 2) return err400('At least 2 PDF files are required.');
      if (files.length > 10) return err400('Maximum 10 files can be merged at once.');

      for (const f of files) {
        if (f.size > MAX_BYTES) return err400(`"${f.name}" exceeds the 4 MB limit.`);
        const b = Buffer.from(await f.arrayBuffer());
        if (!isPdf(b)) return err400(`"${f.name}" is not a valid PDF.`);
      }

      const merged = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer());
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }

      const saved = await merged.save({ useObjectStreams: true });
      return pdfResp(saved, 'merged.pdf');
    }

    // ── Split ───────────────────────────────────────────────────────────────

    if (operation === 'split') {
      const file = formData.get('file') as File | null;
      if (!file) return err400('No file provided.');
      const buf = Buffer.from(await file.arrayBuffer());
      if (!isPdf(buf)) return err400('File is not a valid PDF.');
      if (buf.length > MAX_BYTES) return err400('File exceeds the 4 MB limit.');

      const mode = config.mode as string;
      const src = await PDFDocument.load(buf);
      const total = src.getPageCount();

      if (mode === 'extract') {
        const pagesStr = ((config.pages as string) ?? '').trim();
        if (!pagesStr) return err400('Please specify pages to extract (e.g. 1, 3, 5-8).');
        const rangeErr = validateRanges(pagesStr, total);
        if (rangeErr) return err400(rangeErr);
        const indices = parseRanges(pagesStr, total);
        if (indices.length === 0) return err400('No valid pages in range.');

        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, indices);
        pages.forEach(p => out.addPage(p));
        return pdfResp(await out.save({ useObjectStreams: true }), 'extracted.pdf');
      }

      if (mode === 'split-all') {
        const zip = new JSZip();
        const pad = String(total).length;
        for (let i = 0; i < total; i++) {
          const pg = await PDFDocument.create();
          const [page] = await pg.copyPages(src, [i]);
          pg.addPage(page);
          zip.file(`page-${String(i + 1).padStart(pad, '0')}.pdf`, await pg.save({ useObjectStreams: true }));
        }
        return zipResp(zip, 'split-pages.zip');
      }

      if (mode === 'split-at') {
        const splitAt = Number(config.splitAt);
        if (isNaN(splitAt) || splitAt < 1 || splitAt >= total)
          return err400(`Split point must be between 1 and ${total - 1}.`);

        const zip = new JSZip();
        const p1 = await PDFDocument.create();
        const p1pages = await p1.copyPages(src, Array.from({ length: splitAt }, (_, i) => i));
        p1pages.forEach(p => p1.addPage(p));
        zip.file('part-1.pdf', await p1.save({ useObjectStreams: true }));

        const p2 = await PDFDocument.create();
        const p2pages = await p2.copyPages(src, Array.from({ length: total - splitAt }, (_, i) => splitAt + i));
        p2pages.forEach(p => p2.addPage(p));
        zip.file('part-2.pdf', await p2.save({ useObjectStreams: true }));

        return zipResp(zip, 'split.zip');
      }

      return err400('Invalid split mode.');
    }

    // ── Rotate ──────────────────────────────────────────────────────────────

    if (operation === 'rotate') {
      const file = formData.get('file') as File | null;
      if (!file) return err400('No file provided.');
      const buf = Buffer.from(await file.arrayBuffer());
      if (!isPdf(buf)) return err400('File is not a valid PDF.');
      if (buf.length > MAX_BYTES) return err400('File exceeds the 4 MB limit.');

      const deg = Number(config.degrees);
      if (![90, 180, 270].includes(deg)) return err400('Rotation must be 90, 180, or 270 degrees.');

      const doc = await PDFDocument.load(buf);
      const total = doc.getPageCount();

      let indices: number[];
      if (config.pages === 'all') {
        indices = Array.from({ length: total }, (_, i) => i);
      } else {
        const pagesStr = ((config.pages as string) ?? '').trim();
        if (!pagesStr) return err400('Please specify pages to rotate (e.g. 1, 3, 5-8).');
        const rangeErr = validateRanges(pagesStr, total);
        if (rangeErr) return err400(rangeErr);
        indices = parseRanges(pagesStr, total);
        if (indices.length === 0) return err400('No valid pages in range.');
      }

      for (const idx of indices) {
        const page = doc.getPage(idx);
        page.setRotation(degrees((page.getRotation().angle + deg) % 360));
      }

      return pdfResp(await doc.save({ useObjectStreams: true }), 'rotated.pdf');
    }

    // ── Protect ─────────────────────────────────────────────────────────────

    if (operation === 'protect') {
      const file = formData.get('file') as File | null;
      if (!file) return err400('No file provided.');
      const buf = Buffer.from(await file.arrayBuffer());
      if (!isPdf(buf)) return err400('File is not a valid PDF.');
      if (buf.length > MAX_BYTES) return err400('File exceeds the 4 MB limit.');

      const userPassword = (config.userPassword as string ?? '').trim();
      if (!userPassword) return err400('A user password is required.');

      // pdf-lib v1.x does not support encryption natively. Full password
      // protection requires qpdf or a similar system-level library.
      return NextResponse.json({
        error: 'Password protection requires the qpdf system library, which is not currently configured on this server. Contact Nesture-X to enable this feature on the hosted version.',
      }, { status: 501 });
    }

    return err400('Unknown operation.');

  } catch (err) {
    console.error('[pdf-studio]', err);
    return NextResponse.json({ error: 'Operation failed. The file may be corrupt or unsupported.' }, { status: 500 });
  }
}
