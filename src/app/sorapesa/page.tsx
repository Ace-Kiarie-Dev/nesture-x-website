import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import SoraPesaLanding from '@/components/sorapesa/SoraPesaLanding';
import '@/components/sorapesa/sorapesa.css';

// Montserrat is only used by SoraPesa, so it's loaded here rather than in the root layout.
const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const TITLE = 'SoraPesa — Money App for Young Kenyans | Nesture-X';
const DESCRIPTION =
  'Track your salary, bills, and side hustles in one place. SoraPesa is a Kenya-first money app that helps young adults see where their money goes and make better money decisions. Coming soon to Google Play.';
const PAGE_URL = 'https://nesturex.com/sorapesa';
const OG_IMAGE = 'https://nesturex.com/images/originals/SoraPesa-Card.webp';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'SoraPesa',
    'money app Kenya',
    'budget app Kenya',
    'M-Pesa statement tracker',
    'salary tracker',
    'side hustle tracker Kenya',
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: 'Nesture-X',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 920,
        height: 520,
        alt: 'SoraPesa — Open the Door to Smarter Money.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function SoraPesaPage() {
  return (
    <div className={`theme-sorapesa ${montserrat.variable} flex-1`}>
      <SoraPesaLanding />
    </div>
  );
}
