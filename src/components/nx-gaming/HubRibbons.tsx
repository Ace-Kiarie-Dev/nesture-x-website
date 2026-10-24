'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { LiquidRibbons } from '@/components/ui/LiquidRibbons';

// Client-only (loaded through next/dynamic with ssr: false), so matchMedia is safe on first render.
const WIDE = '(min-width: 1024px)';

export default function HubRibbons({ children }: { children: ReactNode }) {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);

  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <LiquidRibbons scheme="ice" quality={wide ? 'high' : 'lite'} speed={0.8} className="nxg-ribbons">
      {children}
    </LiquidRibbons>
  );
}
