import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Tools for Designers & Businesses | Nesture-X',
  description:
    '11 free tools for designers, developers and Kenyan businesses. Convert images, generate QR codes, build invoices, validate M-Pesa numbers and more — no account needed.',
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
      '11 free tools for designers, developers and Kenyan businesses. Convert images, generate QR codes, build invoices, validate M-Pesa numbers and more — no account needed.',
    url: 'https://nesturex.com/tools',
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: 'https://nesturex.com/og/tools/tools-hub.png',
        width: 1200,
        height: 630,
        alt: 'Free Online Tools — Nesture-X',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools for Designers & Businesses | Nesture-X',
    description:
      '11 free tools for designers, developers and Kenyan businesses. Convert images, generate QR codes, build invoices, validate M-Pesa numbers and more — no account needed.',
    images: ['https://nesturex.com/og/tools/tools-hub.png'],
  },
  alternates: {
    canonical: 'https://nesturex.com/tools',
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
