import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator — Free with Logo & SVG Export | Nesture-X',
  description:
    'Generate free QR codes for any URL or text. Customise colours, add a center logo overlay, choose error correction level and download as PNG or SVG — no account needed.',
  keywords: [
    'QR code generator free',
    'generate QR code',
    'QR code with logo',
    'custom QR code',
    'download QR code SVG',
    'QR code maker online',
    'free QR generator Kenya',
  ],
  openGraph: {
    title: 'QR Code Generator — Free with Logo & SVG Export | Nesture-X',
    description:
      'Generate free QR codes for any URL or text. Customise colours, add a center logo overlay, choose error correction level and download as PNG or SVG — no account needed.',
    url: 'https://nesturex.com/tools/qr-generator',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/qr-generator.png',
        width: 1200,
        height: 630,
        alt: 'QR Code Generator — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Generator — Free with Logo & SVG Export | Nesture-X',
    description:
      'Generate free QR codes for any URL or text. Customise colours, add a center logo overlay, choose error correction level and download as PNG or SVG — no account needed.',
    images: ['https://nesturex.com/og/tools/qr-generator.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/qr-generator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'QR Code Generator',
  url: 'https://nesturex.com/tools/qr-generator',
  description:
    'Generate free QR codes for any URL or text. Customise colours, add a center logo overlay, choose error correction level and download as PNG or SVG — no account needed.',
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
