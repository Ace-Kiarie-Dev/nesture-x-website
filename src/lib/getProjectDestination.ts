// Single source of truth for "where does this project link to" — used by both
// the homepage hero carousel (NxOriginalsCarousel.tsx) and the portfolio's
// Digital Products cards (DigitalProductsGrid.tsx), so the two can't drift.
//
// Rule: a live destination (external site, or any other real link) wins;
// otherwise the project has no live destination yet, so it routes to its
// shared status page instead. No dead ends either way.

export interface ProjectDestination {
  href: string;
  isExternal: boolean;
}

export function getProjectDestination(
  link: string | null | undefined,
  slug: string
): ProjectDestination {
  if (link) {
    return { href: link, isExternal: true };
  }
  return { href: `/portfolio/status/${slug}`, isExternal: false };
}
