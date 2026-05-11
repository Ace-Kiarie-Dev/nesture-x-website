import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Studio — Convert, Compress, Resize & Edit Images Free | Nesture-X',
  description:
    'Free online image editor. Convert between JPG, PNG, WebP, AVIF and 5 more formats. Compress, resize, rotate, flip and adjust images — no upload limit beyond 4MB, no account needed.',
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
      'Free online image editor. Convert between JPG, PNG, WebP, AVIF and 5 more formats. Compress, resize, rotate, flip and adjust images — no upload limit beyond 4MB, no account needed.',
    url: 'https://nesturex.com/tools/image-studio',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/image-studio.png',
        width: 1200,
        height: 630,
        alt: 'Image Studio — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Studio — Convert, Compress, Resize & Edit Images Free | Nesture-X',
    description:
      'Free online image editor. Convert between JPG, PNG, WebP, AVIF and 5 more formats. Compress, resize, rotate, flip and adjust images — no upload limit beyond 4MB, no account needed.',
    images: ['https://nesturex.com/og/tools/image-studio.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/image-studio',
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
      {children}
    </>
  );
}
