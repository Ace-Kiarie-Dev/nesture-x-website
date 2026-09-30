import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'Image Studio — Convert, Compress, Resize & Edit Images Free',
  description:
    'Free online image editor. Convert JPG, PNG, WebP, AVIF and 5 more formats, then compress, resize, rotate and flip images. Files up to 4MB, no sign-up.',
  keywords: [
    'image converter online free',
    'convert image to webp',
    'compress image',
    'resize image online',
    'image editor free',
    'jpg to png',
    'png to webp',
    'avif converter',
    'image resizer',
  ],
  openGraph: {
    title: 'Image Studio — Convert, Compress, Resize & Edit Images Free | Nesture-X',
    description:
      'Free online image editor. Convert JPG, PNG, WebP, AVIF and 5 more formats, then compress, resize, rotate and flip images. Files up to 4MB, no sign-up.',
    url: 'https://nesturex.com/tools/image-studio',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Studio — Convert, Compress, Resize & Edit Images Free | Nesture-X',
    description:
      'Free online image editor. Convert JPG, PNG, WebP, AVIF and 5 more formats, then compress, resize, rotate and flip images. Files up to 4MB, no sign-up.',
  },
  alternates: {
    canonical: '/tools/image-studio',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Image Studio',
  url: 'https://nesturex.com/tools/image-studio',
  description:
    'Free online image editor. Convert between JPG, PNG, WebP, AVIF and 5 more formats. Compress, resize, rotate, flip and adjust images — no upload limit beyond 4MB, no account needed.',
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
          { name: jsonLd.name, path: '/tools/image-studio' },
        ])}
      />
      {children}
    </>
  );
}
