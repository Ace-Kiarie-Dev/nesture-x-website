import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Color Palette Generator — Export CSS, Tailwind & JSON Free | Nesture-X',
  description:
    'Generate beautiful colour palettes from any base colour. Export as CSS variables, Tailwind config, JSON or PNG. Free online colour palette tool for designers and developers.',
  keywords: [
    'color palette generator',
    'colour palette from hex',
    'CSS color variables',
    'Tailwind color palette',
    'export color palette',
    'free palette generator',
    'design color tool',
  ],
  openGraph: {
    title: 'Color Palette Generator — Export CSS, Tailwind & JSON Free | Nesture-X',
    description:
      'Generate beautiful colour palettes from any base colour. Export as CSS variables, Tailwind config, JSON or PNG. Free online colour palette tool for designers and developers.',
    url: 'https://nesturex.com/tools/color-palette',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/color-palette.png',
        width: 1200,
        height: 630,
        alt: 'Color Palette Generator — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Palette Generator — Export CSS, Tailwind & JSON Free | Nesture-X',
    description:
      'Generate beautiful colour palettes from any base colour. Export as CSS variables, Tailwind config, JSON or PNG. Free online colour palette tool for designers and developers.',
    images: ['https://nesturex.com/og/tools/color-palette.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/color-palette',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Color Palette Generator',
  url: 'https://nesturex.com/tools/color-palette',
  description:
    'Generate beautiful colour palettes from any base colour. Export as CSS variables, Tailwind config, JSON or PNG. Free online colour palette tool for designers and developers.',
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
