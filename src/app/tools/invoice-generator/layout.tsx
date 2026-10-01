import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'Free Invoice Generator — PDF Invoices with M-Pesa Details',
  description:
    'Create professional PDF invoices free online with your logo, line items, VAT, M-Pesa till number and bank details. Download instantly, with no watermark.',
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
      'Create professional PDF invoices free online with your logo, line items, VAT, M-Pesa till number and bank details. Download instantly, with no watermark.',
    url: 'https://nesturex.com/tools/invoice-generator',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator — PDF Invoices with M-Pesa Details | Nesture-X',
    description:
      'Create professional PDF invoices free online with your logo, line items, VAT, M-Pesa till number and bank details. Download instantly, with no watermark.',
  },
  alternates: {
    canonical: '/tools/invoice-generator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Free Invoice Generator',
  url: 'https://nesturex.com/tools/invoice-generator',
  description:
    'Create professional PDF invoices free online with your logo, line items, VAT, M-Pesa till number and bank details. Download instantly, with no watermark.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  provider: { '@id': 'https://nesturex.com/#organization' },
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
          { name: jsonLd.name, path: '/tools/invoice-generator' },
        ])}
      />
      {children}
    </>
  );
}
