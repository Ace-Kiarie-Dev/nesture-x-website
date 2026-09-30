import type { Metadata } from 'next';

export const metadata: Metadata = {
  // A plain string title here would reset the root "%s | Nesture-X" template
  // for every tool page below, so the template is restated for them.
  title: {
    default: 'Free Online Tools for Designers & Businesses',
    template: '%s | Nesture-X',
  },
  description:
    'Free online tools for designers, developers and Kenyan businesses: convert images, make QR codes, build invoices and validate M-Pesa numbers. No sign-up.',
  keywords: [
    'free online tools',
    'image converter',
    'QR code generator',
    'invoice generator',
    'M-Pesa validator',
    'PDF tools',
    'color palette generator',
    'Nairobi',
    'Kenya',
    'Nesture-X',
  ],
  openGraph: {
    title: 'Free Online Tools for Designers & Businesses | Nesture-X',
    description:
      'Free online tools for designers, developers and Kenyan businesses: convert images, make QR codes, build invoices and validate M-Pesa numbers. No sign-up.',
    url: 'https://nesturex.com/tools',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools for Designers & Businesses | Nesture-X',
    description:
      'Free online tools for designers, developers and Kenyan businesses: convert images, make QR codes, build invoices and validate M-Pesa numbers. No sign-up.',
  },
  alternates: {
    canonical: '/tools',
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
