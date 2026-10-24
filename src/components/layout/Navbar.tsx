'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import NxButton from '@/components/ui/NxButton';
import SiteThemeSwitch from '@/components/layout/SiteThemeSwitch';

// Light-mode tokens have landed (see globals.css semantic text tokens) —
// the toggle is back on.
const THEME_TOGGLE_VISIBLE = true;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Product pages that wear their own dark skin: always dark, no toggle.
  // The stored preference is left alone and restored on the way out.
  const forceDark = pathname.startsWith('/solo-standoff');
  useEffect(() => {
    if (!forceDark) return;
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      document.documentElement.setAttribute('data-theme', localStorage.getItem('nx-theme') || 'dark');
    };
  }, [forceDark]);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    if (href.startsWith('#')) return false;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 50,
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          overflow: 'visible',
          transition: 'all 300ms ease',
          background: scrolled ? 'var(--color-nav-scrolled)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(26, 111, 212, 0.3)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 0 30px rgba(26, 111, 212, 0.1)' : 'none',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: 0 }}>
          {/* TODO: replace with proper dark logo asset — logo-black.png was
              already sitting in /public/images (unused) as the exact light-
              theme counterpart to logo-white.png (same mark, dark wordmark),
              so it's wired in here rather than a text-wordmark fallback.
              Confirm with design that it's the intended light-theme lockup. */}
          {/* Both lockups are rendered; CSS on <html data-theme> shows one, so the
              first paint is right before any script runs. */}
          <Image
            src="/images/logo-white.png"
            alt="Nesture-X"
            width={220}
            height={60}
            className="nx-only-dark"
            style={{ width: '220px', height: '60px', objectFit: 'contain' }}
            preload
          />
          <Image
            src="/images/logo-black.png"
            alt="Nesture-X"
            width={220}
            height={60}
            className="nx-only-light"
            style={{ width: '220px', height: '60px', objectFit: 'contain' }}
            preload
          />
        </Link>

        {/* Desktop right side. It needs about 1290px (logo box, 7 links, theme switch,
            CTA), so below 1320px the hamburger menu takes over. */}
        <div
          className="hidden min-[1320px]:flex"
          style={{ alignItems: 'center', gap: '1.5rem' }}
        >
          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-hover
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: active ? 'var(--color-primary)' : 'var(--color-text)',
                    textDecoration: 'none',
                    transition: 'color 300ms ease',
                  }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
                  }}
                >
                  {/* Bullet — always rendered, hidden when inactive to preserve spacing */}
                  <span
                    style={{
                      color: 'var(--color-primary)',
                      fontSize: '0.6rem',
                      lineHeight: 1,
                      visibility: active ? 'visible' : 'hidden',
                    }}
                  >
                    ■
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Theme switch — hidden via THEME_TOGGLE_VISIBLE above, and on always-dark pages */}
          {THEME_TOGGLE_VISIBLE && !forceDark && <SiteThemeSwitch width={92} />}

          {/* CTA */}
          <NxButton variant="primary" size="sm" href="/booking">
            Book a Consultation
          </NxButton>
        </div>

        {/* Narrow screens: hamburger only */}
        <div className="flex min-[1320px]:hidden" style={{ alignItems: 'center' }}>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            data-hover
            style={{
              width: '40px',
              height: '40px',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* ── Mobile Overlay ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.5rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          data-hover
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '44px',
            height: '44px',
            border: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Theme switch, top-left, opposite the close button (clear of the links and CTA) */}
        {THEME_TOGGLE_VISIBLE && !forceDark && (
          <div style={{ position: 'absolute', top: '26px', left: '24px' }}>
            <SiteThemeSwitch width={104} />
          </div>
        )}

        {/* Mobile links */}
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              data-hover
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: '2.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: active ? 'var(--color-primary)' : 'var(--color-text)',
                textDecoration: 'none',
                transition: 'color 300ms ease',
              }}
            >
              <span
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '0.9rem',
                  lineHeight: 1,
                  visibility: active ? 'visible' : 'hidden',
                }}
              >
                ■
              </span>
              {link.label}
            </Link>
          );
        })}

        {/* Mobile CTA */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            width: '80%',
            maxWidth: '320px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <NxButton
            variant="primary"
            size="sm"
            href="/booking"
            onClick={() => setMenuOpen(false)}
            className="w-full"
          >
            Book a Consultation
          </NxButton>
        </div>
      </div>
    </>
  );
}
