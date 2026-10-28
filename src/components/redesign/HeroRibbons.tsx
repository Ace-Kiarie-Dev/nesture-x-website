'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Decorative ribbon glow behind a page hero (homepage, NX Gaming hub, /services,
// /portfolio). Client-only and loaded late; nothing renders inside the layer, so the
// hero never remounts. The canvas pauses itself off screen or in a hidden tab, and
// draws one static frame under reduced motion (LiquidRibbons). Each page styles the
// layer through `className` (size, opacity, mask, light-theme treatment).
const HeroRibbonsCanvas = dynamic(() => import('./HeroRibbonsCanvas'), { ssr: false });

// The ribbon canvas is cheap to download but busy on the main thread, so it waits for
// the page load and an idle moment: first paint and LCP never compete with it.
function useAfterLoadIdle(enabled: boolean) {
  const [ready, setReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      else timer = setTimeout(() => setReady(true), 1200);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [enabled]);

  return ready;
}

type HeroRibbonsProps = {
  className: string;
  /** Wait for load + idle before mounting the canvas (default). The hub mounts at once. */
  defer?: boolean;
};

export default function HeroRibbons({ className, defer = true }: HeroRibbonsProps) {
  const ready = useAfterLoadIdle(defer);
  return (
    <div className={className} aria-hidden="true">
      {ready && <HeroRibbonsCanvas />}
    </div>
  );
}
