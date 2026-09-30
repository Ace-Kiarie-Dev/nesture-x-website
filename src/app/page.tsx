import type { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: { absolute: 'Web Design & Development Company in Nairobi | Nesture-X' },
  description:
    'Nesture-X is a Nairobi creative tech agency building websites, web apps, and mobile apps with M-Pesa integration, plus branding, design, and printing.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <HomeClient />;
}
