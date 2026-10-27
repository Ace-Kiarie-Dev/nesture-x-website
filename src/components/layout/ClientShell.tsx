'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import SiteNav from '@/components/redesign/SiteNav';
import SiteFooter from '@/components/redesign/SiteFooter';

// Routes already moved to the hybrid redesign. They get the new SiteNav and SiteFooter
// and paint their own background, so the particle canvas and the 80px navbar offset
// are skipped. Exact paths: /nx-gaming/2048 etc. are static games outside this shell.
const REDESIGNED_ROUTES = new Set(['/', '/nx-gaming']);

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
  if (REDESIGNED_ROUTES.has(pathname.replace(/(.)\/$/, '$1'))) {
    return (
      <>
        <SiteNav />
        <div className="site-wrapper nx-grid-bg flex flex-col flex-1" style={{ paddingTop: 0 }}>
          {children}
          <SiteFooter />
        </div>
      </>
    );
  }

  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <div className="site-wrapper flex flex-col flex-1" style={{ paddingTop: '80px' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
