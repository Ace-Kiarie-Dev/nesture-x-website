import type { WorkCard } from '@/lib/portfolio-data';
import { SectionHeading } from '@/components/redesign';
import PortfolioCard from './PortfolioCard';

// Same-category cards in a horizontal scroll-snap row (same card and hover as the grid).
// The caller excludes the current project; hidden when fewer than two remain.
export default function MoreLikeThis({ cards }: { cards: WorkCard[] }) {
  if (cards.length < 2) return null;
  return (
    <section className="nxpf-more" aria-labelledby="nxpf-more-title">
      <SectionHeading id="nxpf-more-title" eyebrow="Keep looking" title="MORE LIKE THIS" outline="THIS" />
      {/* A swipe row, so it takes focus for keyboard scrolling. */}
      <ul className="nxpf-more-row" tabIndex={0} aria-label="More like this">
        {cards.map((card) => (
          <li key={card.key} className="nxpf-more-item">
            <PortfolioCard card={card} sizes="(min-width: 768px) 300px, 240px" />
          </li>
        ))}
      </ul>
    </section>
  );
}
