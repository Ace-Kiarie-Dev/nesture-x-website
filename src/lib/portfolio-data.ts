import portfolioData from '@/data/portfolio.json';
import media from '@/data/portfolio-media.json';
import type { PortfolioItem } from '@/components/sections/Portfolio';
import { NX_ORIGINALS } from '@/data/nxOriginals';
import { DEV_PROJECTS } from '@/data/devProjects';
import { getProjectDestination } from '@/lib/getProjectDestination';
import { slugify } from '@/lib/slugify';
import { portfolioTitle } from '@/lib/portfolioSeo';

// View model for the redesigned /portfolio and /portfolio/[id]. Design work comes from
// portfolio.json; digital products (NX Originals + client sites) fold into Web Projects
// and link straight to their site, landing page or status page. Pixel sizes come from
// portfolio-media.json (npm run portfolio:media), so every image box is reserved up front.

export type CategoryKey =
  | 'logos'
  | 'business-cards'
  | 'company-profiles'
  | 'one-pagers'
  | 'social-media'
  | 'flyers-posters'
  | 'mockups'
  | 'web';

export type CategoryFilter = CategoryKey | 'all';

export const CATEGORIES: { key: CategoryKey; label: string; types: string[] }[] = [
  { key: 'logos', label: 'Logos', types: ['Logo'] },
  { key: 'business-cards', label: 'Business Cards', types: ['Business Cards'] },
  {
    key: 'company-profiles',
    label: 'Company Profiles',
    types: ['Company Profile', 'Proposal', 'White Paper', 'PowerPoint', 'Rate Card', 'Quotation'],
  },
  { key: 'one-pagers', label: 'One Pagers', types: ['One-Pager', 'Infographic'] },
  { key: 'social-media', label: 'Social Media', types: ['Social Media'] },
  { key: 'flyers-posters', label: 'Flyers & Posters', types: ['Flyer', 'Print', 'Menu'] },
  { key: 'mockups', label: 'Mockups', types: ['Mockup'] },
  { key: 'web', label: 'Web Projects', types: ['Web'] },
];

const CATEGORY_BY_TYPE = new Map(CATEGORIES.flatMap((c) => c.types.map((t) => [t, c.key] as const)));

export type WorkImage = { src: string; width: number; height: number; unoptimized?: boolean };

/** One grid card: a design piece or a digital product. Plain data, so it can cross to the client. */
export type WorkCard = {
  key: string;
  title: string;
  /** The original type ("Logo", "Flyer", "Web App"), shown as the card pill. */
  pill: string;
  category: CategoryKey;
  href: string;
  external: boolean;
  image: WorkImage | null;
  /** What the placeholder tile says when there is no image. */
  placeholder?: string;
};

export const DESIGN_ITEMS = portfolioData as PortfolioItem[];

const SIZES: Record<string, number[]> = media;

function sized(src: string | null | undefined): WorkImage | null {
  if (!src) return null;
  const size = SIZES[src];
  if (!size) return null;
  // Animated GIFs skip the optimiser so they keep moving.
  return { src, width: size[0], height: size[1], ...(src.endsWith('.gif') ? { unoptimized: true } : {}) };
}

export function categoryOf(item: PortfolioItem): CategoryKey | undefined {
  return CATEGORY_BY_TYPE.get(item.type);
}

export function categoryLabel(key: CategoryKey): string {
  return CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

/** The image a card shows: the file itself, or a PDF's cover. */
export function thumbFor(item: PortfolioItem): WorkImage | null {
  return sized(`/images/portfolio/${item.isPDF ? item.coverImage ?? '' : item.filename}`);
}

export function fileUrl(item: PortfolioItem): string {
  return `/images/portfolio/${item.filename}`;
}

export function displayClient(client: string): string {
  return client === 'Various Clients' ? 'Nesture-X client work' : client;
}

function designCard(item: PortfolioItem): WorkCard | null {
  const category = categoryOf(item);
  if (!category) return null;
  return {
    key: item.id,
    title: portfolioTitle(item),
    pill: item.type,
    category,
    href: `/portfolio/${item.id}`,
    external: false,
    image: thumbFor(item),
    ...(item.isPDF ? { placeholder: 'PDF document' } : {}),
  };
}

function digitalCards(): WorkCard[] {
  const originals = NX_ORIGINALS.map((o): WorkCard => {
    const dest = getProjectDestination(o.link, o.slug);
    return {
      key: `original-${o.id}`,
      title: o.title,
      pill: o.category === 'mobile' ? 'Mobile App' : 'Web App',
      category: 'web',
      href: dest.href,
      external: dest.isExternal,
      image: sized(o.imageSrc),
    };
  });
  const sites = DEV_PROJECTS.map((p): WorkCard => {
    const dest = getProjectDestination(p.url, slugify(p.name));
    return {
      key: `site-${slugify(p.name)}`,
      title: p.name,
      pill: 'Website',
      category: 'web',
      href: dest.href,
      external: dest.isExternal,
      image: sized(p.image),
      ...(p.comingSoon ? { placeholder: 'Coming soon' } : {}),
    };
  });
  return [...originals, ...sites];
}

export const WORK_CARDS: WorkCard[] = [
  ...DESIGN_ITEMS.map(designCard).filter((c): c is WorkCard => c !== null),
  ...digitalCards(),
];

/** Item counts per category, for hiding empty tabs. */
export function categoryCounts(cards: WorkCard[] = WORK_CARDS): Record<CategoryKey, number> {
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.key, 0])) as Record<CategoryKey, number>;
  for (const card of cards) counts[card.category] += 1;
  return counts;
}

export function parseCategory(raw: string | string[] | undefined | null): CategoryFilter {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return CATEGORIES.some((c) => c.key === value) ? (value as CategoryKey) : 'all';
}
