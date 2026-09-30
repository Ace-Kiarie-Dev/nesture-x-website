import type { Metadata } from 'next';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import { Inter } from 'next/font/google';
import BetLedgerLanding from '@/components/betledger/BetLedgerLanding';
import '@/components/betledger/betledger.css';

// Inter is only used by BetLedger, so it's loaded here rather than in the root layout.
const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const TITLE = 'BetLedger — Bet Tracker for Kenyan Sports Bettors';
const SHARE_TITLE = `${TITLE} | Nesture-X`;
const DESCRIPTION =
  'BetLedger is a bet tracker for Kenyan sports bettors. Log every bet, see your true profit and loss, and understand your habits. Coming soon to Google Play.';
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

// Structured data: the app itself (no offers or ratings until it launches) and its breadcrumb.
const APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'BetLedger',
  description: DESCRIPTION,
  url: PAGE_URL,
  image: OG_IMAGE,
  operatingSystem: 'Android',
  applicationCategory: 'FinanceApplication',
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
        <BetLedgerLanding />
      </div>
    </>
  );
}
