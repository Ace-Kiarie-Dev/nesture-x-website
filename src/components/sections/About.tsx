'use client';

import { motion } from 'framer-motion';
import NxButton from '@/components/ui/NxButton';

// ─── Animation variants ────────────────────────────────────────────────────────

const stagger = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

const item = {
  hidden:   { opacity: 0, y: 28 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

// ─── Stats ─────────────────────────────────────────────────────────────────────

const STATS = [
  { stat: '20+',  label: 'Projects Shipped' },
  { stat: '3',    label: 'Core Disciplines' },
  { stat: '100%', label: 'Built with Intention' },
];

// ─── Main component ────────────────────────────────────────────────────────────

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Grid overlay behind all content */}
      <div
        className="grid-overlay absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      />

      {/* Content wrapper */}
      <div
        className="relative z-[1]"
        style={{ padding: 'clamp(8rem, 12vw, 14rem) clamp(2rem, 7vw, 8rem)' }}
      >

        {/* Left-aligned stack: label → heading → story → CTA */}
        <motion.div
          className="flex flex-col"
          style={{ maxWidth: '48rem' }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Section label */}
          <motion.p
            className="section-label"
            style={{ marginBottom: '3.5rem' }}
            variants={item}
          >
            About Us
          </motion.p>

          {/* Heading */}
          <motion.h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
              lineHeight: 0.9,
              color: 'var(--color-text)',
              marginBottom: '3.5rem',
            }}
            variants={item}
          >
            BORN IN NAIROBI.<br />BUILT FOR THE WORLD.
          </motion.h2>

          {/* Story */}
          <motion.p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
              lineHeight: 1.9,
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
            }}
            variants={item}
          >
            Nesture-X is a creative agency built by a tight-knit team of designers, developers,
            and strategists who believe the best digital work starts with genuine intention.
            We don&apos;t do cookie-cutter — every project is a new problem to solve, a new story
            to tell, and a new benchmark to set.
          </motion.p>
          <motion.p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
              lineHeight: 1.9,
              color: 'var(--color-text-secondary)',
              marginBottom: '5rem',
            }}
            variants={item}
          >
            Small enough to care deeply about every client. Skilled enough to compete with anyone.
            The full story is worth reading.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item}>
            <NxButton variant="primary" size="md" href="/about">
              OUR STORY
            </NxButton>
          </motion.div>
        </motion.div>

        {/* Stats row — full width, separated by generous top margin */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 border-t border-[rgba(26,111,212,0.15)]"
          style={{ marginTop: 'clamp(6rem, 10vw, 10rem)' }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {STATS.map(({ stat, label }) => (
            <motion.div
              key={label}
              variants={item}
              className="py-10 px-2 flex flex-col gap-2 border-b sm:border-b-0 sm:border-r border-[rgba(26,111,212,0.15)] last:border-0"
            >
              <span
                className="text-[clamp(2.5rem,4.5vw,4rem)] leading-none text-[var(--color-text)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {stat}
              </span>
              <span
                className="text-[0.68rem] tracking-[0.18em] uppercase text-[var(--color-text-muted)]"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
