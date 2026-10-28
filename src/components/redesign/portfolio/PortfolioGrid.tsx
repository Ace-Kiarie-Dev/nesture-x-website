import type { CategoryFilter, WorkCard } from '@/lib/portfolio-data';

// Scaffold: filled in by a later step of the /portfolio rebuild.
export default function PortfolioGrid({ cards, initialCategory }: { cards: WorkCard[]; initialCategory: CategoryFilter }) {
  return cards.length && initialCategory ? null : null;
}
