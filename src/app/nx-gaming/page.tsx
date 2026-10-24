import type { Metadata } from 'next';
import { Manrope, Sora } from 'next/font/google';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import { LIVE_GAMES } from '@/lib/nx-gaming/games';
import NxGamingHub from '@/components/nx-gaming/NxGamingHub';
import '@/components/nx-gaming/nx-gaming.css';

// Loaded here rather than in the root layout, scoped to the NX Gaming hub.
const sora = Sora({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nxg-display',
  display: 'swap',
});

const manrope = Manrope({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-nxg-body',
  display: 'swap',
});

const TITLE = 'NX Gaming — Free Browser Games';
const SHARE_TITLE = `${TITLE} | Nesture-X`;
const DESCRIPTION =
  'Free browser games built by Nesture-X in Nairobi. Play 2048 and Flappy Horror on your phone or desktop. No sign-up, nothing to install.';
const PAGE_URL = `${SITE_URL}/nx-gaming`;

// Share images come from opengraph-image.tsx / twitter-image.tsx in this folder.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'NX Gaming',
    'free browser games',
    'online games Kenya',
    '2048 online',
    'Flappy Horror',
    'Nesture-X games',
  ],
  openGraph: {
    title: SHARE_TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: DESCRIPTION,
  },
  alternates: {
    canonical: '/nx-gaming',
  },
};

// Structured data: the playable games as an ItemList of free VideoGames, plus the breadcrumb.
// Locked games stay out until they ship.
const GAMES_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'NX Gaming',
  url: PAGE_URL,
  itemListElement: LIVE_GAMES.map((game, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'VideoGame',
      name: game.name,
      description: game.blurb,
      url: `${SITE_URL}${game.href}`,
      image: `${SITE_URL}${game.hero.src}`,
      genre: game.kind,
      gamePlatform: 'Web browser',
      applicationCategory: 'GameApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  })),
};

const BREADCRUMB_JSON_LD = breadcrumbList([
  { name: 'Home', path: '/' },
  { name: 'NX Gaming', path: '/nx-gaming' },
]);

export default function NxGamingPage() {
  return (
    <>
      <JsonLd data={[GAMES_JSON_LD, BREADCRUMB_JSON_LD]} />
      <div className={`theme-nxg nxg-under-nav ${sora.variable} ${manrope.variable} flex-1`}>
        <NxGamingHub />
      </div>
    </>
  );
}
