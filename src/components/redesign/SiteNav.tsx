'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import SiteThemeSwitch from '@/components/layout/SiteThemeSwitch';
import { PRODUCT_LANDING_PATHS, fixedThemeFor } from '@/lib/productPages';
import ClayButton from './ClayButton';
import { cx } from './cx';

// Redesigned site navigation: a floating glass pill. Opt-in per route through
// ClientShell's REDESIGNED_ROUTES until the whole site moves over.
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Product pages with one fixed palette pin the site theme to match it and hide the
  // switch (productPages.ts). Solo Standoff is always dark, Hikarani always light.
  const fixedTheme = fixedThemeFor(pathname);
  useEffect(() => {
    if (!fixedTheme) return;
    document.documentElement.setAttribute('data-theme', fixedTheme);
    return () => {
      document.documentElement.setAttribute('data-theme', localStorage.getItem('nx-theme') || 'dark');
    };
  }, [fixedTheme]);

  // The drawer is a modal <dialog>: the page behind is inert and Esc closes it.
  // Focus goes back to the menu button explicitly, since Safari doesn't focus a
  // button on click and the dialog would have nothing to restore.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open && wasOpen.current) burgerRef.current?.focus();
    wasOpen.current = open;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // A modal dialog still lets Tab reach the browser's own UI; keep it cycling inside.
  const trapTab = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Template product pages sit under Portfolio in the nav, though their URLs don't.
  const section = PRODUCT_LANDING_PATHS.includes(pathname) ? '/portfolio' : pathname;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : section.startsWith(href));

  return (
    <>
      <header className="nx-nav-wrap">
        <nav className="nx-nav nx-glass" aria-label="Main">
          <Link href="/" className="nx-logo" aria-label="Nesture-X home">
            NESTURE<span>-X</span>
          </Link>

          <ul className="nx-nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cx('nx-nav-link', isActive(link.href) && 'is-active')}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nx-nav-end">
            {!fixedTheme && (
              <>
                <span className="nx-nav-switch nx-nav-switch--wide">
                  <SiteThemeSwitch width={92} />
                </span>
                <span className="nx-nav-switch nx-nav-switch--compact">
                  <SiteThemeSwitch width={72} />
                </span>
              </>
            )}
            <ClayButton href="/booking" className="nx-clay-btn--sm nx-nav-cta">
              Book a consultation
            </ClayButton>
            <button
              ref={burgerRef}
              type="button"
              className="nx-nav-burger nx-inset"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <dialog
        ref={dialogRef}
        className="nx-drawer"
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onKeyDown={trapTab}
        onClick={(e) => {
          // A click on the backdrop lands on the <dialog> itself.
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="nx-drawer-panel nx-clay">
          <div className="nx-drawer-head">
            <span className="nx-logo" aria-hidden="true">
              NESTURE<span>-X</span>
            </span>
            <button type="button" className="nx-nav-burger nx-inset" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <ul className="nx-drawer-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cx('nx-drawer-link', isActive(link.href) && 'is-active')}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ClayButton href="/booking" className="nx-drawer-cta" onClick={() => setOpen(false)}>
            Book a consultation
          </ClayButton>
        </div>
      </dialog>
    </>
  );
}
