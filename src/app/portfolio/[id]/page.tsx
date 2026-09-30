import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import portfolioData from '@/data/portfolio.json';
import type { PortfolioItem } from '@/components/sections/Portfolio';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';
import { isIndexablePortfolioItem, portfolioDescription, portfolioTitle } from '@/lib/portfolioSeo';
import PortfolioDetail from './PortfolioDetail';

export async function generateStaticParams() {
  return (portfolioData as PortfolioItem[]).map(i => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = (portfolioData as PortfolioItem[]).find(i => i.id === id);
  if (!item) return {};
  return {
    title: portfolioTitle(item),
    description: portfolioDescription(item),
    alternates: {
      canonical: `/portfolio/${id}`,
    },
    // "Various Clients" pages stay on the site and in the grid, but out of the index.
    ...(isIndexablePortfolioItem(item) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = portfolioData as PortfolioItem[];
  const item = items.find(i => i.id === id);
  if (!item) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: portfolioTitle(item), path: `/portfolio/${id}` },
        ])}
      />
      <PortfolioDetail item={item} items={items} />
    </>
  );
}
