// Routes that need site-level treatment beyond their own page.
//
// PRODUCT_LANDING_PATHS: pages built from components/product-landing/ProductLanding.
// They get the redesigned chrome (ClientShell), the nav marks Portfolio as current
// (SiteNav), and they are listed in the sitemap. Add a path here when a new product
// config gets its own app/<slug>/page.tsx.
export const PRODUCT_LANDING_PATHS: readonly string[] = [];

// Pages whose skin has one fixed palette. The site theme is pinned to match (so the
// nav and footer read against the page) and the theme switch is hidden. Read by the
// inline theme script in app/layout.tsx and by SiteNav.
export const FIXED_THEME_ROUTES: Readonly<Record<string, 'dark' | 'light'>> = {
  '/solo-standoff': 'dark',
};

/** The pinned theme for a path (the route itself or anything under it), or null. */
export function fixedThemeFor(pathname: string): 'dark' | 'light' | null {
  for (const [route, theme] of Object.entries(FIXED_THEME_ROUTES)) {
    if (pathname === route || pathname.startsWith(`${route}/`)) return theme;
  }
  return null;
}
