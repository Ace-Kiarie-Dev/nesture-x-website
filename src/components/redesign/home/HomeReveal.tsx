'use client';

import { useEffect } from 'react';

type RevealProps = {
  /** Page root that gets the ready class. */
  root?: string;
  /** Items to fade in, inside the root. */
  item?: string;
  readyClass?: string;
};

// Scroll reveal for the homepage. Server HTML shows everything; once this runs it marks
// .nxhp as ready (CSS then hides .nxhp-reveal items still below the fold) and fades each
// one in as it enters. Stagger comes from a --i index set on the item. Skipped entirely
// under prefers-reduced-motion, so nothing is ever hidden there.
// Other redesigned pages reuse it with their own selectors (e.g. /services: .nxsv).
export default function HomeReveal({ root = '.nxhp', item = '.nxhp-reveal', readyClass = 'nxhp-reveal-ready' }: RevealProps) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rootEl = document.querySelector(root);
    if (!rootEl) return;

    const items = [...rootEl.querySelectorAll<HTMLElement>(item)];
    // Anything already on screen (or above it) stays put: no flash on load or on a deep link.
    const fold = window.innerHeight;
    for (const el of items) {
      if (el.getBoundingClientRect().top < fold) el.classList.add('is-in');
    }
    rootEl.classList.add(readyClass);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const el of items) if (!el.classList.contains('is-in')) io.observe(el);
    return () => io.disconnect();
  }, [root, item, readyClass]);

  return null;
}
