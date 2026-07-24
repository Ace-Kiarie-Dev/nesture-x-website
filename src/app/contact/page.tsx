'use client';

import { motion } from 'framer-motion';
import Contact from '@/components/sections/Contact';
import NxButton from '@/components/ui/NxButton';
import AmbientGeometry from '@/components/ui/AmbientGeometry';
import { useBreakpoint } from '@/lib/useBreakpoint';

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

export default function ContactPage() {
  const { isMobile } = useBreakpoint();

  return (
    <main>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{
          padding: 'clamp(8rem, 12vw, 14rem) clamp(2rem, 7vw, 8rem) clamp(5rem, 8vw, 8rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />

        <motion.div
          className="relative z-[1]"
          style={{ flex: isMobile ? '1 1 100%' : '0 1 640px', maxWidth: isMobile ? '100%' : '56%' }}
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="section-label" style={{ marginBottom: '3rem' }} variants={item}>
            Contact
          </motion.p>

          <motion.h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4.5rem, 11vw, 11rem)',
              lineHeight: 0.87,
              color: 'var(--color-text)',
              marginBottom: '3.5rem',
              maxWidth: '900px',
            }}
            variants={item}
          >
            LET&apos;S TALK ABOUT WHAT YOU&apos;RE BUILDING.
          </motion.h1>

          <motion.p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              lineHeight: 1.9,
              color: 'var(--color-text-secondary)',
              maxWidth: '36rem',
              marginBottom: '3.5rem',
            }}
            variants={item}
          >
            Got an idea? Half an idea? Just exploring?<br />
            Start the conversation — we&apos;ll figure it out together.
          </motion.p>

          {/* Book a consultation CTA */}
          <motion.div
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
            variants={item}
          >
            <NxButton variant="primary" size="md" href="/booking">
              Book a Consultation
            </NxButton>
            <NxButton variant="ghost" size="md" href="/portfolio">
              SEE OUR WORK FIRST
            </NxButton>
          </motion.div>
        </motion.div>

        {/* Ambient decorative geometry — right side, purely visual */}
        {!isMobile && (
          <div className="relative z-[1]" style={{ flex: '1 1 auto', alignSelf: 'stretch', minHeight: '420px' }}>
            <AmbientGeometry />
          </div>
        )}
      </section>

      {/* ── Contact form (reused section component) ── */}
      <Contact />

    </main>
  );
}
