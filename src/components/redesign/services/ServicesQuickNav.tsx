'use client';

import { useEffect, useRef, useState } from 'react';
import { Chip } from '@/components/redesign';
import { SERVICES } from '@/lib/services-data';

// Glass pill of anchor chips to #s1..#s6. Sticks under the floating nav while the
// service blocks scroll by; the chip of the block crossing the middle of the screen
// turns blue. The server renders the first chip active, so there's no flash.
export default function ServicesQuickNav() {
  const [active, setActive] = useState<string>(SERVICES[0].id);
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = SERVICES.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);
    // A thin band just above the middle of the viewport: whichever block covers it wins.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    for (const el of sections) io.observe(el);
    return () => io.disconnect();
  }, []);

  // In the phone scroll row, slide the active chip into view (horizontally only).
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  }, [active]);

  return (
    <nav className="nxsv-qnav" aria-label="Services on this page">
      <ul ref={rowRef} className="nxsv-qnav-row nx-glass">
        {SERVICES.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-id={s.id}
                className="nxsv-qnav-link"
                aria-current={isActive ? 'true' : undefined}
              >
                <Chip variant={isActive ? 'blue' : 'default'} className="nxsv-qnav-chip">
                  {s.number} · {s.title}
                </Chip>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
