'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import SiteNav from '@/components/redesign/SiteNav';
import SiteFooter from '@/components/redesign/SiteFooter';
import { PRODUCT_LANDING_PATHS } from '@/lib/productPages';

// Routes already moved to the hybrid redesign. They get the new SiteNav and SiteFooter
// and paint their own background, so the particle canvas and the 80px navbar offset
// are skipped. Exact paths: /nx-gaming/2048 etc. are static games outside this shell.
// The product landing pages keep their own skin in the body and clear the floating nav
// themselves (their *-under-nav wrappers).
const REDESIGNED_ROUTES = new Set([
  '/', '/nx-gaming', '/services', '/portfolio', '/about', '/contact', '/tools', '/booking', '/privacy-policy',
  '/betledger', '/sorapesa', '/kikota', '/matatu-dash', '/solo-standoff',
  ...PRODUCT_LANDING_PATHS,
]);

// Dynamic redesigned routes. Project pages are one segment under /portfolio, status
// pages are /portfolio/status/[slug]; every tool is one segment under /tools; the Solo
// Standoff legal docs are one segment under /solo-standoff. /booking has no sub-routes
// (the whole flow is client state on one page).
const REDESIGNED_PATTERNS = [
  /^\/portfolio\/(?!status$)[^/]+$/,
  /^\/portfolio\/status\/[^/]+$/,
  /^\/tools\/[^/]+$/,
  /^\/solo-standoff\/[^/]+$/,
];

function isRedesigned(path: string): boolean {
  return REDESIGNED_ROUTES.has(path) || REDESIGNED_PATTERNS.some((re) => re.test(path));
}

/**
 * Detects /admin and /legal/[app]/privacy routes and renders only the
 * children — no site chrome. Redesigned routes get the new chrome; all other
 * routes get the full Navbar / Footer / canvas.
 */
export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || (pathname.startsWith('/legal/') && pathname.endsWith('/privacy'))) {
    return <>{children}</>;
  }

  // Trailing slash dropped, but "/" itself stays "/".
  if (isRedesigned(pathname.replace(/(.)\/$/, '$1'))) {
    // .nx-shell-chrome is display: contents; an unknown /portfolio/<id> renders the 404
    // page, which brings its own SiteNav / SiteFooter, so these step aside (hybrid.css).
    return (
      <>
        <div className="nx-shell-chrome">
          <SiteNav />
        </div>
        <div className="site-wrapper nx-grid-bg flex flex-col flex-1" style={{ paddingTop: 0 }}>
          {children}
          <div className="nx-shell-chrome">
            <SiteFooter />
          </div>
        </div>
      </>
    );
  }

  // .nx-legacy-chrome is display: contents (no layout effect); the 404 page hides it,
  // since it renders the redesigned chrome itself (see hybrid.css).
  return (
    <>
      <div className="nx-legacy-chrome">
        <ParticleCanvas />
        <Navbar />
      </div>
      <div className="site-wrapper flex flex-col flex-1" style={{ paddingTop: '80px' }}>
        {children}
      </div>
      <div className="nx-legacy-chrome">
        <Footer />
      </div>
    </>
  );
}
