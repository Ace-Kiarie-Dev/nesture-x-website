// Canonical NX Originals data — single source of truth.
// Read by the homepage hero carousel (NxOriginalsCarousel.tsx) and the
// portfolio's Digital Products tabs (DigitalProductsGrid.tsx). Define an
// item once here; both surfaces stay in sync automatically.

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
    description: 'Faith × Anime Merch Store',
    category: 'web',
    status: 'In Development',
    statusDescription: 'Site coming soon',
    imageSrc: '/images/placeholder-shinkusen.svg',
    link: 'https://shinkusen.co.ke',
  },
  {
    id: 'kikota',
    slug: 'kikota',
    title: 'Kikota',
    description: 'Gym Management SaaS',
    category: 'web',
    status: 'In Development',
    imageSrc: '/images/placeholder-kikota.svg',
    link: null,
  },
  {
    id: 'betledger',
    slug: 'betledger',
    title: 'Bet Ledger',
    description: 'Honest bet tracking analytics',
    category: 'mobile',
    status: 'In Testing',
    statusDescription: 'Coming to Play Store',
    imageSrc: '/images/Bet%20Ledger%20Card.png',
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
    description: 'Nairobi top-down endless-hopper game',
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/placeholder-matatu-dash.svg',
    link: null,
  },
  {
    id: 'no-snooze-alarm',
    slug: 'no-snooze-alarm',
    title: 'No-Snooze Alarm',
    description: "The alarm that won't let you quit",
    category: 'mobile',
    status: 'In Development',
    imageSrc: '/images/placeholder-no-snooze.svg',
    link: null,
  },
];

export function getNxOriginalsByCategory(category: NxOriginalCategory): NxOriginal[] {
  return NX_ORIGINALS.filter(item => item.category === category);
}
