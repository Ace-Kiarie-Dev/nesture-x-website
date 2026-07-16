'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ParticleCanvas from '@/components/ui/ParticleCanvas';

/**
 * Detects /admin and /legal/[app]/privacy routes and renders only the
 * children — no site chrome. All other routes get the full Navbar / Footer / canvas.
 */
export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || (pathname.startsWith('/legal/') && pathname.endsWith('/privacy'))) {
    return <>{children}</>;
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
