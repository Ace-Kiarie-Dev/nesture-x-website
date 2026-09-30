import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import KikotaLanding from '@/components/kikota/KikotaLanding';
import '@/components/kikota/kikota.css';

// Barlow Condensed and Inter are only used by Kikota, so they're loaded here
// rather than in the root layout.
const barlow = Barlow_Condensed({
  weight: ['600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-kk-display',
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-kk-body',
  display: 'swap',
});

const TITLE = 'Kikota — Gym Management Software for Kenya | Nesture-X';
const DESCRIPTION =
  'Run your gym, not your paperwork. Kikota brings QR check-ins, M-Pesa payments, and attendance reports into one dashboard, plus a fitness network with cross-gym tournaments and leaderboards. Coming soon.';
const PAGE_URL = 'https://nesturex.com/kikota';
const OG_IMAGE = 'https://nesturex.com/images/originals/Kikota-Card.webp';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'Kikota',
    'gym management software Kenya',
    'gym software Nairobi',
    'M-Pesa gym payments',
    'gym check-in app',
    'gym attendance tracking',
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
        alt: 'Kikota — Run your gym. Not your paperwork.',
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

export default function KikotaPage() {
  return (
    <div className={`theme-kikota kk-under-nav ${barlow.variable} ${inter.variable} flex-1`}>
      <KikotaLanding />
    </div>
  );
}
