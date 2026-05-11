import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logo Text Previewer — See Your Brand Name in Any Font Free | Nesture-X',
  description:
    'Preview your brand name across 25 fonts and 4 layouts before commissioning a logo. Download as PNG or SVG. Free brand typography tool by Nesture-X — Nairobi\'s creative tech agency.',
  keywords: [
    'logo text previewer',
    'brand name font preview',
    'logo font generator',
    'free logo preview',
    'typography preview tool',
    'brand identity tool',
    'logo designer Nairobi',
  ],
  openGraph: {
    title: 'Logo Text Previewer — See Your Brand Name in Any Font Free | Nesture-X',
    description:
      'Preview your brand name across 25 fonts and 4 layouts before commissioning a logo. Download as PNG or SVG. Free brand typography tool by Nesture-X — Nairobi\'s creative tech agency.',
    url: 'https://nesturex.com/tools/logo-text-preview',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/logo-text-preview.png',
        width: 1200,
        height: 630,
        alt: 'Logo Text Previewer — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logo Text Previewer — See Your Brand Name in Any Font Free | Nesture-X',
    description:
      'Preview your brand name across 25 fonts and 4 layouts before commissioning a logo. Download as PNG or SVG. Free brand typography tool by Nesture-X — Nairobi\'s creative tech agency.',
    images: ['https://nesturex.com/og/tools/logo-text-preview.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/logo-text-preview',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Logo Text Previewer',
  url: 'https://nesturex.com/tools/logo-text-preview',
  description:
    "Preview your brand name across 25 fonts and 4 layouts before commissioning a logo. Download as PNG or SVG. Free brand typography tool by Nesture-X — Nairobi's creative tech agency.",
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
