'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

// "In Testing" status motif — a ring that draws around on a loop, with a
// checkmark that pulses right as each loop completes.

const SIZE = 110;
const RADIUS = 44;
const STROKE = 3;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DURATION = 2.6;

export default function ProgressRingAnimation() {
  return (
    <div aria-hidden style={{ position: 'relative', width: SIZE, height: SIZE }}>
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="rgba(26,111,212,0.15)"
          strokeWidth={STROKE}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: DURATION, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>

      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
        }}
        animate={{ scale: [1, 1, 1.12, 1], opacity: [0.35, 0.35, 1, 0.75] }}
        transition={{
          duration: DURATION,
          repeat: Infinity,
          ease: 'easeOut',
          times: [0, 0.82, 0.92, 1],
        }}
      >
        <Check size={34} strokeWidth={2.5} aria-hidden />
      </motion.div>
    </div>
  );
}
