import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const qualityStr = formData.get('quality') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds the 4 MB limit.' }, { status: 413 });
    }

    const quality = parseInt(qualityStr ?? '80', 10);
    if (isNaN(quality) || quality < 10 || quality > 90) {
      return NextResponse.json({ error: 'Quality must be between 10 and 90.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const meta = await sharp(buffer).metadata();
    const fmt = meta.format;

    let pipeline = sharp(buffer);
    let contentType: string;
    let ext: string;

    if (fmt === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
      contentType = 'image/jpeg';
      ext = 'jpg';
    } else if (fmt === 'png') {
      // PNG quality controls palette-based compression; also shrinks via effort
      pipeline = pipeline.png({ quality, effort: 10 });
      contentType = 'image/png';
      ext = 'png';
    } else if (fmt === 'webp') {
      pipeline = pipeline.webp({ quality });
      contentType = 'image/webp';
      ext = 'webp';
    } else {
      // Unsupported input — convert to webp for best compression
      pipeline = pipeline.webp({ quality });
      contentType = 'image/webp';
      ext = 'webp';
    }

    const compressed = await pipeline.toBuffer();

    return new NextResponse(new Uint8Array(compressed), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="compressed.${ext}"`,
        'Cache-Control': 'no-store',
        'X-Original-Size': file.size.toString(),
        'X-Compressed-Size': compressed.length.toString(),
      },
    });
  } catch (err) {
    console.error('[image-compressor]', err);
    return NextResponse.json({ error: 'Compression failed. The file may be corrupt or unsupported.' }, { status: 500 });
  }
}
