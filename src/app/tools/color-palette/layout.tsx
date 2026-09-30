import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'Color Palette Generator — Export CSS, Tailwind & JSON Free',
  description:
    'Generate colour palettes from any base colour. Export as CSS variables, Tailwind config, JSON or PNG. A free palette tool for designers and developers.',
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
      'Generate colour palettes from any base colour. Export as CSS variables, Tailwind config, JSON or PNG. A free palette tool for designers and developers.',
    url: 'https://nesturex.com/tools/color-palette',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Color Palette Generator — Export CSS, Tailwind & JSON Free | Nesture-X',
    description:
      'Generate colour palettes from any base colour. Export as CSS variables, Tailwind config, JSON or PNG. A free palette tool for designers and developers.',
  },
  alternates: {
    canonical: '/tools/color-palette',
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
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Free Tools', path: '/tools' },
          { name: jsonLd.name, path: '/tools/color-palette' },
        ])}
      />
      {children}
    </>
  );
}
