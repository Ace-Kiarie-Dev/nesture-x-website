import type { Metadata } from 'next';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import localFont from 'next/font/local';
import MatatuDashLanding from '@/components/matatu-dash/MatatuDashLanding';
import { ProductBackPill, ProductMoreRow } from '@/components/product-landing/ProductPageNav';
import '@/components/matatu-dash/matatu-dash.css';

// Loaded here rather than in the root layout, scoped to Matatu Dash. SoraPesa
// loads its own Montserrat instance, so the two pages never share weights.
// Self-hosted from src/fonts (latin, OFL).
const montserrat = localFont({
  src: [
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-italic.woff2', weight: '700', style: 'italic' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '800', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-italic.woff2', weight: '800', style: 'italic' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '900', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-italic.woff2', weight: '900', style: 'italic' },
  ],
  variable: '--font-md-display',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Montserrat Fallback'],
});

const inter = localFont({
  src: [
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-md-body',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Inter Fallback'],
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
        <ProductBackPill slug="matatu-dash" />
        <MatatuDashLanding />
        <ProductMoreRow slug="matatu-dash" />
      </div>
    </>
  );
}
