import type { Metadata } from 'next';
import PortfolioEntry from '@/components/sections/PortfolioEntry';

export const metadata: Metadata = {
  title: 'Portfolio: Websites, Apps, Logos & Design Work',
  description:
    'Explore Nesture-X work for Kenyan businesses: websites, web apps, logos, business cards, company profiles, flyers, and social media design.',
  alternates: {
    canonical: '/portfolio',
  },
};

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioEntry />
    </main>
  );
}
