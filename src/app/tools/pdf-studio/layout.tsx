import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'PDF Studio — Compress, Merge, Split & Protect PDFs Free',
  description:
    'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files, all in one place with no account.',
  keywords: [
    'compress PDF online free',
    'merge PDF files',
    'split PDF',
    'rotate PDF',
    'protect PDF with password',
    'PDF compressor',
    'combine PDF',
    'PDF tools online',
  ],
  openGraph: {
    title: 'PDF Studio — Compress, Merge, Split & Protect PDFs Free | Nesture-X',
    description:
      'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files, all in one place with no account.',
    url: 'https://nesturex.com/tools/pdf-studio',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Studio — Compress, Merge, Split & Protect PDFs Free | Nesture-X',
    description:
      'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files, all in one place with no account.',
  },
  alternates: {
    canonical: '/tools/pdf-studio',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Studio',
  url: 'https://nesturex.com/tools/pdf-studio',
  description:
    'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files, all in one place with no account.',
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
          { name: jsonLd.name, path: '/tools/pdf-studio' },
        ])}
      />
      {children}
    </>
  );
}
