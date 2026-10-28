'use client';

import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { Chip } from '@/components/redesign';

export type TabDef = { key: string; label: string; count: number };

type PortfolioTabsProps = {
  /** "All" first, then categories with at least one item. */
  tabs: TabDef[];
  /** Every real category key (an empty one can still be deep-linked). */
  categoryKeys: string[];
  emptyKeys: string[];
  /** The server-rendered grid and empty state. */
  children: ReactNode;
};

const ALL = 'all';

// The filter state lives in the URL (?category=logos): shareable, and back / forward
// work, because Next syncs history.pushState with useSearchParams. Filtering itself is
// CSS: the wrapper's data-cat hides cards of other categories (portfolio.css), so the
// cards stay server-rendered and hidden lazy images never download.
export default function PortfolioTabs({ tabs, categoryKeys, emptyKeys, children }: PortfolioTabsProps) {
  const params = useSearchParams();
  const raw = params.get('category');
  const active = raw && categoryKeys.includes(raw) ? raw : ALL;

  const rowRef = useRef<HTMLUListElement>(null);
  const browserRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  function select(e: MouseEvent<HTMLAnchorElement>, key: string) {
    // Modified clicks open the real link in a new tab.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (key === active) return;
    const url = new URL(window.location.href);
    if (key === ALL) url.searchParams.delete('category');
    else url.searchParams.set('category', key);
    window.history.pushState(null, '', url.pathname + url.search);
  }

  // On every change after the first render: bring the grid top back under the tabs if
  // the visitor had scrolled past it, fade the first cards in, and slide the active tab
  // into view in the phone scroll row.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const row = rowRef.current;
    const tab = row?.querySelector<HTMLElement>(`[data-key="${active}"]`);
    if (row && tab && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: reduce || first.current ? 'auto' : 'smooth' });
    }

    if (first.current) {
      first.current = false;
      return;
    }

    const browser = browserRef.current;
    if (!browser) return;
    const top = browser.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 24, behavior: 'auto' });

    if (reduce) return;
    // Fade + slide up, 10ms stagger capped at 6: under 250ms in total.
    const items = [...browser.querySelectorAll<HTMLElement>('.nxpf-item')].filter((el) => el.offsetParent !== null).slice(0, 18);
    items.forEach((el, i) => {
      el.animate(
        [{ opacity: 0, translate: '0 14px' }, { opacity: 1, translate: '0 0' }],
        { duration: 180, delay: Math.min(i, 6) * 10, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'backwards' },
      );
    });
  }, [active]);

  return (
    <div className="nxpf-browser" ref={browserRef} data-cat={active} data-empty={emptyKeys.includes(active) || undefined}>
      <nav className="nxpf-tabs" aria-label="Portfolio categories">
        <ul ref={rowRef} className="nxpf-tabs-row nx-glass">
          {tabs.map((t) => {
            const isActive = t.key === active;
            return (
              <li key={t.key}>
                <a
                  href={t.key === ALL ? '/portfolio' : `/portfolio?category=${t.key}`}
                  data-key={t.key}
                  className="nxpf-tab"
                  aria-current={isActive ? 'true' : undefined}
                  onClick={(e) => select(e, t.key)}
                >
                  <Chip variant={isActive ? 'blue' : 'default'} className="nxpf-tab-chip">
                    {t.label}
                    <span className="nxpf-tab-count" aria-label={`, ${t.count} items`}>
                      {t.count}
                    </span>
                  </Chip>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      {children}
    </div>
  );
}
