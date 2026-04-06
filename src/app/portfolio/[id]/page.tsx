import { notFound } from 'next/navigation';
import portfolioData from '@/data/portfolio.json';
import type { PortfolioItem } from '@/components/sections/Portfolio';
import PortfolioDetail from './PortfolioDetail';

export async function generateStaticParams() {
  return (portfolioData as PortfolioItem[]).map(i => ({ id: i.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = (portfolioData as PortfolioItem[]).find(i => i.id === id);
  if (!item) return {};
  const displayClient = item.client === 'Various Clients' ? 'Nesture-X Client Work' : item.client;
  return {
    title: `${displayClient} — ${item.type} | Nesture-X`,
    description: item.description,
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const items = portfolioData as PortfolioItem[];
  const item = items.find(i => i.id === id);
  if (!item) notFound();
  return <PortfolioDetail item={item} items={items} />;
}
