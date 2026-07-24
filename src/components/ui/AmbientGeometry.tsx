'use client';

import { motion } from 'framer-motion';

// Purely decorative, non-contextual floating wireframe shapes — dropped into
// the empty side of a two-column hero (see Hero.tsx's left-text/right-visual
// pattern). Fixed, hand-placed positions rather than Math.random() so there's
// no SSR/client hydration mismatch; still reads as scattered and arbitrary.

type ShapeKind = 'triangle' | 'cube' | 'dot' | 'ring';

interface ShapeConfig {
  kind: ShapeKind;
  top: string;
  left: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotate: number;
}

const BLUE      = 'var(--color-primary)';
const BLUE_GREY = '#b8cef0';

const SHAPES: ShapeConfig[] = [
  { kind: 'ring',     top: '6%',  left: '18%', size: 74, color: BLUE,      duration: 7.5, delay: 0,   rotate: 0 },
  { kind: 'triangle', top: '14%', left: '62%', size: 42, color: BLUE_GREY, duration: 9,   delay: 0.6, rotate: 12 },
  { kind: 'dot',      top: '28%', left: '42%', size: 12, color: BLUE,      duration: 6,   delay: 1.1, rotate: 0 },
  { kind: 'cube',     top: '38%', left: '10%', size: 58, color: BLUE_GREY, duration: 10.5, delay: 0.3, rotate: -10 },
  { kind: 'ring',     top: '52%', left: '70%', size: 36, color: BLUE,      duration: 8,   delay: 0.9, rotate: 0 },
  { kind: 'dot',      top: '62%', left: '28%', size: 16, color: BLUE_GREY, duration: 5.5, delay: 1.6, rotate: 0 },
  { kind: 'triangle', top: '74%', left: '54%', size: 50, color: BLUE,      duration: 8.5, delay: 0.2, rotate: -22 },
  { kind: 'cube',     top: '8%',  left: '42%', size: 32, color: BLUE,      duration: 11,  delay: 1.3, rotate: 18 },
  { kind: 'ring',     top: '82%', left: '20%', size: 26, color: BLUE_GREY, duration: 7,   delay: 0.4, rotate: 0 },
];

function ShapeSvg({ kind, size, color }: { kind: ShapeKind; size: number; color: string }) {
  const opacity = 0.4;

  switch (kind) {
    case 'ring':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} />
        </svg>
      );
    case 'dot':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" r="40" fill={color} opacity={opacity} />
        </svg>
      );
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
          <polygon points="50,6 94,90 6,90" fill="none" stroke={color} strokeWidth="1.5" opacity={opacity} />
        </svg>
      );
    case 'cube':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
          <polygon points="30,20 80,20 80,70 30,70" fill="none" stroke={color} strokeWidth="1.3" opacity={opacity} />
          <polygon points="10,35 60,35 60,85 10,85" fill="none" stroke={color} strokeWidth="1.3" opacity={opacity * 0.75} />
          <line x1="30" y1="20" x2="10" y2="35" stroke={color} strokeWidth="1.3" opacity={opacity * 0.75} />
          <line x1="80" y1="20" x2="60" y2="35" stroke={color} strokeWidth="1.3" opacity={opacity * 0.75} />
          <line x1="80" y1="70" x2="60" y2="85" stroke={color} strokeWidth="1.3" opacity={opacity * 0.75} />
          <line x1="30" y1="70" x2="10" y2="85" stroke={color} strokeWidth="1.3" opacity={opacity * 0.75} />
        </svg>
      );
  }
}

function Shape({ cfg }: { cfg: ShapeConfig }) {
  return (
    <motion.div
      style={{ position: 'absolute', top: cfg.top, left: cfg.left, width: cfg.size, height: cfg.size }}
      animate={{
        y: [0, -18, 0],
        x: [0, 9, 0],
        rotate: [cfg.rotate, cfg.rotate + 8, cfg.rotate],
      }}
      transition={{ duration: cfg.duration, repeat: Infinity, ease: 'easeInOut', delay: cfg.delay }}
    >
      <ShapeSvg kind={cfg.kind} size={cfg.size} color={cfg.color} />
    </motion.div>
  );
}

export default function AmbientGeometry() {
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {SHAPES.map((cfg, i) => (
        <Shape key={i} cfg={cfg} />
      ))}
    </div>
  );
}
