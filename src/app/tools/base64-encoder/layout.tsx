import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'Base64 Encoder & Decoder — Text & File, URL-Safe',
  description:
    'Free online Base64 encoder and decoder. Encode text or files, decode Base64 strings, copy as a data URI, and use URL-safe mode. No account or file storage.',
  keywords: [
    'Base64 encoder',
    'Base64 decoder',
    'encode to Base64',
    'decode Base64',
    'Base64 online free',
    'data URI generator',
    'URL-safe Base64',
    'developer tools online',
  ],
  openGraph: {
    title: 'Base64 Encoder & Decoder — Text & File, URL-Safe | Nesture-X',
    description:
      'Free online Base64 encoder and decoder. Encode text or files, decode Base64 strings, copy as a data URI, and use URL-safe mode. No account or file storage.',
    url: 'https://nesturex.com/tools/base64-encoder',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder & Decoder — Text & File, URL-Safe | Nesture-X',
    description:
      'Free online Base64 encoder and decoder. Encode text or files, decode Base64 strings, copy as a data URI, and use URL-safe mode. No account or file storage.',
  },
  alternates: {
    canonical: '/tools/base64-encoder',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Base64 Encoder & Decoder',
  url: 'https://nesturex.com/tools/base64-encoder',
  description:
    'Free online Base64 encoder and decoder. Encode text or files to Base64, decode Base64 strings, copy as data URI, URL-safe mode for developers. No account, no file storage.',
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
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Free Tools', path: '/tools' },
          { name: jsonLd.name, path: '/tools/base64-encoder' },
        ])}
      />
      {children}
    </>
  );
}
