'use client';

import { useEffect, useState } from 'react';
import { LiquidRibbons } from '@/components/ui/LiquidRibbons';

// Client-only (loaded through next/dynamic with ssr: false), so matchMedia is safe on first render.
const WIDE = '(min-width: 1024px)';

// Decorative ribbon glow behind the top of the hub. Nothing renders inside it, so the
// hero content is never remounted when this chunk arrives. The layer sits under the
// content with pointer-events off, so the pointer effects are switched off too.
export default function HubRibbons() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);

  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const onChange = () => setWide(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <LiquidRibbons
      scheme="ice"
      quality={wide ? 'high' : 'lite'}
      speed={0.8}
      interactive={false}
      className="nxh-ribbons-canvas"
      style={{ position: 'absolute', inset: 0 }}
    />
  );
}
