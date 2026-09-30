import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Shared Open Graph / Twitter card generator. Each route's opengraph-image.tsx
// and twitter-image.tsx call renderOgImage() with its own title and subtitle.
// Images are rendered at build time (no request-time APIs), so the font and
// logo reads below happen once per image during `next build`.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const BG = '#0a0a0a';
const BLUE = '#1a6fd4';
const TEXT = '#ffffff';
const MUTED = '#a3a3a3';

const ASSETS = join(process.cwd(), 'src/assets');

// Space Grotesk static TTFs (next/font only ships woff2, which ImageResponse
// can't read). Licensed under the SIL OFL — see src/assets/fonts/SpaceGrotesk-OFL.txt.
async function loadAssets() {
  const [bold, medium, mark] = await Promise.all([
    readFile(join(ASSETS, 'fonts/SpaceGrotesk-Bold.ttf')),
    readFile(join(ASSETS, 'fonts/SpaceGrotesk-Medium.ttf')),
    readFile(join(ASSETS, 'og/nx-mark.png')),
  ]);
  return { bold, medium, markSrc: `data:image/png;base64,${mark.toString('base64')}` };
}

// Longer titles step down so they stay within two lines.
function titleSize(title: string) {
  if (title.length <= 18) return 88;
  if (title.length <= 28) return 76;
  if (title.length <= 40) return 64;
  return 56;
}

interface OgImageOptions {
  title: string;
  subtitle: string;
  /** Small label top-right, e.g. "FREE TOOL". */
  eyebrow?: string;
}

export async function renderOgImage({ title, subtitle, eyebrow }: OgImageOptions) {
  const { bold, medium, markSrc } = await loadAssets();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          backgroundColor: BG,
          backgroundImage:
            'radial-gradient(circle at 100% 0%, rgba(26, 111, 212, 0.35) 0%, rgba(26, 111, 212, 0) 55%)',
          fontFamily: 'Space Grotesk',
          color: TEXT,
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Light tile: the mark's black "A" disappears on #0a0a0a otherwise */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 84,
                height: 84,
                borderRadius: 18,
                backgroundColor: '#f5f5f5',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img src={markSrc} width={56} height={60} />
            </div>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: 4 }}>NESTURE-X</div>
          </div>
          {eyebrow ? (
            <div
              style={{
                display: 'flex',
                padding: '10px 20px',
                borderRadius: 999,
                border: `2px solid ${BLUE}`,
                color: TEXT,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 3,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
        </div>

        {/* Title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', width: 96, height: 8, borderRadius: 4, backgroundColor: BLUE }} />
          <div
            style={{
              display: 'flex',
              fontSize: titleSize(title),
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 500, lineHeight: 1.35, color: MUTED, maxWidth: 940 }}>
            {subtitle}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 500 }}>
          <div style={{ display: 'flex', width: 12, height: 12, borderRadius: 999, backgroundColor: BLUE }} />
          nesturex.com
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Space Grotesk', data: bold, weight: 700, style: 'normal' },
        { name: 'Space Grotesk', data: medium, weight: 500, style: 'normal' },
      ],
    },
  );
}
