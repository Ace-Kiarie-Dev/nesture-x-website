import type { Metadata } from 'next';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import localFont from 'next/font/local';
import { BETLEDGER_PLAY_URL_CLEAN } from '@/constants';
import BetLedgerLanding from '@/components/betledger/BetLedgerLanding';
import { ProductBackPill, ProductMoreRow } from '@/components/product-landing/ProductPageNav';
import '@/components/betledger/betledger.css';

// Inter is only used by BetLedger, so it's loaded here rather than in the root layout.
// Self-hosted from src/fonts (latin, OFL).
const inter = localFont({
  src: [
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Inter Fallback'],
});

const TITLE = 'BetLedger — Bet Tracker for Kenyan Sports Bettors';
const SHARE_TITLE = `${TITLE} | Nesture-X`;
const DESCRIPTION =
  'BetLedger is a free bet tracker for Kenyan sports bettors. Log every bet, see your true profit and loss, and understand your habits. On Google Play now.';
const PAGE_URL = 'https://nesturex.com/betledger';
const OG_IMAGE = 'https://nesturex.com/images/originals/BetLedger-Card.webp';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'BetLedger',
    'bet tracker Kenya',
    'betting tracker app',
    'track sports bets',
    'betting profit and loss',
    'bet ledger',
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
        alt: 'BetLedger — Track Every Bet. Know Your Numbers.',
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
    canonical: '/betledger',
  },
};

// Structured data: the app itself (free on Google Play, no ratings yet) and its breadcrumb.
const APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'BetLedger',
  description: DESCRIPTION,
  url: PAGE_URL,
  image: OG_IMAGE,
  operatingSystem: 'Android',
  applicationCategory: 'FinanceApplication',
  downloadUrl: BETLEDGER_PLAY_URL_CLEAN,
  installUrl: BETLEDGER_PLAY_URL_CLEAN,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KES' },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const BREADCRUMB_JSON_LD = breadcrumbList([
  { name: 'Home', path: '/' },
  { name: 'BetLedger', path: '/betledger' },
]);

export default function BetLedgerPage() {
  return (
    <>
      <JsonLd data={[APP_JSON_LD, BREADCRUMB_JSON_LD]} />
      <div className={`theme-betledger bl-under-nav ${inter.variable} flex-1`}>
        <ProductBackPill slug="betledger" />
        <BetLedgerLanding />
        <ProductMoreRow slug="betledger" />
      </div>
    </>
  );
}
