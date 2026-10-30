'use client';

import { useEffect, useRef, useState } from 'react';

// Counts a stat like "20+" or "100%" up from 0 the first time it scrolls into view.
// Server HTML and reduced motion show the final value; a stat already on screen when
// the page loads is left as is, so nothing flickers. tabular-nums keeps the width steady.
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match ? match[2] : '';
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    // Reset to 0 only once we know it will count; the observer fires on the next frame.
    raf = requestAnimationFrame(() => setShown((s) => s ?? 0));
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // value is static per instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!match) return <>{value}</>;
  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {shown ?? target}
      {suffix}
    </span>
  );
}
