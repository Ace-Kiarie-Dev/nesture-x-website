import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import PortfolioHero from '@/components/redesign/portfolio/PortfolioHero';
import PortfolioGrid from '@/components/redesign/portfolio/PortfolioGrid';
import TrustStrip from '@/components/redesign/portfolio/TrustStrip';
import { WORK_CARDS, parseCategory } from '@/lib/portfolio-data';
import '@/components/redesign/portfolio/portfolio.css';

export const metadata: Metadata = {
  title: 'Portfolio: Websites, Apps, Logos & Design Work',
  description:
    'Explore Nesture-X work for Kenyan businesses: websites, web apps, logos, business cards, company profiles, flyers, and social media design.',
  alternates: {
    canonical: '/portfolio',
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Rendered per request (it reads searchParams), so a shared ?category= link arrives
// already filtered in the server HTML.
export default async function PortfolioPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // The old split screen's views: Digital products now live under Web Projects,
  // and Design work is the default grid.
  if (params.view === 'digital') permanentRedirect('/portfolio?category=web');
  if (params.view === 'design') permanentRedirect('/portfolio');

  const category = parseCategory(params.category);

  return (
    <main className="nxpf">
      <div className="nxpf-hero-wrap">
        <PortfolioHero />
      </div>
      <div className="nxpf-wrap">
        <PortfolioGrid cards={WORK_CARDS} initialCategory={category} />
        <TrustStrip />
      </div>
    </main>
  );
}
