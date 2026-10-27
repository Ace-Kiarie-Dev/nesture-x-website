'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import type { GravityTextProps } from './GravityText';

// GravityText and matter-js load as their own chunk, only once the stage is on screen.
const GravityText = dynamic(() => import('./GravityText').then((m) => m.GravityText), {
  ssr: false,
  loading: () => null,
});

type GravityTextLazyProps = Omit<GravityTextProps, 'letterClassName' | 'draggable'> & {
  text: string;
  /** Stage height; a CSS length or var(), so it can change per breakpoint. */
  height: number | string;
  /** Class for every letter. A string, so server components can pass it. */
  letterClassName?: string;
  /** Adds an sr-only copy of the text. Turn off when a heading next to it already carries the words. */
  announce?: boolean;
};

// Same letter layout GravityText uses for its targets, so the swap does not move anything.
function StaticWord({ text, height, className, letterClassName }: Omit<GravityTextLazyProps, 'announce'>) {
  return (
    <div className={`relative w-full overflow-hidden ${className ?? ''}`} style={{ height } as CSSProperties}>
      <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center px-4">
        {Array.from(text).map((c, i) => (
          <span key={i} className={`inline-block leading-none whitespace-pre ${letterClassName ?? ''}`}>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/*
  GravityText, made safe for the page:
  - A static copy of the word with the same classes and stage height shows until the physics
    is running, so there is never a gap or a shift, and the text is in the server HTML.
  - The physics only mounts once the stage scrolls into view (40% visible, once), so the
    letters drop as the visitor arrives, and matter-js never loads for anyone who doesn't.
  - Touch screens get draggable={false}, so a finger on the stage still scrolls the page.
  - Reduced motion is handled inside GravityText (it just shows the word).
  - One sr-only copy of the text; the visual stage is aria-hidden so it is not read twice.
  Don't use it in the hero: GravityText hides its letters until web fonts are ready.
*/
export default function GravityTextLazy(props: GravityTextLazyProps) {
  const { text, letterClassName, announce = true, ...rest } = props;
  const hostRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState<null | { draggable: boolean }>(null);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setLive({ draggable: !window.matchMedia('(pointer: coarse)').matches });
      },
      { threshold: 0.4 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  // matter-js 0.20's Mouse listens for "wheel" (non-passive) and calls preventDefault, but
  // GravityText only unhooks the old "mousewheel" / "DOMMouseScroll" names, so a wheel over
  // the stage would stop the page scrolling. Stop the event here, on its way down in the
  // capture phase, before it reaches matter's listener; the browser still scrolls.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const keepScrolling = (e: WheelEvent) => e.stopPropagation();
    host.addEventListener('wheel', keepScrolling, { capture: true, passive: true });
    return () => host.removeEventListener('wheel', keepScrolling, { capture: true });
  }, []);

  // Keep the static word up until GravityText reveals its letters (it does so once fonts are
  // ready), then drop it, so there is never a blank stage and never two copies.
  useEffect(() => {
    const box = liveRef.current;
    if (!live || dropped || !box) return;
    // GravityText arrives later (lazy chunk, then fonts.ready), so watch for its first letter.
    const shown = () => !!box.querySelector('[style*="visibility: visible"]');
    const mo = new MutationObserver(() => {
      if (!shown()) return;
      mo.disconnect();
      setDropped(true);
    });
    mo.observe(box, { subtree: true, childList: true, attributes: true, attributeFilter: ['style'] });
    return () => mo.disconnect();
  }, [live, dropped]);

  return (
    <span ref={hostRef} className="relative block w-full">
      {announce && <span className="nx-sr-only">{text}</span>}
      <span aria-hidden="true" className="relative block w-full">
        {live ? (
          <span ref={liveRef} className="relative block w-full">
            {!dropped && (
              <span className="absolute inset-0">
                <StaticWord {...rest} text={text} letterClassName={letterClassName} />
              </span>
            )}
            <GravityText {...rest} text={text} letterClassName={letterClassName ?? ''} draggable={live.draggable} />
          </span>
        ) : (
          <StaticWord {...rest} text={text} letterClassName={letterClassName} />
        )}
      </span>
    </span>
  );
}
