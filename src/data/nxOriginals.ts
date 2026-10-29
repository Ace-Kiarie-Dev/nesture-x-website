// Canonical NX Originals data — single source of truth.
// Read by the homepage hero carousel (NxOriginalsCarousel.tsx, featured subset
// via getHomeFeaturedOriginals) and the portfolio's Digital Products tabs
// (DigitalProductsGrid.tsx, full list). Define an item once here; both
// surfaces stay in sync automatically.

export type NxOriginalCategory = 'web' | 'mobile';

export interface NxOriginal {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: NxOriginalCategory;
  status: string;
  statusDescription?: string;
  imageSrc: string;
  // Accent colour for the homepage arc carousel (the slanted tab behind each card).
  accent: string;
  // Absolute URL = external site; root-relative path = on-site landing page;
  // null = falls back to /portfolio/status/[slug]. See getProjectDestination.
  link?: string | null;
}

export const NX_ORIGINALS: NxOriginal[] = [
  {
    id: 'shinkusen',
    slug: 'shinkusen',
    title: 'SHINKUSEN',
    description: 'Faith meets culture. Christian streetwear from Nairobi.',
    category: 'web',
    status: 'In Development',
    statusDescription: 'Site coming soon',
    imageSrc: '/images/originals/Shinkusen-Card.webp',
    accent: '#e5484d',
    link: 'https://shinkusen.co.ke',
  },
  {
    id: 'kikota',
    slug: 'kikota',
    title: 'Kikota',
    description: 'Run your gym. Not your paperwork.',
    category: 'web',
    status: 'In Development',
    imageSrc: '/images/originals/Kikota-Card.webp',
    accent: '#1a6fd4',
    link: '/kikota',
  },
  {
    id: 'betledger',
    slug: 'betledger',
    title: 'BetLedger',
    description: 'Track every bet. Know where your money really goes.',
    category: 'mobile',
    status: 'Live',
    imageSrc: '/images/originals/BetLedger-Card.webp',
    accent: '#2dd4bf',
    link: '/betledger',
  },
  {
    id: 'sorapesa',
    slug: 'sorapesa',
    title: 'SoraPesa',
    description: 'Your gateway to better money decisions.',
    category: 'mobile',
    status: 'In Development',
    statusDescription: 'Coming to Play Store',
    imageSrc: '/images/originals/SoraPesa-Card.webp',
    accent: '#6366f1',
    link: '/sorapesa',
  },
  {
    id: 'hikarani',
    slug: 'hikarani',
    title: 'Hikarani',
    description: "Because you're not alone.",
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/originals/Hikarani-Card.webp',
    accent: '#8b5cf6',
    link: '/hikarani',
  },
  {
    id: 'matatu-dash',
    slug: 'matatu-dash',
    title: 'Matatu Dash',
    description: 'Dodge. Hop. Survive Nairobi.',
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/originals/MatatuDash-Card.webp',
    accent: '#facc15',
    link: '/matatu-dash',
  },
  {
    id: 'solo-standoff',
    slug: 'solo-standoff',
    title: 'Solo Standoff',
    description: 'Tap. Fire. Clear the grid.',
    category: 'mobile',
    status: 'In Development',
    statusDescription: 'Coming soon on Android',
    imageSrc: '/images/originals/SoloStandoff-Card.webp',
    accent: '#E9A23B',
    link: '/solo-standoff',
  },
  {
    id: 'no-snooze-solen',
    slug: 'no-snooze-solen',
    title: 'No Snooze Solen',
    description: "The alarm that won't let you quit",
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/originals/Solen-Card.webp',
    accent: '#f59e0b',
    link: null,
  },
  {
    id: 'tender-leo',
    slug: 'tender-leo',
    title: 'Tender Leo',
    description: 'Compliant bids. Greater chances.',
    category: 'web',
    status: 'In Development',
    imageSrc: '/images/originals/TenderLeo-Card.webp',
    accent: '#F6B21A',
    link: '/tender-leo',
  },
  {
    id: 'hsdpm-church-app',
    slug: 'hsdpm-church-app',
    title: 'HSDPM Church App',
    description: 'Sermons, devotionals, giving and prayer in one app.',
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/originals/HSDPM-Card.webp',
    accent: '#A6122F',
    link: null,
  },
];

// Homepage hero carousel shows only these, in this order.
// /portfolio still renders the full NX_ORIGINALS list.
export const HOME_FEATURED_SLUGS = ['betledger', 'shinkusen', 'sorapesa', 'kikota', 'matatu-dash'] as const;

export function getHomeFeaturedOriginals(): NxOriginal[] {
  return HOME_FEATURED_SLUGS.map(slug => {
    const item = NX_ORIGINALS.find(original => original.slug === slug);
    if (!item) throw new Error(`HOME_FEATURED_SLUGS references unknown slug "${slug}"`);
    return item;
  });
}

export function getNxOriginalsByCategory(category: NxOriginalCategory): NxOriginal[] {
  return NX_ORIGINALS.filter(item => item.category === category);
}
