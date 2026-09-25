import type { Metadata } from 'next';
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

const TITLE = 'BetLedger — Bet Tracker for Kenyan Sports Bettors | Nesture-X';
const DESCRIPTION =
  'Track every bet and know your real numbers. BetLedger is a simple bet tracker for Kenyan sports bettors. Log bets, see true profit and loss, and understand your habits. Coming soon to Google Play.';
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
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Nesture-X',
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
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function BetLedgerPage() {
  return (
    <div className={`theme-betledger bl-under-nav ${inter.variable} flex-1`}>
      <BetLedgerLanding />
    </div>
  );
}
