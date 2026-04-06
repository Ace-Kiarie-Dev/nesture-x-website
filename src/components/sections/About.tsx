'use client';

import { motion } from 'framer-motion';

// ─── Animation variants ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden:   { opacity: 0, y: 30 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// Stagger container for bio elements (name → badge → text)
const bioContainerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const bioItemVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

// ─── Clip-path shared constant ─────────────────────────────────────────────────

const CLIP = 'polygon(0% 0%, 92% 0%, 100% 8%, 100% 100%, 8% 100%, 0% 92%)';

// ─── Team data ─────────────────────────────────────────────────────────────────

const TEAM = [
  {
    name: 'Peter Kiarie',
    role: 'Founder & Lead Creative',
    bio:  'Design, development, and strategy. The vision and the execution.',
  },
  {
    name: 'Winrahab Kamande',
    role: 'Partner & Brand Director',
    bio:  'Client relations, brand identity, and the heart of Rar Ray Bakes.',
  },
  {
    name: 'Claude (AI)',
    role: 'AI Backbone',
    bio:  'Always on, never sleeps. The engine behind the speed.',
  },
];

// ─── Main component ────────────────────────────────────────────────────────────

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[var(--color-bg)]"
    >

      {/* FIX 1 — Grid overlay behind all content */}
      <div
        className="grid-overlay absolute inset-0 z-0 pointer-events-none"
        aria-hidden
      />

      {/* Content wrapper — sits above overlay */}
      <div className="relative z-[1] px-6 md:px-12 lg:px-20">

        {/* ── Part 1: Brand Statement ──────────────────────────────── */}
        <motion.div
          className="pt-24 pb-16 max-w-[720px]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* FIX 2 — Section label */}
          <p className="section-label mb-6">About Us</p>

          {/* Headline */}
          <h2
            className="text-[clamp(3.5rem,6vw,6rem)] leading-[0.92] text-[var(--color-text)] mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            We build digital experiences<br className="hidden md:block" /> that hit different.
          </h2>

          {/* Subheading */}
          <p
            className="text-[1.1rem] font-medium text-[var(--color-text)] mb-4"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Strategy, design, and code — all under one roof, all built with intention.
          </p>

          {/* Body */}
          <p
            className="text-[1rem] font-light leading-[1.7] max-w-[580px] text-[rgba(245,245,245,0.60)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Nesture-X isn&apos;t just an agency — it&apos;s a creative movement built from Nairobi,
            for the world. Every pixel, every line of code, every design we ship carries intention.
            We&apos;re small enough to care deeply about every client, and skilled enough to compete
            with anyone.
          </p>
        </motion.div>

        {/* ── Part 2: Peter — two-column layout ───────────────────── */}
        <motion.div
          className="flex flex-col md:flex-row gap-16 lg:gap-24 items-start"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >

          {/* LEFT — image (40%) */}
          <div className="w-full md:w-[40%] flex-shrink-0">
            {/* FIX 3 — Image wrapper with accent + clip-path */}
            <div
              className="relative"
              style={{ maxWidth: '320px', aspectRatio: '3 / 4' }}
            >
              {/* Blue accent layer — behind image, offset 6 × 6 px */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: CLIP,
                  background: 'rgba(26,111,212,0.25)',
                  transform: 'translate(6px, 6px)',
                }}
              />

              {/* Clipped image container — hover group */}
              <div
                className="group absolute inset-0 overflow-hidden"
                style={{ clipPath: CLIP }}
              >
                {/* Base image — fades out on hover */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Ace1.jpg"
                  alt="Peter Kiarie"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                />
                {/* Hover image — fades in on hover */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Ace2.jpg"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                />
              </div>
            </div>
          </div>

          {/* RIGHT — Bio (60%) */}
          <motion.div
            className="w-full md:w-[60%] pt-8 flex flex-col"
            variants={bioContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* FIX 3 — Name */}
            <motion.h3
              className="text-[3.5rem] leading-[0.92] text-[var(--color-text)] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
              variants={bioItemVariants}
            >
              PETER KIARIE
            </motion.h3>

            {/* FIX 3 — Badge — sharp corners, no border-radius */}
            <motion.span
              className="inline-block text-[0.68rem] tracking-[0.15em] uppercase text-[var(--color-primary)] border border-[rgba(26,111,212,0.40)] bg-[rgba(26,111,212,0.08)] px-[0.85rem] py-[0.35rem] mb-6 self-start"
              style={{ fontFamily: 'var(--font-mono)' }}
              variants={bioItemVariants}
            >
              Founder &amp; Lead Creative
            </motion.span>

            {/* FIX 3 — Bio text */}
            <motion.p
              className="text-[1rem] font-light leading-[1.7] max-w-[480px] text-[rgba(245,245,245,0.60)]"
              style={{ fontFamily: 'var(--font-body)' }}
              variants={bioItemVariants}
            >
              My journey has been one filled with curiosity, creativity, and growth. I&apos;m driven
              by a passion to express creativity through code, art, and every avenue available —
              and Nesture-X is the fullest expression of that.
            </motion.p>
          </motion.div>

        </motion.div>{/* /Part 2 */}

        {/* ── Part 3: The Team ─────────────────────────────────────── */}
        <div className="pt-16 pb-[clamp(4rem,8vw,7rem)]">

          {/* FIX 4 — "OUR PEOPLE" label + "THE TEAM" heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="section-label mb-4">Our People</p>

            <h2
              className="text-[clamp(2.5rem,6vw,5rem)] leading-none text-[var(--color-text)] mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              THE TEAM
            </h2>

            <p
              className="text-sm md:text-base text-[rgba(245,245,245,0.60)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Small but mighty. Every person here carries the mission.
            </p>
          </motion.div>

          {/* Team cards — sharp corners, brand-correct backgrounds */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {TEAM.map(member => (
              <motion.div
                key={member.name}
                variants={cardVariants}
                className="bg-[var(--color-surface)] border border-white/[0.06] p-6 flex flex-col gap-4 transition-all duration-300 hover:border-[rgba(26,111,212,0.35)] hover:shadow-[0_0_0_1px_rgba(26,111,212,0.12),0_8px_32px_rgba(26,111,212,0.18)]"
              >
                <h4
                  className="text-[1.65rem] leading-none text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {member.name}
                </h4>

                {/* Badge — sharp corners */}
                <span
                  className="inline-block text-[0.55rem] tracking-widest uppercase text-[var(--color-primary)] border border-[rgba(26,111,212,0.4)] px-3 py-1 self-start"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {member.role}
                </span>

                <p
                  className="text-sm leading-relaxed text-[rgba(245,245,245,0.60)]"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>{/* /Part 3 */}

      </div>{/* /content wrapper */}

    </section>
  );
}
