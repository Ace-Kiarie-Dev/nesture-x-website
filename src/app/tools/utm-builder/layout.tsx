import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UTM Link Builder — Free UTM Generator with Bulk Export | Nesture-X',
  description:
    'Build UTM tracking links instantly with presets for Google Ads, social media, email and WhatsApp. Bulk mode exports CSV. Free UTM generator with link history — no account needed.',
  keywords: [
    'UTM link builder',
    'UTM generator free',
    'UTM parameters',
    'Google Analytics UTM',
    'campaign URL builder',
    'UTM tracking links',
    'bulk UTM generator',
    'digital marketing tools',
  ],
  openGraph: {
    title: 'UTM Link Builder — Free UTM Generator with Bulk Export | Nesture-X',
    description:
      'Build UTM tracking links instantly with presets for Google Ads, social media, email and WhatsApp. Bulk mode exports CSV. Free UTM generator with link history — no account needed.',
    url: 'https://nesturex.com/tools/utm-builder',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/utm-builder.png',
        width: 1200,
        height: 630,
        alt: 'UTM Link Builder — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UTM Link Builder — Free UTM Generator with Bulk Export | Nesture-X',
    description:
      'Build UTM tracking links instantly with presets for Google Ads, social media, email and WhatsApp. Bulk mode exports CSV. Free UTM generator with link history — no account needed.',
    images: ['https://nesturex.com/og/tools/utm-builder.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/utm-builder',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UTM Link Builder',
  url: 'https://nesturex.com/tools/utm-builder',
  description:
    'Build UTM tracking links instantly with presets for Google Ads, social media, email and WhatsApp. Bulk mode exports CSV. Free UTM generator with link history — no account needed.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: {
    '@type': 'Organization',
    name: 'Nesture-X',
    url: 'https://nesturex.com',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
