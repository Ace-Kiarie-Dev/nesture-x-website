import type { Asset3dKey } from '@/lib/assets3d';

// NX equity partners: shown on the homepage (HomePartners) and in /portfolio's trust
// strip, both through PartnerCard.

export type Partner = {
  name: string;
  /** Full trading name where it's longer than the card name. */
  longName?: string;
  industry: string;
  art: Asset3dKey;
  blurb: string;
};

export const PARTNERS: Partner[] = [
  {
    name: 'Rar Ray Bakes',
    industry: 'Bakery · Food',
    art: 'partner-baker',
    blurb: 'Baked goods brand: identity, packaging and online presence by NX.',
  },
  {
    name: 'MR Right Imports',
    longName: 'MR Right Imports & Gym Services',
    industry: 'Imports · Fitness Equipment',
    art: 'partner-importer',
    blurb: 'Fitness equipment imports and gym services, branded and online with NX.',
  },
  {
    name: 'Joyspark Enterprises',
    industry: 'Décor · Events',
    art: 'partner-decorator',
    blurb: 'Event décor and styling, with the brand and bookings built by NX.',
  },
  {
    name: 'Vicking Ventures',
    industry: 'Tours · Travel',
    art: 'partner-guide',
    blurb: 'Tours and travel: the brand and the booking site are an NX build.',
  },
  {
    name: 'ODU Fitness',
    industry: 'Fitness · Coaching',
    art: 'partner-coach',
    blurb: 'Fitness coaching brand with its site and digital presence by NX.',
  },
];

/** Brands we've worked with (no equity): the /portfolio ticker. */
export const CLIENT_BRANDS = [
  'Zaidi Movers',
  'HSDPM',
  'Nairobi Made',
  'Jawitz General',
  'Phoneporium Kenya',
  'Osoro Law',
  'Cradle Tattoos',
  'Salix Data',
  'Shadowcope',
  'Blefice',
  'Centron Technics',
  'Aegis',
];
