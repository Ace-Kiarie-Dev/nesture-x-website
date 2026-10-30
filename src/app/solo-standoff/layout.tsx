import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/components/solo-standoff/solo-standoff.css';

// Solo Standoff wears the game's own skin. Baloo 2 is the in-game UI font, so
// these load here, for this route and its legal pages only.
// Self-hosted from src/fonts (latin, OFL).
const baloo = localFont({
  src: [
    { path: '../../fonts/baloo-2/baloo-2-latin-wght-normal.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/baloo-2/baloo-2-latin-wght-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-baloo',
  display: 'swap',
  adjustFontFallback: false,
  // No space before the 2: next/font writes fallback names unquoted, and a word starting
  // with a digit would void the whole font-family declaration.
  fallback: ['Baloo2 Fallback'],
});

const barlow = localFont({
  src: [
    { path: '../../fonts/barlow/barlow-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/barlow/barlow-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/barlow/barlow-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/barlow/barlow-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-barlow',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Barlow Fallback'],
});

const ICONS = '/images/solo-standoff/social';

export const metadata: Metadata = {
  icons: {
    // The 32px icon is what browsers pick for the tab over the site's favicon.ico
    icon: [
      { url: `${ICONS}/icon_32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${ICONS}/icon_192.png`, sizes: '192x192', type: 'image/png' },
      { url: `${ICONS}/icon_512.png`, sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: `${ICONS}/apple_touch_icon.png`, sizes: '180x180', type: 'image/png' },
  },
};

export default function SoloStandoffLayout({ children }: { children: React.ReactNode }) {
  return <div className={`theme-ss ss-under-nav ${baloo.variable} ${barlow.variable} flex-1`}>{children}</div>;
}
