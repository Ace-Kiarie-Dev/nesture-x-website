import type { Metadata } from 'next';
import { Baloo_2, Barlow } from 'next/font/google';
import '@/components/solo-standoff/solo-standoff.css';

// Solo Standoff wears the game's own skin. Baloo 2 is the in-game UI font, so
// these load here, for this route and its legal pages only.
const baloo = Baloo_2({
  weight: ['700', '800'],
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
});

const barlow = Barlow({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
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
