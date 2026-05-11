import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word & Character Counter — Reading Time & Keyword Density | Nesture-X',
  description:
    'Free online word counter. Count words, characters, sentences, paragraphs and reading time. Includes keyword density analysis, speaking time and character limit checker.',
  keywords: [
    'word counter online',
    'character counter',
    'reading time calculator',
    'word count tool',
    'keyword density checker',
    'sentence counter',
    'free word counter',
    'content writing tool',
  ],
  openGraph: {
    title: 'Word & Character Counter — Reading Time & Keyword Density | Nesture-X',
    description:
      'Free online word counter. Count words, characters, sentences, paragraphs and reading time. Includes keyword density analysis, speaking time and character limit checker.',
    url: 'https://nesturex.com/tools/word-counter',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/word-counter.png',
        width: 1200,
        height: 630,
        alt: 'Word & Character Counter — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word & Character Counter — Reading Time & Keyword Density | Nesture-X',
    description:
      'Free online word counter. Count words, characters, sentences, paragraphs and reading time. Includes keyword density analysis, speaking time and character limit checker.',
    images: ['https://nesturex.com/og/tools/word-counter.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/word-counter',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Word & Character Counter',
  url: 'https://nesturex.com/tools/word-counter',
  description:
    'Free online word counter. Count words, characters, sentences, paragraphs and reading time. Includes keyword density analysis, speaking time and character limit checker.',
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
