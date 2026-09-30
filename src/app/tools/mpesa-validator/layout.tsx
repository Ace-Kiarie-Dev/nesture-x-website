import type { Metadata } from 'next';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: 'M-Pesa Validator — Validate Till, Paybill & Phone Numbers Free',
  description:
    'Free M-Pesa validator for Kenyan businesses. Check and normalise phone, Till and Paybill numbers instantly, with format conversion and network detection.',
  keywords: [
    'M-Pesa validator',
    'validate M-Pesa number',
    'M-Pesa till number check',
    'Paybill number validator',
    'Kenya phone number validator',
    'Safaricom number format',
    'M-Pesa phone format Kenya',
  ],
  openGraph: {
    title: 'M-Pesa Validator — Validate Till, Paybill & Phone Numbers Free | Nesture-X',
    description:
      'Free M-Pesa validator for Kenyan businesses. Check and normalise phone, Till and Paybill numbers instantly, with format conversion and network detection.',
    url: 'https://nesturex.com/tools/mpesa-validator',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M-Pesa Validator — Validate Till, Paybill & Phone Numbers Free | Nesture-X',
    description:
      'Free M-Pesa validator for Kenyan businesses. Check and normalise phone, Till and Paybill numbers instantly, with format conversion and network detection.',
  },
  alternates: {
    canonical: '/tools/mpesa-validator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'M-Pesa Validator',
  url: 'https://nesturex.com/tools/mpesa-validator',
  description:
    'Free M-Pesa validation tool for Kenyan businesses. Validate and normalise M-Pesa phone numbers, Till numbers and Paybill numbers instantly — with format conversion and network detection.',
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
          { name: jsonLd.name, path: '/tools/mpesa-validator' },
        ])}
      />
      {children}
    </>
  );
}
