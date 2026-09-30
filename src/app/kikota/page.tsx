import type { Metadata } from 'next';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
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

const TITLE = 'Kikota — Gym Management Software for Kenya';
const SHARE_TITLE = `${TITLE} | Nesture-X`;
const DESCRIPTION =
  'Kikota is gym management software for Kenya: QR check-ins, M-Pesa payments, and attendance reports in one dashboard, plus a fitness network. Coming soon.';
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
        alt: 'Kikota — Run your gym. Not your paperwork.',
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
    canonical: '/kikota',
  },
};

// Structured data: the app itself (no offers or ratings until it launches) and its breadcrumb.
const APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kikota',
  description: DESCRIPTION,
  url: PAGE_URL,
  image: OG_IMAGE,
  operatingSystem: 'Web',
  applicationCategory: 'BusinessApplication',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const BREADCRUMB_JSON_LD = breadcrumbList([
  { name: 'Home', path: '/' },
  { name: 'Kikota', path: '/kikota' },
]);

export default function KikotaPage() {
  return (
    <>
      <JsonLd data={[APP_JSON_LD, BREADCRUMB_JSON_LD]} />
      <div className={`theme-kikota kk-under-nav ${barlow.variable} ${inter.variable} flex-1`}>
        <KikotaLanding />
      </div>
    </>
  );
}
