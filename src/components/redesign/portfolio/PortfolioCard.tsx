import Image from 'next/image';
import Link from 'next/link';
import type { WorkCard } from '@/lib/portfolio-data';

// Grid slot widths: 1 column below 380px, 2 up to 1023px, 3 from 1024px (max 400px).
const GRID_SIZES = '(min-width: 1320px) 400px, (min-width: 1024px) 31vw, (min-width: 380px) 47vw, 92vw';

type PortfolioCardProps = {
  card: WorkCard;
  eager?: boolean;
  /** Override for rows where the card is narrower than a grid column (More like this). */
  sizes?: string;
};

// Image-only card: the whole card is one link. A glass pill names the original type; the
// title and a "View" button rise from the bottom on hover / focus (always on, as a slim
// bar, on touch screens). Every box carries its real aspect ratio, so nothing shifts.
export default function PortfolioCard({ card, eager = false, sizes = GRID_SIZES }: PortfolioCardProps) {
  const { image } = card;
  const ratio = image ? `${image.width} / ${image.height}` : card.placeholder === 'PDF document' ? '210 / 297' : '16 / 9';
  const label = `${card.title}, ${card.pill}${card.comingSoon ? ', coming soon' : ''}${card.external ? ' (opens in a new tab)' : ''}`;
  const action = card.comingSoon ? 'Coming soon' : card.external ? 'Visit ↗' : 'View →';

  const body = (
    <>
      <span className="nxpf-card-media" style={{ aspectRatio: ratio }}>
        {image ? (
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes={sizes}
            loading={eager ? 'eager' : 'lazy'}
            unoptimized={image.unoptimized}
            className="nxpf-card-img"
          />
        ) : (
          <span className="nxpf-card-ph">
            <span className="nxpf-card-ph-mark" aria-hidden="true">
              NX
            </span>
            <span className="nxpf-card-ph-text">{card.placeholder ?? card.pill}</span>
          </span>
        )}
      </span>
      <span className="nxpf-card-pill">{card.pill}</span>
      {card.badge && (
        <span className={card.badge === 'Live' ? 'nxpf-card-badge is-live' : card.comingSoon ? 'nxpf-card-badge is-soon' : 'nxpf-card-badge'}>
          {card.badge}
        </span>
      )}
      <span className="nxpf-card-overlay" aria-hidden="true">
        <span className="nxpf-card-title">{card.title}</span>
        <span className={card.comingSoon ? 'nx-clay-btn nx-clay-btn-ghost nx-clay-btn--sm nxpf-card-view' : 'nx-clay-btn nx-clay-btn--sm nxpf-card-view'}>
          {action}
        </span>
      </span>
    </>
  );

  return card.external ? (
    <a href={card.href} className="nxpf-card" aria-label={label} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <Link href={card.href} className="nxpf-card" aria-label={label}>
      {body}
    </Link>
  );
}
