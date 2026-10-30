import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { NX_ORIGINALS } from '@/data/nxOriginals';
import { NX_GAMES, isLive } from '@/lib/nx-gaming/games';
import { getProjectDestination } from '@/lib/getProjectDestination';
import './product-page-nav.css';

// "Way back" navigation for the dedicated product pages: a back pill under the floating
// nav and a "More from Nesture-X" row before the footer. Everything comes from
// NX_ORIGINALS and the NX Gaming list, so a new product page only passes its slug.
//
// Both parts sit inside the page's own skin wrapper and take their colours from it
// (product-page-nav.css maps each skin's variables), so they match every brand in
// either site theme.

type Section = 'mobile' | 'web' | 'games';

const GAME_SLUGS = new Set(NX_GAMES.map((game) => game.slug));
const MAX_MORE = 4;

const SECTION_COPY: Record<Section, { back: string; more: string; seeAll: string }> = {
  mobile: { back: 'Mobile apps', more: 'More mobile apps', seeAll: 'See all mobile apps' },
  web:    { back: 'Web apps',    more: 'More web apps',    seeAll: 'See all web apps' },
  games:  { back: 'Games',       more: 'More games',       seeAll: 'See the games hub' },
};

interface MoreItem {
  key: string;
  name: string;
  status: string;
  href: string;
  external: boolean;
  image: { src: string; contain?: boolean; background?: string };
}

/** Games belong to the NX Gaming hub; every other project to its portfolio category. */
function sectionFor(slug: string): Section {
  if (GAME_SLUGS.has(slug)) return 'games';
  const original = NX_ORIGINALS.find((item) => item.slug === slug);
  if (!original) throw new Error(`ProductPageNav: unknown product slug "${slug}"`);
  return original.category;
}

/** The list the pill and "See all" link go to. Portfolio lists open at the project's card. */
function listHref(section: Section, slug: string): string {
  return section === 'games' ? '/nx-gaming' : `/portfolio?view=digital&type=${section}#${slug}`;
}

function moreItems(section: Section, slug: string): MoreItem[] {
  if (section === 'games') {
    return NX_GAMES.filter((game) => game.slug !== slug)
      .slice(0, MAX_MORE)
      .map((game) => {
        // Use the portfolio card when the game has one; otherwise its hub art, whole.
        const card = NX_ORIGINALS.find((item) => item.slug === game.slug);
        return {
          key: game.slug,
          name: game.name,
          status: isLive(game) ? 'Live' : 'Coming soon',
          href: isLive(game) ? game.href : game.pageHref,
          external: false,
          image: card ? { src: card.imageSrc } : { src: game.hero.src, contain: true, background: game.bg },
        };
      });
  }
  return NX_ORIGINALS.filter((item) => item.category === section && !GAME_SLUGS.has(item.slug) && item.slug !== slug)
    .slice(0, MAX_MORE)
    .map((item) => {
      const destination = getProjectDestination(item.link, item.slug);
      return {
        key: item.slug,
        name: item.title,
        status: item.status,
        href: destination.href,
        external: destination.isExternal,
        image: { src: item.imageSrc },
      };
    });
}

/** Back pill, directly under the floating nav. */
export function ProductBackPill({ slug }: { slug: string }) {
  const section = sectionFor(slug);
  return (
    <nav className="ppn-back" aria-label="Back">
      <div className="ppn-container">
        <Link href={listHref(section, slug)} className="ppn-pill">
          <ArrowLeft size={16} aria-hidden="true" />
          <span className="nx-sr-only">Back to </span>
          {SECTION_COPY[section].back}
        </Link>
      </div>
    </nav>
  );
}

/** "More from Nesture-X" row, the page's last block before the footer. */
export function ProductMoreRow({ slug }: { slug: string }) {
  const section = sectionFor(slug);
  const items = moreItems(section, slug);
  const copy = SECTION_COPY[section];
  if (items.length === 0) return null;

  return (
    <aside className="ppn-more" aria-labelledby="ppn-more-title">
      <div className="ppn-container">
        <p className="ppn-eyebrow">More from Nesture-X</p>
        <h2 id="ppn-more-title" className="ppn-title">{copy.more}</h2>
        <ul className="ppn-row" role="list">
          {items.map((item) => (
            <li key={item.key} className="ppn-item">
              <Link
                href={item.href}
                className="ppn-card"
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span
                  className={item.image.contain ? 'ppn-media ppn-media--contain' : 'ppn-media'}
                  style={item.image.background ? { background: item.image.background } : undefined}
                >
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1200px) 270px, (min-width: 768px) 23vw, 78vw"
                  />
                </span>
                <span className="ppn-card-body">
                  <span className="ppn-name">
                    {item.name}
                    {item.external && (
                      <>
                        <ArrowUpRight size={16} aria-hidden="true" />
                        <span className="nx-sr-only"> (opens in a new tab)</span>
                      </>
                    )}
                  </span>
                  <span className="ppn-status">{item.status}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={listHref(section, slug)} className="ppn-see-all">
          {copy.seeAll}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
