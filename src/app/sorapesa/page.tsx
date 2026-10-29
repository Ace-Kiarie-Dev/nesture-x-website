import type { Metadata } from 'next';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import localFont from 'next/font/local';
import SoraPesaLanding from '@/components/sorapesa/SoraPesaLanding';
import '@/components/sorapesa/sorapesa.css';

// Montserrat is only used by SoraPesa, so it's loaded here rather than in the root layout.
// Self-hosted from src/fonts (latin, OFL).
const montserrat = localFont({
  src: [
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '700', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Montserrat Fallback'],
});

const TITLE = 'SoraPesa — Money App for Young Kenyans';
const SHARE_TITLE = `${TITLE} | Nesture-X`;
const DESCRIPTION =
  'SoraPesa is a Kenya-first money app for young adults. Track your salary, bills, and side hustles in one place and see where your money goes. Coming soon.';
const PAGE_URL = 'https://nesturex.com/sorapesa';
const OG_IMAGE = 'https://nesturex.com/images/originals/SoraPesa-Card.webp';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'SoraPesa',
    'money app Kenya',
    'budget app Kenya',
    'M-Pesa statement tracker',
    'salary tracker',
    'side hustle tracker Kenya',
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
        alt: 'SoraPesa — Open the Door to Smarter Money.',
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
    canonical: '/sorapesa',
  },
};

// Structured data: the app itself (no offers or ratings until it launches) and its breadcrumb.
const APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'SoraPesa',
  description: DESCRIPTION,
  url: PAGE_URL,
  image: OG_IMAGE,
  operatingSystem: 'Android',
  applicationCategory: 'FinanceApplication',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const BREADCRUMB_JSON_LD = breadcrumbList([
  { name: 'Home', path: '/' },
  { name: 'SoraPesa', path: '/sorapesa' },
]);

export default function SoraPesaPage() {
  return (
    <>
      <JsonLd data={[APP_JSON_LD, BREADCRUMB_JSON_LD]} />
      <div className={`theme-sorapesa sp-under-nav ${montserrat.variable} flex-1`}>
        <SoraPesaLanding />
      </div>
    </>
  );
}
