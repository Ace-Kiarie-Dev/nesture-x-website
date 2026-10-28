import type { DigitalCard } from '@/lib/portfolio-data';
import PortfolioCard from './PortfolioCard';

// ?view=digital&type=web|mobile: NX Originals and client sites as PortfolioCards, in the
// old Digital Products order. Each item keeps its #slug anchor (the status pages link
// back to it). Screenshots share one aspect, so a plain grid rather than masonry.
export default function DigitalGrid({ cards, title }: { cards: DigitalCard[]; title: string }) {
  return (
    <section className="nxpf-grid-sec" aria-labelledby="nxpf-digital-title">
      <h2 id="nxpf-digital-title" className="nxpf-sub-title">
        {title}
      </h2>
      <ul className="nxpf-digital">
        {cards.map((card, i) => (
          <li key={card.key} id={card.anchor} className="nxpf-digital-item">
            <PortfolioCard
              card={card}
              eager={i < 3}
              sizes="(min-width: 1320px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
