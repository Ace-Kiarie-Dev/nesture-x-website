import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'Logo Text Previewer — See Your Brand Name in Any Font Free',
  description:
    'Preview your brand name in 25 fonts and 4 layouts before commissioning a logo, then download it as PNG or SVG. A free brand typography tool by Nesture-X.',
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
      'Preview your brand name in 25 fonts and 4 layouts before commissioning a logo, then download it as PNG or SVG. A free brand typography tool by Nesture-X.',
    url: 'https://nesturex.com/tools/logo-text-preview',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logo Text Previewer — See Your Brand Name in Any Font Free | Nesture-X',
    description:
      'Preview your brand name in 25 fonts and 4 layouts before commissioning a logo, then download it as PNG or SVG. A free brand typography tool by Nesture-X.',
  },
  alternates: {
    canonical: '/tools/logo-text-preview',
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
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Free Tools', path: '/tools' },
          { name: jsonLd.name, path: '/tools/logo-text-preview' },
        ])}
      />
      {children}
    </>
  );
}
