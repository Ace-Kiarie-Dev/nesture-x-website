import type { Metadata } from 'next';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import { Inter, Montserrat } from 'next/font/google';
import MatatuDashLanding from '@/components/matatu-dash/MatatuDashLanding';
import '@/components/matatu-dash/matatu-dash.css';

// Loaded here rather than in the root layout, scoped to Matatu Dash. SoraPesa
// loads its own Montserrat instance, so the two pages never share weights.
const montserrat = Montserrat({
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-md-display',
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-md-body',
  display: 'swap',
});

const TITLE = 'Matatu Dash — Nairobi Street Hopper Game';
const SHARE_TITLE = `${TITLE} | Nesture-X`;
const DESCRIPTION =
  'Hop through matatu lanes, dodge bodabodas, and weave past hawkers in Matatu Dash, a free endless hopper game set in Nairobi. Coming soon to Google Play.';
const PAGE_URL = 'https://nesturex.com/matatu-dash';
const OG_IMAGE = 'https://nesturex.com/images/originals/MatatuDash-Card.webp';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Matatu Dash',
    'Nairobi game',
    'Kenyan mobile game',
    'endless hopper game',
    'matatu game',
    'Android game Kenya',
  ],
  openGraph: {
    title: SHARE_TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 920,
        height: 520,
        alt: "Matatu Dash — Survive Nairobi's streets.",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SHARE_TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: '/matatu-dash',
  },
};

// Structured data: the game (free, so a price-0 offer; no ratings until it launches) and its breadcrumb.
const APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Matatu Dash',
  description: DESCRIPTION,
  url: PAGE_URL,
  image: OG_IMAGE,
  gamePlatform: 'Android',
  applicationCategory: 'GameApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'KES',
  },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const BREADCRUMB_JSON_LD = breadcrumbList([
  { name: 'Home', path: '/' },
  { name: 'Matatu Dash', path: '/matatu-dash' },
]);

export default function MatatuDashPage() {
  return (
    <>
      <JsonLd data={[APP_JSON_LD, BREADCRUMB_JSON_LD]} />
      <div className={`theme-matatu md-under-nav ${montserrat.variable} ${inter.variable} flex-1`}>
        <MatatuDashLanding />
      </div>
    </>
  );
}
