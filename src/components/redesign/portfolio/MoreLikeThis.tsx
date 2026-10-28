import type { WorkCard } from '@/lib/portfolio-data';

// Scaffold: filled in by a later step of the /portfolio rebuild.
export default function MoreLikeThis({ cards }: { cards: WorkCard[] }) {
  return cards.length ? null : null;
}
