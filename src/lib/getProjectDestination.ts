// Single source of truth for "where does this project link to" — used by both
// the homepage hero carousel (NxOriginalsCarousel.tsx) and the portfolio's
// Digital Products cards (DigitalProductsGrid.tsx), so the two can't drift.
//
// Rule: a real link wins — an absolute URL is an external site (new tab), a
// root-relative path like '/betledger' is an on-site landing page. Otherwise
// the project has no destination yet, so it routes to its shared status page.
// No dead ends either way.

export interface ProjectDestination {
  href: string;
  isExternal: boolean;
  isStatusPage: boolean;
}

export function getProjectDestination(
  link: string | null | undefined,
  slug: string
): ProjectDestination {
  if (link) {
    return { href: link, isExternal: !link.startsWith('/'), isStatusPage: false };
  }
  return { href: `/portfolio/status/${slug}`, isExternal: false, isStatusPage: true };
}
