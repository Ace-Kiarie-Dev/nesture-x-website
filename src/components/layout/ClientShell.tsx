'use client';

import { usePathname } from 'next/navigation';
import SiteNav from '@/components/redesign/SiteNav';
import SiteFooter from '@/components/redesign/SiteFooter';

/**
 * Site chrome for every route: the redesigned SiteNav and SiteFooter. Pages paint
 * their own background (no navbar offset); product landing pages keep their own
 * skin in the body and clear the floating nav themselves (their *-under-nav wrappers).
 *
 * Two kinds of route render only their children, no site chrome:
 *  - /admin, which has its own shell;
 *  - /legal/[app]/privacy, the policies opened inside the apps.
 * The /nx-gaming/2048 and /nx-gaming/flappy-horror games are route handlers that
 * serve their own HTML, so they never reach this shell.
 */
export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || (pathname.startsWith('/legal/') && pathname.endsWith('/privacy'))) {
    return <>{children}</>;
  }

  // .nx-shell-chrome is display: contents; the 404 page brings its own SiteNav and
  // SiteFooter, so these step aside there (hybrid.css).
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
