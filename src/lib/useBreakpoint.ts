'use client';

import { useState, useEffect } from 'react';

export interface Breakpoint {
  isMobile: boolean;   // < 640px
  isTablet: boolean;   // 640–1023px
  isDesktop: boolean;  // ≥ 1024px
}

const DESKTOP_DEFAULT: Breakpoint = { isMobile: false, isTablet: false, isDesktop: true };

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(DESKTOP_DEFAULT);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setBp({
        isMobile: w < 640,
        isTablet: w >= 640 && w < 1024,
        isDesktop: w >= 1024,
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return bp;
}
