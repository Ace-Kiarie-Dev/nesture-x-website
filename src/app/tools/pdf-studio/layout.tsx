import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Studio — Compress, Merge, Split & Protect PDFs Free | Nesture-X',
  description:
    'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files — all in one place, no account needed.',
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
      'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files — all in one place, no account needed.',
    url: 'https://nesturex.com/tools/pdf-studio',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/pdf-studio.png',
        width: 1200,
        height: 630,
        alt: 'PDF Studio — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF Studio — Compress, Merge, Split & Protect PDFs Free | Nesture-X',
    description:
      'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files — all in one place, no account needed.',
    images: ['https://nesturex.com/og/tools/pdf-studio.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/pdf-studio',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF Studio',
  url: 'https://nesturex.com/tools/pdf-studio',
  description:
    'Free online PDF tools. Compress PDF file size, merge multiple PDFs, split pages, rotate and password protect PDF files — all in one place, no account needed.',
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
