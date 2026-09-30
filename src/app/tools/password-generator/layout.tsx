import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Password Generator — Secure Passwords & Passphrases Free',
  description:
    'Generate secure passwords and passphrases free online. Set length and character sets, or bulk generate up to 20. Uses the Web Crypto API, nothing stored.',
  keywords: [
    'password generator free',
    'secure password generator',
    'random password maker',
    'strong password generator',
    'passphrase generator',
    'bulk password generator',
    'crypto password generator',
  ],
  openGraph: {
    title: 'Password Generator — Secure Passwords & Passphrases Free | Nesture-X',
    description:
      'Generate secure passwords and passphrases free online. Set length and character sets, or bulk generate up to 20. Uses the Web Crypto API, nothing stored.',
    url: 'https://nesturex.com/tools/password-generator',
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Password Generator — Secure Passwords & Passphrases Free | Nesture-X',
    description:
      'Generate secure passwords and passphrases free online. Set length and character sets, or bulk generate up to 20. Uses the Web Crypto API, nothing stored.',
  },
  alternates: {
    canonical: '/tools/password-generator',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Password Generator',
  url: 'https://nesturex.com/tools/password-generator',
  description:
    'Generate cryptographically secure passwords and passphrases free online. Customise length, character sets, bulk generate up to 20 passwords — powered by Web Crypto API, nothing stored.',
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
