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
    link: null,
  },
  {
    id: 'betledger',
    slug: 'betledger',
    title: 'BetLedger',
    description: 'Track every bet. Know where your money really goes.',
    category: 'mobile',
    status: 'In Testing',
    statusDescription: 'Coming to Play Store',
    imageSrc: '/images/originals/BetLedger-Card.webp',
    link: null,
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
    link: null,
  },
  {
    id: 'hikarani',
    slug: 'hikarani',
    title: 'Hikarani',
    description: 'Faith Community App',
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/placeholder-hikarani.svg',
    link: null,
  },
  {
    id: 'matatu-dash',
    slug: 'matatu-dash',
    title: 'Matatu Dash',
    description: 'Dodge. Hop. Survive Nairobi.',
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/originals/MatatuDash-Card.webp',
    link: null,
  },
  {
    id: 'no-snooze-solen',
    slug: 'no-snooze-solen',
    title: 'No Snooze Solen',
    description: "The alarm that won't let you quit",
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/placeholder-no-snooze-solen.svg',
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
