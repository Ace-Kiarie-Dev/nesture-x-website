'use client';

import { useEffect, useState } from 'react';

// Standard arrow cursor path — tip sits at (0,0) of the SVG viewport
const ARROW = 'M 1 1 L 1 15 L 4.5 11.5 L 7 17 L 9.2 16.1 L 6.7 10.5 L 12 10.5 Z';

// Pointing hand for interactive elements — simplified pointer shape
const HAND  = 'M 6 1 C 6 1 6 8 6 8 C 6 8 5 7 4 7 C 3 7 2 8 3 9 L 6 14 C 6 14 7 16 9 16 C 12 16 13 14 13 11 L 13 7 C 13 6 12 5 11 5 C 11 5 11 4 10 4 C 10 4 10 3 9 3 C 9 3 9 1 8 1 C 7 1 6 1 6 1 Z';

export default function CustomCursor() {
  const [pos,     setPos]     = useState({ x: -100, y: -100 });
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

    const onEnter = () => setIsHover(true);
    const onLeave = () => setIsHover(false);

    const attach = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    attach();

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <svg
      width={isHover ? 18 : 16}
      height={isHover ? 22 : 20}
      viewBox={isHover ? '0 0 16 18' : '0 0 14 20'}
      style={{
        position:    'fixed',
        left:        pos.x,
        top:         pos.y,
        pointerEvents: 'none',
        zIndex:      9999,
        transition:  'width 0.15s ease, height 0.15s ease',
        filter:      'drop-shadow(0 0 3px rgba(26,111,212,0.5))',
      }}
      aria-hidden
    >
      <path
        d={isHover ? HAND : ARROW}
        fill="#1a6fd4"
        stroke="#0a0a0a"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
