'use client';

import { motion } from 'framer-motion';

// "In Development" status motif — two interlocking gears, continuous rotation.

const BIG = 152;
const SMALL = 98;
const OVERLAP = 34; // px the small gear tucks under the big gear's edge

function GearShape({ size, teeth, fill }: { size: number; teeth: number; fill: string }) {
  const r = size / 2;
  const toothH = size * 0.14;
  const toothW = size * 0.11;
  const bodyR = r - toothH * 0.6;
  const step = 360 / teeth;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={r} cy={r} r={bodyR} fill={fill} />
      {Array.from({ length: teeth }).map((_, i) => (
        <rect
          key={i}
          x={r - toothW / 2}
          y={0}
          width={toothW}
          height={toothH + 3}
          fill={fill}
          transform={`rotate(${i * step} ${r} ${r})`}
        />
      ))}
      <circle cx={r} cy={r} r={bodyR * 0.3} fill="var(--color-bg)" />
    </svg>
  );
}

export default function GearsAnimation() {
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: BIG + SMALL - OVERLAP,
        height: BIG,
      }}
    >
      <motion.div
        style={{ position: 'absolute', left: 0, top: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        <GearShape size={BIG} teeth={14} fill="var(--color-primary)" />
      </motion.div>

      <motion.div
        style={{ position: 'absolute', left: BIG - OVERLAP, top: (BIG - SMALL) / 2 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <GearShape size={SMALL} teeth={10} fill="#b8cef0" />
      </motion.div>
    </div>
  );
}
