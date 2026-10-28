import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { CATEGORIES, categoryCounts, type CategoryFilter, type WorkCard } from '@/lib/portfolio-data';
import PortfolioTabs, { type TabDef } from './PortfolioTabs';
import PortfolioCard from './PortfolioCard';

const COMPASS = ASSETS_3D['misc-compass'];

type PortfolioGridProps = { cards: WorkCard[]; initialCategory: CategoryFilter };

// Server-rendered masonry of every card; PortfolioTabs (client) filters it with CSS.
// The first three cards of the initial view load eagerly, the rest lazily.
export default function PortfolioGrid({ cards, initialCategory }: PortfolioGridProps) {
  const counts = categoryCounts(cards);
  const tabs: TabDef[] = [
    { key: 'all', label: 'All', count: cards.length },
    ...CATEGORIES.filter((c) => counts[c.key] > 0).map((c) => ({ key: c.key, label: c.label, count: counts[c.key] })),
  ];
  const eager = new Set(
    cards.filter((c) => initialCategory === 'all' || c.category === initialCategory).slice(0, 3).map((c) => c.key),
  );

  return (
    <section className="nxpf-grid-sec" aria-labelledby="nxpf-grid-title">
      <h2 id="nxpf-grid-title" className="nx-sr-only">
        Projects
      </h2>
      <PortfolioTabs
        tabs={tabs}
        categoryKeys={CATEGORIES.map((c) => c.key)}
        emptyKeys={CATEGORIES.filter((c) => counts[c.key] === 0).map((c) => c.key)}
      >
        <ul className="nxpf-grid">
          {cards.map((card) => (
            <li key={card.key} className="nxpf-item" data-cat={card.category}>
              <PortfolioCard card={card} eager={eager.has(card.key)} />
            </li>
          ))}
        </ul>
        <div className="nxpf-empty nx-clay">
          <Image src={COMPASS.src} alt="" width={COMPASS.width} height={COMPASS.height} sizes="140px" className="nxpf-empty-img" />
          <p className="nxpf-empty-text">Nothing here yet. More coming soon.</p>
        </div>
      </PortfolioTabs>
    </section>
  );
}
