import Image from 'next/image';
import Link from 'next/link';
import portfolioData from '@/data/portfolio.json';
import type { PortfolioItem } from '@/types/portfolio';
import { Band, ClayButton, SectionHeading } from '@/components/redesign';

// Same selection as the old homepage (Portfolio featuredOnly): the first eight featured items.
const ITEMS = (portfolioData as PortfolioItem[]).filter((i) => i.featured).slice(0, 8);

// Same thumbnail rule as Portfolio.tsx: PDFs show their cover image, if they have one.
function thumbnail(item: PortfolioItem): string | null {
  if (item.isPDF) return item.coverImage ? `/images/portfolio/${item.coverImage}` : null;
  return `/images/portfolio/${item.filename}`;
}

// Same aspect ratios as Portfolio.tsx, so the masonry keeps each piece's shape.
function aspectRatio(type: string): string {
  switch (type) {
    case 'Logo':
      return '1 / 1';
    case 'Web':
      return '16 / 9';
    case 'Company Profile':
    case 'One-Pager':
    case 'White Paper':
    case 'PowerPoint':
    case 'Proposal':
      return '3 / 4';
    case 'Business Cards':
      return '9 / 5';
    default:
      return '4 / 3';
  }
}

export default function HomePortfolio() {
  // Items without an image are left out rather than shown as a placeholder.
  const tiles = ITEMS.flatMap((item) => {
    const src = thumbnail(item);
    return src ? [{ item, src }] : [];
  });

  return (
    <Band variant="slate" id="portfolio" aria-labelledby="nxhp-portfolio-title">
      <SectionHeading
        id="nxhp-portfolio-title"
        eyebrow="Selected Work"
        title="OUR PORTFOLIO"
        outline="PORTFOLIO"
        className="nxhp-reveal"
      />

      <ul className="nxhp-port-grid">
        {tiles.map(({ item, src }) => (
          <li key={item.id} className="nxhp-port-cell">
            <Link href={`/portfolio/${item.id}`} className="nxhp-port-tile" aria-label={`${item.client} — ${item.type}`}>
              <span className="nxhp-port-media" style={{ aspectRatio: aspectRatio(item.type) }}>
                <Image
                  src={src}
                  alt={`${item.client} — ${item.type}`}
                  fill
                  unoptimized={src.endsWith('.gif')}
                  sizes="(min-width: 1200px) 300px, (min-width: 768px) 30vw, 50vw"
                  className="nxhp-port-img"
                />
              </span>
              <span className="nxhp-port-pill" aria-hidden="true">
                {item.type}
              </span>
              <span className="nxhp-port-overlay" aria-hidden="true">
                <span className="nxhp-port-client">{item.client}</span>
                <span className="nxhp-port-view">View →</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="nxhp-center">
        <ClayButton href="/portfolio">VIEW ALL WORK</ClayButton>
      </div>
    </Band>
  );
}
