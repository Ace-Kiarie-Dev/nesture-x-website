import { NextRequest, NextResponse } from 'next/server';
import sharp, { type FitEnum, type FormatEnum } from 'sharp';

const MAX_BYTES = 4 * 1024 * 1024;

const VALID_FORMATS = ['jpg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif', 'ico'] as const;
type OutputFormat = (typeof VALID_FORMATS)[number];

const CONTENT_TYPES: Record<OutputFormat, string> = {
  jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif',
  tiff: 'image/tiff', bmp: 'image/bmp', gif: 'image/gif', ico: 'image/x-icon',
};

const SHARP_FORMAT: Record<OutputFormat, string> = {
  jpg: 'jpeg', png: 'png', webp: 'webp', avif: 'avif',
  tiff: 'tiff', bmp: 'bmp', gif: 'gif', ico: 'ico',
};

interface Config {
  activeTab: 'convert' | 'compress' | 'resize' | 'transform' | 'adjustments';
  convert: { format: OutputFormat; quality: number };
  compress: { quality: number };
  resize: { width: number | null; height: number | null; fit: keyof FitEnum; maintainAspectRatio: boolean };
  transform: {
    flipHorizontal: boolean; flipVertical: boolean; rotate: number; trim: boolean;
    extend: { top: number; right: number; bottom: number; left: number; fillColour: string };
  };
  adjustments: {
    grayscale: boolean; tint: string | null;
    brightness: number; saturation: number; contrast: number;
    hue: number; blur: number; sharpen: boolean; sharpenSigma: number;
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '');
  const n = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const configRaw = formData.get('config') as string | null;

    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File exceeds the 4 MB limit.' }, { status: 413 });
    if (!configRaw) return NextResponse.json({ error: 'No config provided.' }, { status: 400 });

    let config: Config;
    try {
      config = JSON.parse(configRaw);
    } catch {
      return NextResponse.json({ error: 'Invalid config JSON.' }, { status: 400 });
    }

    const { activeTab, convert, compress, resize, transform, adjustments } = config;

    // Validate format
    const outputFormat: OutputFormat = activeTab === 'convert' ? convert.format : (
      // For other tabs, detect from mime type or default webp
      (VALID_FORMATS.find(f => file.type.includes(f === 'jpg' ? 'jpeg' : f)) ?? 'webp')
    );
    if (activeTab === 'convert' && !VALID_FORMATS.includes(convert.format)) {
      return NextResponse.json({ error: 'Invalid output format.' }, { status: 400 });
    }

    // Validate quality ranges
    if (activeTab === 'convert' && (convert.quality < 10 || convert.quality > 100)) {
      return NextResponse.json({ error: 'Quality must be 10–100.' }, { status: 400 });
    }
    if (activeTab === 'compress' && (compress.quality < 10 || compress.quality > 90)) {
      return NextResponse.json({ error: 'Quality must be 10–90.' }, { status: 400 });
    }
    if (activeTab === 'transform' && (transform.rotate < -360 || transform.rotate > 360)) {
      return NextResponse.json({ error: 'Rotate must be –360 to 360.' }, { status: 400 });
    }
    if (adjustments.blur < 0 || adjustments.blur > 20) {
      return NextResponse.json({ error: 'Blur must be 0–20.' }, { status: 400 });
    }
    if (adjustments.sharpen && (adjustments.sharpenSigma < 0.5 || adjustments.sharpenSigma > 3)) {
      return NextResponse.json({ error: 'Sharpen sigma must be 0.5–3.' }, { status: 400 });
    }
    if (activeTab === 'transform') {
      const { top, right, bottom, left } = transform.extend;
      if ([top, right, bottom, left].some(v => v < 0 || v > 2000)) {
        return NextResponse.json({ error: 'Extend values must be 0–2000.' }, { status: 400 });
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalSize = buffer.length;

    // Build sharp pipeline
    let pipeline = sharp(buffer);

    // 1. Resize
    if (activeTab === 'resize' && (resize.width || resize.height)) {
      pipeline = pipeline.resize({
        width: resize.width ?? undefined,
        height: resize.height ?? undefined,
        fit: resize.fit,
      });
    }

    // 2. Extend canvas
    if (activeTab === 'transform') {
      const { top, right, bottom, left, fillColour } = transform.extend;
      if (top > 0 || right > 0 || bottom > 0 || left > 0) {
        const rgb = hexToRgb(fillColour || '#ffffff');
        pipeline = pipeline.extend({ top, right, bottom, left, background: { r: rgb.r, g: rgb.g, b: rgb.b, alpha: 1 } });
      }
    }

    // 3. Flip / flop
    if (activeTab === 'transform') {
      if (transform.flipHorizontal) pipeline = pipeline.flop();
      if (transform.flipVertical) pipeline = pipeline.flip();
    }

    // 4. Rotate
    if (activeTab === 'transform' && transform.rotate !== 0) {
      pipeline = pipeline.rotate(transform.rotate);
    }

    // 5. Trim
    if (activeTab === 'transform' && transform.trim) {
      pipeline = pipeline.trim();
    }

    // 6–11. Adjustments
    if (activeTab === 'adjustments') {
      if (adjustments.grayscale) pipeline = pipeline.grayscale();

      if (!adjustments.grayscale && adjustments.tint) {
        const rgb = hexToRgb(adjustments.tint);
        pipeline = pipeline.tint({ r: rgb.r, g: rgb.g, b: rgb.b });
      }

      const { brightness, saturation, hue } = adjustments;
      if (brightness !== 0 || saturation !== 0 || hue !== 0) {
        pipeline = pipeline.modulate({
          brightness: brightness !== 0 ? 1 + brightness / 100 : undefined,
          saturation: saturation !== 0 ? 1 + saturation / 100 : undefined,
          hue: hue !== 0 ? hue : undefined,
        });
      }

      if (adjustments.contrast !== 0) {
        // linear(a, b): output = a * input + b; contrast via multiplier
        const a = 1 + adjustments.contrast / 100;
        const b = 128 * (1 - a);
        pipeline = pipeline.linear(a, b);
      }

      if (adjustments.blur > 0) {
        pipeline = pipeline.blur(adjustments.blur);
      }

      if (adjustments.sharpen) {
        pipeline = pipeline.sharpen({ sigma: adjustments.sharpenSigma });
      }
    }

    // Final: format + quality
    const quality =
      activeTab === 'compress' ? compress.quality :
      activeTab === 'convert' ? convert.quality : 85;

    const lossy = ['jpg', 'webp', 'avif'].includes(outputFormat);

    if (lossy) {
      pipeline = pipeline.toFormat(SHARP_FORMAT[outputFormat] as keyof FormatEnum, { quality });
    } else {
      pipeline = pipeline.toFormat(SHARP_FORMAT[outputFormat] as keyof FormatEnum);
    }

    const processed = await pipeline.toBuffer();

    return new NextResponse(new Uint8Array(processed), {
      status: 200,
      headers: {
        'Content-Type': CONTENT_TYPES[outputFormat],
        'Content-Disposition': `attachment; filename="image-studio.${outputFormat}"`,
        'Cache-Control': 'no-store',
        'X-Original-Size': String(originalSize),
        'X-Processed-Size': String(processed.length),
      },
    });
  } catch (err) {
    console.error('[image-studio]', err);
    return NextResponse.json({ error: 'Processing failed. The file may be corrupt or unsupported.' }, { status: 500 });
  }
}
