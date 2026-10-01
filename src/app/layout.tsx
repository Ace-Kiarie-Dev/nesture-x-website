import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ClientShell from "@/components/layout/ClientShell";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd, SITE_URL } from "@/lib/jsonLd";
import { CONTACT, activeSocialLinks } from "@/constants";

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  // Resolves every relative canonical and OG/Twitter image URL site-wide.
  metadataBase: new URL('https://nesturex.com'),
  title: {
    default: 'Nesture-X | Creative Technology Agency in Nairobi',
    template: '%s | Nesture-X',
  },
  description:
    'Nesture-X is a Nairobi creative tech agency building websites, web apps, and mobile apps with M-Pesa integration, plus branding, design, and printing.',
  // Site-wide share defaults. The image comes from app/opengraph-image.tsx and
  // app/twitter-image.tsx; segments with their own image files override it.
  openGraph: {
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// Site-wide structured data. sameAs lists only the social profiles that are set;
// the address is city-level only. LocalBusiness is intentionally not used yet.
const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const siteJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Nesture-X',
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-square.png`,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    areaServed: [
      { '@type': 'City', name: 'Nairobi' },
      { '@type': 'Country', name: 'Kenya' },
    ],
    sameAs: activeSocialLinks().map((link) => link.url),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Nesture-X',
    url: SITE_URL,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en-KE',
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
  const theme = localStorage.getItem('nx-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd data={siteJsonLd} />
        <ClientShell>
          {children}
        </ClientShell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
