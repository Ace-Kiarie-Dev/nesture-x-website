import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Absolute so the root "%s | Nesture-X" template doesn't apply.
  title: { absolute: 'Nesture-X Admin' },
  robots: 'noindex, nofollow',
};

// Admin pages render inside the root layout (which provides fonts + CSS)
// but ClientShell detects /admin routes and strips out the site chrome
// (Navbar, Footer, ParticleCanvas, CustomCursor).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
