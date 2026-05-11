import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Invoice Generator — PDF Invoices with M-Pesa Details | Nesture-X',
  description:
    'Create professional PDF invoices free online. Add your logo, line items, VAT, discounts, M-Pesa till number and bank details. Download instantly — no account, no watermark.',
  keywords: [
    'free invoice generator',
    'create invoice online',
    'PDF invoice maker',
    'invoice with M-Pesa',
    'invoice generator Kenya',
    'small business invoice',
    'free invoice download',
    'invoice template',
  ],
  openGraph: {
    title: 'Free Invoice Generator — PDF Invoices with M-Pesa Details | Nesture-X',
    description:
      'Create professional PDF invoices free online. Add your logo, line items, VAT, discounts, M-Pesa till number and bank details. Download instantly — no account, no watermark.',
    url: 'https://nesturex.com/tools/invoice-generator',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/invoice-generator.png',
        width: 1200,
        height: 630,
        alt: 'Free Invoice Generator — Nesture-X Free Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator — PDF Invoices with M-Pesa Details | Nesture-X',
    description:
      'Create professional PDF invoices free online. Add your logo, line items, VAT, discounts, M-Pesa till number and bank details. Download instantly — no account, no watermark.',
    images: ['https://nesturex.com/og/tools/invoice-generator.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools/invoice-generator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free Invoice Generator',
  url: 'https://nesturex.com/tools/invoice-generator',
  description:
    'Create professional PDF invoices free online. Add your logo, line items, VAT, discounts, M-Pesa till number and bank details. Download instantly — no account, no watermark.',
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
