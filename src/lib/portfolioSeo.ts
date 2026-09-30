import portfolioData from '@/data/portfolio.json';
import type { PortfolioItem } from '@/components/sections/Portfolio';

// SEO titles and descriptions for /portfolio/[id].
//
// Title:       "{Client} {Type label}" — plus ": {variant}" when the client has
//              several items of the same type. The root template adds " | Nesture-X".
// Description: the item's own description, then the first credit line that
//              keeps the total within 120–155 characters.
//
// "Various Clients" items can't be told apart from the data, so they're
// numbered, and they're noindexed (see isIndexablePortfolioItem).

const items = portfolioData as PortfolioItem[];

const TYPE_LABEL: Record<string, string> = {
  'Logo': 'Logo Design',
  'Social Media': 'Social Media Design',
  'Company Profile': 'Company Profile',
  'Flyer': 'Flyer Design',
  'Business Cards': 'Business Card Design',
  'Mockup': 'Brand Mockup',
  'Infographic': 'Infographic Design',
  'Print': 'Branded Merchandise',
  'Web': 'Website Design',
  'PowerPoint': 'Presentation Template',
  'One-Pager': 'One-Pager Design',
  'White Paper': 'White Paper Design',
  'Menu': 'Menu Design',
  'Proposal': 'Proposal Design',
  'Quotation': 'Quotation Template',
  'Rate Card': 'Rate Card Design',
};

const TYPE_NOUN: Record<string, string> = {
  'Logo': 'logo design',
  'Social Media': 'social media design',
  'Company Profile': 'company profile design',
  'Flyer': 'flyer design',
  'Business Cards': 'business card design',
  'Mockup': 'brand mockup',
  'Infographic': 'infographic design',
  'Print': 'branded merchandise project',
  'Web': 'website design',
  'PowerPoint': 'presentation template',
  'One-Pager': 'one-pager design',
  'White Paper': 'white paper design',
  'Menu': 'menu design',
  'Proposal': 'proposal design',
  'Quotation': 'quotation template',
  'Rate Card': 'rate card design',
};

const ANONYMOUS_CLIENT = 'Various Clients';

const groupKey = (i: PortfolioItem) => `${i.client}|${i.type}`;
const groups = new Map<string, PortfolioItem[]>();
for (const item of items) {
  const key = groupKey(item);
  groups.set(key, [...(groups.get(key) ?? []), item]);
}

/** "Various Clients" work is thin and anonymous: kept on the site, but noindexed. */
export function isIndexablePortfolioItem(item: PortfolioItem): boolean {
  return item.client !== ANONYMOUS_CLIENT;
}

// Position within the anonymous group, in data order (1-based).
function anonymousNumber(item: PortfolioItem) {
  const group = groups.get(groupKey(item)) ?? [item];
  return { n: group.indexOf(item) + 1, total: group.length };
}

export function portfolioTitle(item: PortfolioItem): string {
  const label = TYPE_LABEL[item.type] ?? item.type;
  if (item.client === ANONYMOUS_CLIENT) return `${label} ${anonymousNumber(item).n}: Client Work`;
  return item.variant ? `${item.client} ${label}: ${item.variant}` : `${item.client} ${label}`;
}

const an = (word: string) => (/^[aeiou]/i.test(word) ? 'An' : 'A');

// Nesture-X's own brand work is credited as in-house.
const IN_HOUSE_CREDITS = [
  'Part of the Nesture-X brand identity, designed in-house by our creative technology team in Nairobi, Kenya.',
  "Part of Nesture-X's own brand identity, designed in-house in Nairobi, Kenya.",
  'Designed in-house by Nesture-X in Nairobi, Kenya.',
  'In-house work by Nesture-X, Nairobi.',
];

// Longest first. The first four name the client; they're the only ones allowed
// when the item's own description doesn't mention the client.
function clientCredits(item: PortfolioItem, mustNameClient: boolean): string[] {
  const noun = TYPE_NOUN[item.type] ?? item.type.toLowerCase();
  const credits = [
    `${an(noun)} ${noun} for ${item.client}, created by Nesture-X, a creative technology agency based in Nairobi, Kenya.`,
    `${an(noun)} ${noun} for ${item.client} by Nesture-X, a creative technology agency in Nairobi, Kenya.`,
    `${an(noun)} ${noun} for ${item.client}, created by Nesture-X in Nairobi, Kenya.`,
    `${an(noun)} ${noun} by Nesture-X, a creative technology agency in Nairobi, Kenya.`,
    'Designed by Nesture-X, a creative technology agency in Nairobi, Kenya.',
    'Designed by Nesture-X, a creative agency in Nairobi, Kenya.',
    'Designed by Nesture-X in Nairobi, Kenya.',
    'By Nesture-X, Nairobi.',
  ];
  return mustNameClient ? credits.filter(c => c.includes(item.client)) : credits;
}

export function portfolioDescription(item: PortfolioItem): string {
  let lead: string;
  let credits: string[];

  if (item.client === ANONYMOUS_CLIENT) {
    const { n, total } = anonymousNumber(item);
    lead = item.type === 'Social Media'
      ? `Social media design ${n} of ${total}: branded post artwork created for a client's social media feed.`
      : `Website design project ${n} of ${total}: a full-page website layout designed and built for a client.`;
    credits = clientCredits(item, false).slice(4);
  } else {
    lead = item.description.trim().replace(/\.?$/, '.');
    credits = item.client === 'Nesture-X'
      ? IN_HOUSE_CREDITS
      : clientCredits(item, !lead.toLowerCase().includes(item.client.toLowerCase()));
  }

  for (const credit of credits) {
    const full = `${lead} ${credit}`;
    if (full.length >= 120 && full.length <= 155) return full;
  }
  // Every current item fits a credit line (checked in the SEO audit); this only
  // guards future data from producing an over-long description.
  const fallback = `${lead} ${credits[credits.length - 1]}`;
  return fallback.length <= 155 ? fallback : lead;
}
