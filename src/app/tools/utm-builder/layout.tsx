import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'UTM Link Builder — Free UTM Generator with Bulk Export',
  description:
    'Build UTM tracking links instantly with presets for Google Ads, social, email and WhatsApp. Bulk mode exports CSV. A free UTM generator, no account needed.',
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
      'Build UTM tracking links instantly with presets for Google Ads, social, email and WhatsApp. Bulk mode exports CSV. A free UTM generator, no account needed.',
    url: 'https://nesturex.com/tools/utm-builder',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UTM Link Builder — Free UTM Generator with Bulk Export | Nesture-X',
    description:
      'Build UTM tracking links instantly with presets for Google Ads, social, email and WhatsApp. Bulk mode exports CSV. A free UTM generator, no account needed.',
  },
  alternates: {
    canonical: '/tools/utm-builder',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UTM Link Builder',
  url: 'https://nesturex.com/tools/utm-builder',
  description:
    'Build UTM tracking links instantly with presets for Google Ads, social, email and WhatsApp. Bulk mode exports CSV. A free UTM generator, no account needed.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: { '@id': 'https://nesturex.com/#organization' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Free Tools', path: '/tools' },
          { name: jsonLd.name, path: '/tools/utm-builder' },
        ])}
      />
      {children}
    </>
  );
}
