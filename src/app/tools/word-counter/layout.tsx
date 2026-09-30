import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'Word & Character Counter — Reading Time & Keyword Density',
  description:
    'Free online word counter. Count words, characters, sentences, paragraphs and reading time, with keyword density, speaking time and a character limit check.',
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
      'Free online word counter. Count words, characters, sentences, paragraphs and reading time, with keyword density, speaking time and a character limit check.',
    url: 'https://nesturex.com/tools/word-counter',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Word & Character Counter — Reading Time & Keyword Density | Nesture-X',
    description:
      'Free online word counter. Count words, characters, sentences, paragraphs and reading time, with keyword density, speaking time and a character limit check.',
  },
  alternates: {
    canonical: '/tools/word-counter',
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
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Free Tools', path: '/tools' },
          { name: jsonLd.name, path: '/tools/word-counter' },
        ])}
      />
      {children}
    </>
  );
}
