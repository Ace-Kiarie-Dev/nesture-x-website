import { NextRequest, NextResponse } from 'next/server';
import sharp, { type FormatEnum } from 'sharp';

const MAX_BYTES = 4 * 1024 * 1024;
const VALID_FORMATS = ['jpg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif', 'ico'] as const;
type TargetFormat = (typeof VALID_FORMATS)[number];

const CONTENT_TYPES: Record<TargetFormat, string> = {
  jpg:  'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  tiff: 'image/tiff',
  bmp:  'image/bmp',
  gif:  'image/gif',
  ico:  'image/x-icon',
};

// sharp uses 'jpeg' internally; bmp/ico may not appear in FormatEnum typings but are supported at runtime
const SHARP_FORMAT: Record<TargetFormat, string> = {
  jpg:  'jpeg',
  png:  'png',
  webp: 'webp',
  avif: 'avif',
  tiff: 'tiff',
  bmp:  'bmp',
  gif:  'gif',
  ico:  'ico',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetFormat = formData.get('targetFormat') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File exceeds the 4 MB limit.' }, { status: 413 });
    }
    if (!targetFormat || !(VALID_FORMATS as readonly string[]).includes(targetFormat)) {
      return NextResponse.json({ error: 'Invalid target format.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sharpFmt = SHARP_FORMAT[targetFormat as TargetFormat] as keyof FormatEnum;
    const converted = await sharp(buffer).toFormat(sharpFmt).toBuffer();

    return new NextResponse(new Uint8Array(converted), {
      status: 200,
      headers: {
        'Content-Type': CONTENT_TYPES[targetFormat as TargetFormat],
        'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[image-converter]', err);
    return NextResponse.json({ error: 'Conversion failed. The file may be corrupt or unsupported.' }, { status: 500 });
  }
}
