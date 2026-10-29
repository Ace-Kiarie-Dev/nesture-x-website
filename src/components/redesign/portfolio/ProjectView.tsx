import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PortfolioItem } from '@/types/portfolio';
import PDFViewerLazy from '@/app/portfolio/[id]/PDFViewerLazy';
import { portfolioTitle } from '@/lib/portfolioSeo';
import {
  categoryLabel,
  categoryOf,
  displayClient,
  fileUrl,
  thumbFor,
  type WorkCard,
  type WorkImage,
} from '@/lib/portfolio-data';
import { Chip, ClayButton, GlassPanel } from '@/components/redesign';
import MoreLikeThis from './MoreLikeThis';
import ProjectPager, { type PagerItem } from './ProjectPager';

type ProjectViewProps = {
  item: PortfolioItem;
  more: WorkCard[];
  /** Neighbours within the category, in grid order. */
  prev: PagerItem;
  next: PagerItem;
  position: number;
  total: number;
};

// Desktop media column is ~860px wide; tall pieces are capped at ~85vh, so they render
// narrower. The sizes hint follows that, so a portrait flyer isn't fetched at 860px.
function detailSizes(img: WorkImage): string {
  const desktop = Math.min(860, Math.round(0.85 * 900 * (img.width / img.height)));
  return `(min-width: 1100px) ${desktop}px, calc(100vw - 40px)`;
}

function Media({ item, title }: { item: PortfolioItem; title: string }) {
  if (item.isPDF) {
    // The cover's aspect ratio caps the viewer width so one whole page and the control
    // bar fit the screen (portrait profiles narrow, landscape decks wide). A4 if no cover.
    const cover = thumbFor(item);
    const ratio = cover ? cover.width / cover.height : 210 / 297;
    return (
      <div className="nxpf-pdf-fit" style={{ '--nxpf-pdf-ratio': ratio } as CSSProperties}>
        <PDFViewerLazy src={fileUrl(item)} title={title} />
      </div>
    );
  }
  const img = thumbFor(item);
  if (!img) return null;
  const image = (
    <Image
      src={img.src}
      alt={title}
      width={img.width}
      height={img.height}
      sizes={detailSizes(img)}
      loading="eager"
      fetchPriority="high"
      unoptimized={img.unoptimized}
      className="nxpf-view-img"
    />
  );
  // Web screenshots sit in a browser frame. The data has no live URL for them, so no
  // "Visit site" link (digital products with URLs link out from the grid instead).
  if (item.type === 'Web') {
    return (
      <div className="nxpf-browser-frame">
        <div className="nxpf-browser-bar" aria-hidden="true">
          <span className="nxpf-browser-dots">
            <span />
            <span />
            <span />
          </span>
          <span className="nxpf-browser-url">{displayClient(item.client)}</span>
        </div>
        {image}
      </div>
    );
  }
  return <div className="nxpf-view-frame nx-clay">{image}</div>;
}

export default function ProjectView({ item, more, prev, next, position, total }: ProjectViewProps) {
  const title = portfolioTitle(item);
  const category = categoryOf(item);

  return (
    <>
      <nav className="nxpf-crumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <Link href="/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link href="/portfolio?view=design">Design work</Link>
          </li>
          {category && (
            <li>
              <Link href={`/portfolio?view=design&category=${category}`}>{categoryLabel(category)}</Link>
            </li>
          )}
          <li aria-current="page">{title}</li>
        </ol>
      </nav>

      <div className="nxpf-view">
        <div className="nxpf-view-media">
          <Media item={item} title={title} />
          <ProjectPager prev={prev} next={next} position={position} total={total} />
        </div>

        <aside className="nxpf-view-side">
          <GlassPanel className="nxpf-view-panel">
            <Chip variant="blue" className="nxpf-view-pill">
              {item.type}
            </Chip>
            <h1 className="nxpf-view-title">{title}</h1>
            {item.description && <p className="nx-body nxpf-view-desc">{item.description}</p>}
            {item.tags.length > 0 && (
              <ul className="nxpf-view-tags" aria-label="Tags">
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Chip>{tag}</Chip>
                  </li>
                ))}
              </ul>
            )}
            {item.client !== 'Various Clients' && (
              <p className="nxpf-view-client">
                <span>Client</span> {displayClient(item.client)}
              </p>
            )}
            <div className="nxpf-view-ctas">
              <ClayButton href="/booking">Start a project like this</ClayButton>
              <ClayButton href="/portfolio?view=design" variant="ghost">
                Back to all work
              </ClayButton>
            </div>
          </GlassPanel>
        </aside>
      </div>

      <MoreLikeThis cards={more} />
    </>
  );
}
