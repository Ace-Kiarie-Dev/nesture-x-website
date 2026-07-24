'use client';

import { motion } from 'framer-motion';
import NxButton from '@/components/ui/NxButton';
import AmbientGeometry from '@/components/ui/AmbientGeometry';
import { useBreakpoint } from '@/lib/useBreakpoint';

// ─── Shared tokens ─────────────────────────────────────────────────────────────

const SECTION_PAD = 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem)';
const SECTION_PAD_SM = 'clamp(5rem, 8vw, 8rem) clamp(2rem, 7vw, 8rem)';

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' as const } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const item = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

// ─── Clip-path for Peter's image ───────────────────────────────────────────────

const CLIP = 'polygon(0% 0%, 92% 0%, 100% 8%, 100% 100%, 8% 100%, 0% 92%)';

// ─── Data ──────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    label: '01',
    name: 'Strategy',
    description: 'Understanding what actually needs to happen — before a single pixel or line of code.',
  },
  {
    label: '02',
    name: 'Design',
    description: 'Shaping how it feels, communicates, and connects. Form with a reason behind every choice.',
  },
  {
    label: '03',
    name: 'Code',
    description: 'Building what makes it work. Clean, scalable, and production-ready.',
  },
];

const VALUES = [
  {
    title: 'Solutions First',
    body: 'We look past the surface. If something needs to be rethought, we rethink it. If it needs to be simplified, we simplify. The brief is a starting point, not a ceiling.',
  },
  {
    title: 'Ideas Matter',
    body: 'Some ideas arrive fully formed. Others don\'t. Both are welcome here. We help shape them into something usable, clear, and ready for the world.',
  },
  {
    title: 'Craft Matters Too',
    body: 'Details count. From small design elements to full platforms, everything is built with the kind of care you notice over time — not just on launch day.',
  },
  {
    title: 'We Stay Close',
    body: 'We don\'t vanish after delivery. We stay connected to the outcome, not just the output. Because the work doesn\'t end when the file is handed over.',
  },
];

const STRENGTHS = [
  'Full-stack web development',
  'Brand identity & visual design',
  'M-Pesa payment integrations',
  'System architecture & deployment',
  'Digital strategy',
];

const INVESTMENTS = [
  'Fitness & coaching',
  'Travel & experiences',
  'Imports & logistics',
  'Décor & events',
  'Food & bakery',
];

const MILESTONES = [
  'Built and deployed multiple live platforms',
  'Delivered full-stack systems with integrated payments',
  'Partnered with businesses through equity',
  'Developed internal tools to streamline client workflows',
  'Started building our own product ecosystem',
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { isMobile } = useBreakpoint();

  return (
    <main>

      {/* ══════════════════════════════════════════════════════
          1. HERO — Who We Are
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{
          padding: SECTION_PAD,
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
            About Nesture-X
          </motion.p>

          <motion.h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 12vw, 12rem)',
              lineHeight: 0.87,
              color: 'var(--color-text)',
              marginBottom: '4rem',
            }}
            variants={item}
          >
            WHO<br />WE ARE
          </motion.h1>

          {/* Opening statement */}
          <motion.div style={{ maxWidth: '42rem' }} variants={stagger}>
            <motion.p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
                lineHeight: 1.85,
                color: 'var(--color-text)',
                marginBottom: '2rem',
                fontWeight: 400,
              }}
              variants={item}
            >
              Nesture-X is a Nairobi-based creative technology agency living at the
              intersection of strategy, design, and code.
            </motion.p>

            <motion.p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 1.9,
                color: 'var(--color-text-secondary)',
                marginBottom: '1.5rem',
              }}
              variants={item}
            >
              We build digital experiences, yes — but more importantly, we help businesses move forward.
            </motion.p>

            <motion.div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 2,
                color: 'var(--color-text-secondary)',
                borderLeft: '2px solid rgba(26,111,212,0.4)',
                paddingLeft: '1.5rem',
                marginBottom: '2.5rem',
              }}
              variants={item}
            >
              <p>Sometimes that looks like a website.</p>
              <p>Sometimes it&apos;s a full system.</p>
              <p>Sometimes it&apos;s just clarity.</p>
            </motion.div>

            <motion.p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                lineHeight: 1.8,
                color: 'var(--color-primary)',
                letterSpacing: '0.02em',
              }}
              variants={item}
            >
              Either way, the goal is the same —<br />
              take an idea and give it real-world traction.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Ambient decorative geometry — right side, purely visual */}
        {!isMobile && (
          <div className="relative z-[1]" style={{ flex: '1 1 auto', alignSelf: 'stretch', minHeight: '420px' }}>
            <AmbientGeometry />
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════
          2. THE STORY
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--color-surface)',
          padding: SECTION_PAD,
        }}
      >
        <motion.div
          className="flex flex-col lg:flex-row gap-16 lg:gap-24"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left — label + ghost year */}
          <motion.div
            className="flex-shrink-0 lg:w-56"
            style={{ borderRight: '1px solid rgba(26,111,212,0.12)', paddingRight: '3rem' }}
            variants={item}
          >
            <p className="section-label" style={{ marginBottom: '2rem' }}>The Story</p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '7rem',
                lineHeight: 1,
                color: 'rgba(26,111,212,0.10)',
                userSelect: 'none',
              }}
            >
              2024
            </p>
          </motion.div>

          {/* Right — narrative */}
          <motion.div style={{ maxWidth: '44rem' }} variants={stagger}>
            <motion.h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                lineHeight: 0.92,
                color: 'var(--color-text)',
                marginBottom: '3.5rem',
              }}
              variants={item}
            >
              WHERE IT STARTED
            </motion.h2>

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
              Nesture-X was founded in late 2024 by Peter Kiarie Kamande.
            </motion.p>

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
              At the time, there was a pattern that kept showing up — businesses were investing
              in digital, but not always getting results back.
            </motion.p>

            <motion.div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 2.1,
                color: 'var(--color-text-muted)',
                borderLeft: '2px solid rgba(26,111,212,0.3)',
                paddingLeft: '1.5rem',
                marginBottom: '2.5rem',
              }}
              variants={item}
            >
              <p>Websites that looked good but didn&apos;t convert.</p>
              <p>Brands that existed, but didn&apos;t connect.</p>
              <p>Systems that worked… but didn&apos;t scale.</p>
            </motion.div>

            <motion.p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 1.9,
                color: 'var(--color-text-secondary)',
                marginBottom: '1rem',
              }}
              variants={item}
            >
              So Nesture-X was built to close that gap.
            </motion.p>

            <motion.p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.9rem, 1.1vw, 0.95rem)',
                lineHeight: 1.9,
                color: 'var(--color-primary)',
                letterSpacing: '0.02em',
              }}
              variants={item}
            >
              Not by overcomplicating things —<br />
              but by getting closer to the actual problem and building from there.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. WHAT WE DO — 3 Pillars
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{ padding: SECTION_PAD }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />

        <div className="relative z-[1]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p className="section-label" style={{ marginBottom: '2rem' }} variants={item}>
              What We Do
            </motion.p>

            <motion.h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 6rem)',
                lineHeight: 0.9,
                color: 'var(--color-text)',
                marginBottom: '1rem',
              }}
              variants={item}
            >
              THREE THINGS.
            </motion.h2>
            <motion.h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 6rem)',
                lineHeight: 0.9,
                color: 'transparent',
                WebkitTextStroke: '1px var(--color-primary)',
                marginBottom: '5rem',
              }}
              variants={item}
            >
              ONE SYSTEM.
            </motion.h2>
          </motion.div>

          {/* Pillars grid */}
          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1px',
              background: 'rgba(26,111,212,0.10)',
            }}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PILLARS.map(pillar => (
              <motion.div
                key={pillar.label}
                variants={item}
                style={{
                  background: 'var(--color-bg)',
                  padding: 'clamp(2.5rem, 4vw, 4rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    color: 'rgba(26,111,212,0.5)',
                  }}
                >
                  {pillar.label}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 4vw, 4rem)',
                    lineHeight: 0.9,
                    color: 'var(--color-text)',
                  }}
                >
                  {pillar.name.toUpperCase()}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Closing line */}
          <motion.p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.05em',
              marginTop: '3rem',
              borderTop: '1px solid rgba(26,111,212,0.12)',
              paddingTop: '2rem',
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            When those three move in sync, things click. And that&apos;s where most of our work lives — right in that alignment.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. THE TEAM — Peter
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--color-surface)',
          padding: SECTION_PAD,
        }}
      >
        <motion.p
          className="section-label"
          style={{ marginBottom: '4rem' }}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          The Team
        </motion.p>

        <motion.div
          className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Photo */}
          <motion.div className="flex-shrink-0" variants={item}>
            <div style={{ position: 'relative', width: '280px', aspectRatio: '3 / 4' }}>
              {/* Blue accent */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: CLIP,
                  background: 'rgba(26,111,212,0.22)',
                  transform: 'translate(7px, 7px)',
                }}
              />
              {/* Image with hover swap */}
              <div
                className="group absolute inset-0 overflow-hidden"
                style={{ clipPath: CLIP }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Ace1.jpg"
                  alt="Peter Kiarie Kamande"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Ace2.jpg"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                />
              </div>
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div style={{ maxWidth: '44rem' }} variants={stagger}>
            <motion.h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 5vw, 5.5rem)',
                lineHeight: 0.88,
                color: 'var(--color-text)',
                marginBottom: '1.25rem',
              }}
              variants={item}
            >
              PETER KIARIE<br />KAMANDE
            </motion.h2>

            <motion.span
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                border: '1px solid rgba(26,111,212,0.35)',
                background: 'rgba(26,111,212,0.07)',
                padding: '0.35rem 0.9rem',
                marginBottom: '2.5rem',
              }}
              variants={item}
            >
              Founder · CEO · Lead Developer &amp; Designer
            </motion.span>

            <motion.p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 1.9,
                color: 'var(--color-text-secondary)',
                marginBottom: '1.5rem',
              }}
              variants={item}
            >
              A hands-on builder at heart, Peter works across both the creative and technical
              sides of every project. From interface design to backend systems and deployment,
              he stays close to the work — making sure what&apos;s imagined is actually what
              gets built.
            </motion.p>

            <motion.p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 1.9,
                color: 'var(--color-text-secondary)',
                marginBottom: '3rem',
              }}
              variants={item}
            >
              Nesture-X is intentionally lean — decisions are fast, communication is direct,
              and execution stays focused.
            </motion.p>

            {/* Strengths */}
            <motion.div variants={stagger}>
              <motion.p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: '1.25rem',
                }}
                variants={item}
              >
                Core Strengths
              </motion.p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {STRENGTHS.map(s => (
                  <motion.div
                    key={s}
                    variants={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.7rem 1rem',
                      border: '1px solid rgba(26,111,212,0.12)',
                      background: 'rgba(26,111,212,0.03)',
                    }}
                  >
                    <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>→</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{s}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. WHAT WE STAND FOR — Values
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{ padding: SECTION_PAD }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />
        <div className="relative z-[1]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p className="section-label" style={{ marginBottom: '2rem' }} variants={item}>
              What We Stand For
            </motion.p>
            <motion.h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 6rem)',
                lineHeight: 0.9,
                color: 'var(--color-text)',
                marginBottom: '5rem',
              }}
              variants={item}
            >
              THE VALUES
            </motion.h2>
          </motion.div>

          <motion.div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              background: 'rgba(26,111,212,0.10)',
            }}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                variants={item}
                style={{
                  background: 'var(--color-bg)',
                  padding: 'clamp(2.5rem, 4vw, 3.5rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'border-color 0.3s',
                  borderTop: '2px solid transparent',
                }}
                whileHover={{ borderTopColor: 'var(--color-primary)' } as never}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.2em',
                    color: 'rgba(26,111,212,0.4)',
                  }}
                >
                  0{i + 1}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                    lineHeight: 1,
                    color: 'var(--color-text)',
                  }}
                >
                  {v.title.toUpperCase()}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.85,
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {v.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. THE EQUITY MODEL
      ══════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--color-surface)', padding: SECTION_PAD }}>
        <motion.div
          className="flex flex-col lg:flex-row gap-16 lg:gap-24"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left — heading */}
          <motion.div className="flex-shrink-0" style={{ maxWidth: '20rem' }} variants={item}>
            <p className="section-label" style={{ marginBottom: '2.5rem' }}>The Model</p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 5vw, 5rem)',
                lineHeight: 0.9,
                color: 'var(--color-text)',
              }}
            >
              THE EQUITY MODEL
            </h2>
          </motion.div>

          {/* Right — content */}
          <motion.div style={{ maxWidth: '44rem' }} variants={stagger}>
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
              In some cases, Nesture-X partners more deeply with the businesses we work with.
              Instead of a standard client relationship, we take equity.
            </motion.p>

            <motion.div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 2.1,
                color: 'var(--color-text-muted)',
                borderLeft: '2px solid rgba(26,111,212,0.35)',
                paddingLeft: '1.5rem',
                marginBottom: '3rem',
              }}
              variants={item}
            >
              <p>We help build the product or platform.</p>
              <p>We stay involved as it grows.</p>
              <p>We share in the upside.</p>
            </motion.div>

            <motion.p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.8,
                color: 'var(--color-text-muted)',
                marginBottom: '3.5rem',
              }}
              variants={item}
            >
              It&apos;s not for every project — but when it fits, it creates a stronger kind of alignment.
            </motion.p>

            {/* Where We're Invested */}
            <motion.p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: '1.5rem',
              }}
              variants={item}
            >
              Where We&apos;re Invested
            </motion.p>

            <motion.div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.6rem',
              }}
              variants={stagger}
            >
              {INVESTMENTS.map(sector => (
                <motion.div
                  key={sector}
                  variants={item}
                  style={{
                    padding: '0.9rem 1.1rem',
                    border: '1px solid rgba(26,111,212,0.15)',
                    background: 'rgba(26,111,212,0.04)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                  }}
                >
                  <span style={{ color: 'var(--color-primary)', fontSize: '0.6rem' }}>◆</span>
                  {sector}
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-text-faint)',
                marginTop: '1.5rem',
                letterSpacing: '0.05em',
              }}
              variants={item}
            >
              Long-term collaborations, not one-off builds.
            </motion.p>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. MILESTONES
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{ padding: SECTION_PAD_SM }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />
        <div className="relative z-[1]">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p className="section-label" style={{ marginBottom: '2rem' }} variants={item}>
              Milestones
            </motion.p>
            <motion.h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.8rem, 6vw, 6rem)',
                lineHeight: 0.9,
                color: 'var(--color-text)',
                marginBottom: '4rem',
              }}
              variants={item}
            >
              SO FAR
            </motion.h2>

            <motion.div
              style={{ maxWidth: '52rem', borderTop: '1px solid rgba(26,111,212,0.12)' }}
              variants={stagger}
            >
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={m}
                  variants={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '2rem',
                    padding: '2rem 0',
                    borderBottom: '1px solid rgba(26,111,212,0.08)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '3.5rem',
                      lineHeight: 1,
                      color: 'rgba(26,111,212,0.12)',
                      flexShrink: 0,
                      width: '3.5rem',
                      textAlign: 'right',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                      lineHeight: 1.7,
                      color: 'var(--color-text-secondary)',
                      paddingTop: '0.6rem',
                    }}
                  >
                    {m}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Closing note */}
            <motion.p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                color: 'rgba(26,111,212,0.60)',
                letterSpacing: '0.08em',
                marginTop: '3rem',
              }}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Still early. Still building.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. WHY NESTURE-X
      ══════════════════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--color-surface)',
          padding: SECTION_PAD,
          borderTop: '1px solid rgba(26,111,212,0.10)',
        }}
      >
        <motion.div
          style={{ maxWidth: '52rem' }}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p className="section-label" style={{ marginBottom: '3rem' }} variants={item}>
            Why Nesture-X
          </motion.p>

          <motion.h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7vw, 7rem)',
              lineHeight: 0.88,
              color: 'var(--color-text)',
              marginBottom: '4rem',
            }}
            variants={item}
          >
            BECAUSE EVERYTHING WORKS BETTER WHEN IT&apos;S CONNECTED.
          </motion.h2>

          <motion.div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
              lineHeight: 2.1,
              color: 'var(--color-text-secondary)',
              borderLeft: '2px solid rgba(26,111,212,0.35)',
              paddingLeft: '1.5rem',
              marginBottom: '2rem',
            }}
            variants={item}
          >
            <p>Design that understands strategy.</p>
            <p>Code that respects design.</p>
            <p>Systems that reflect real-world use.</p>
          </motion.div>

          <motion.p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.9rem, 1.1vw, 0.95rem)',
              color: 'var(--color-primary)',
              letterSpacing: '0.04em',
              lineHeight: 1.8,
            }}
            variants={item}
          >
            That combination is where things start to feel complete.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. WHAT NEXT — CTA
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{ padding: SECTION_PAD }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />

        <motion.div
          className="relative z-[1] flex flex-col lg:flex-row gap-16 lg:gap-24 items-start"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left — heading */}
          <motion.div style={{ maxWidth: '32rem' }} variants={item}>
            <p className="section-label" style={{ marginBottom: '2.5rem' }}>What Next</p>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 6vw, 6.5rem)',
                lineHeight: 0.88,
                color: 'var(--color-text)',
                marginBottom: '2rem',
              }}
            >
              IF YOU&apos;RE BUILDING SOMETHING —
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                lineHeight: 1.9,
                color: 'var(--color-text-secondary)',
              }}
            >
              This is usually where a conversation helps.
            </p>
          </motion.div>

          {/* Right — steps + CTAs */}
          <motion.div style={{ maxWidth: '36rem' }} variants={stagger}>
            {/* Steps */}
            {[
              'Share the idea',
              'We explore it together',
              'Then decide what makes sense',
            ].map((step, i) => (
              <motion.div
                key={step}
                variants={item}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  paddingBottom: '2rem',
                  marginBottom: '2rem',
                  borderBottom: i < 2 ? '1px solid rgba(26,111,212,0.08)' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    lineHeight: 1,
                    color: 'rgba(26,111,212,0.15)',
                    flexShrink: 0,
                    width: '2.5rem',
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(1rem, 1.4vw, 1.1rem)',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    paddingTop: '0.4rem',
                  }}
                >
                  {step}
                </p>
              </motion.div>
            ))}

            {/* CTAs */}
            <motion.div
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}
              variants={item}
            >
              <NxButton variant="primary" size="lg" href="#contact">
                BOOK A CONSULTATION
              </NxButton>
              <NxButton variant="ghost" size="lg" href="/portfolio">
                EXPLORE OUR WORK
              </NxButton>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

    </main>
  );
}
