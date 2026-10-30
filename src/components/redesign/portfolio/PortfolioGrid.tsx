import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { CATEGORIES, categoryCounts, type CategoryFilter, type WorkCard } from '@/lib/portfolio-data';
import PortfolioTabs, { type TabDef } from './PortfolioTabs';
import PortfolioCard from './PortfolioCard';

const COMPASS = ASSETS_3D['misc-compass'];

type PortfolioGridProps = { cards: WorkCard[]; initialCategory: CategoryFilter };

// Card height per unit of column width, plus the gap (~14px on a ~170px column).
function cardHeight(card: WorkCard): number {
  const ratio = card.image ? card.image.width / card.image.height : card.placeholder === 'PDF document' ? 210 / 297 : 16 / 9;
  return 1 / ratio + 0.08;
}

/**
 * CSS columns fill top to bottom, so the masonry's first row is the top card of each
 * column, not the first cards in the DOM. Balanced columns break where the running
 * height crosses k/n of the total; the card at each crossing and the one after it (the
 * browser's break can land either side) start a column on screen. Returned for 2 and 3
 * columns, the phone/tablet and desktop layouts.
 */
function columnTops(cards: WorkCard[]): string[] {
  const heights = cards.map(cardHeight);
  const total = heights.reduce((a, b) => a + b, 0);
  const keys: string[] = [];
  for (const cols of [2, 3]) {
    for (let k = 1; k < cols; k++) {
      let run = 0;
      const i = heights.findIndex((h) => (run += h) >= (total * k) / cols);
      for (const j of [i, i + 1]) if (cards[j]) keys.push(cards[j].key);
    }
  }
  return keys;
}

// Server-rendered masonry of every card; PortfolioTabs (client) filters it with CSS.
// The initial view's first row loads eagerly (see columnTops), the rest lazily.
export default function PortfolioGrid({ cards, initialCategory }: PortfolioGridProps) {
  const counts = categoryCounts(cards);
  const tabs: TabDef[] = [
    { key: 'all', label: 'All', count: cards.length },
    ...CATEGORIES.filter((c) => counts[c.key] > 0).map((c) => ({ key: c.key, label: c.label, count: counts[c.key] })),
  ];
  const visible = cards.filter((c) => initialCategory === 'all' || c.category === initialCategory);
  // The first row loads eagerly: the first three cards plus the top of every other column.
  const eager = new Set([...visible.slice(0, 3).map((c) => c.key), ...columnTops(visible)]);

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
