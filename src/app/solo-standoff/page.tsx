import type { Metadata } from 'next';
import { JsonLd, SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import SoloStandoffLanding from '@/components/solo-standoff/SoloStandoffLanding';

const TITLE = 'Solo Standoff: Rooftop Puzzle Shooter | NX Gaming';
const DESCRIPTION =
  'Tap to fire. Plan the chain. A free puzzle game from Nesture-X with 70 missions and a new Daily Challenge every day.';
const PAGE_URL = `${SITE_URL}/solo-standoff`;
const OG_IMAGE = '/images/solo-standoff/social/og_image.png';

export const metadata: Metadata = {
  // Absolute: the NX Gaming suffix replaces the site's "| Nesture-X" template.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'Solo Standoff',
    'puzzle game',
    'rooftop puzzle shooter',
    'NX Gaming',
    'Nesture-X game',
    'Android puzzle game',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Solo Standoff: Think first. Then fire.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: '/solo-standoff',
  },
};

const APP_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Solo Standoff',
  description: DESCRIPTION,
  url: PAGE_URL,
  image: `${SITE_URL}${OG_IMAGE}`,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Android',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  author: { '@type': 'Person', name: 'Peter Kiarie' },
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const BREADCRUMB_JSON_LD = breadcrumbList([
  { name: 'Home', path: '/' },
  { name: 'Solo Standoff', path: '/solo-standoff' },
]);

export default function SoloStandoffPage() {
  return (
    <>
      <JsonLd data={[APP_JSON_LD, BREADCRUMB_JSON_LD]} />
      <SoloStandoffLanding />
    </>
  );
}
