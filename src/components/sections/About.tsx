'use client';

import { motion } from 'framer-motion';

// ─── Animation variants ───────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const slideFromLeft = {
  hidden:  { opacity: 0, x: -56 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.7, ease } },
};

const slideFromRight = {
  hidden:  { opacity: 0, x: 56 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.7, ease } },
};

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// ─── Team data ────────────────────────────────────────────────────────────────

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

// ─── Main component ───────────────────────────────────────────────────────────

export default function About() {
  return (
    <section
      id="about"
      className="bg-[var(--color-black)] py-[clamp(4rem,8vw,7rem)] px-[clamp(1rem,4vw,3rem)]"
    >

      {/* ── Part 1: Brand Statement ─────────────────────────────────────────── */}
      <motion.div
        className="max-w-5xl mb-[clamp(4rem,8vw,6rem)]"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <p className="section-label mb-6">About Us</p>

        <h2
          className="text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] text-[var(--color-white)] mb-8"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          We build digital experiences<br className="hidden md:block" /> that hit different.
        </h2>

        <p
          className="text-[clamp(1rem,2vw,1.2rem)] text-[var(--color-white)] leading-relaxed mb-6 max-w-3xl"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Strategy, design, and code — all under one roof, all built with intention.
        </p>

        <p
          className="text-[clamp(0.875rem,1.5vw,1rem)] text-[var(--color-blue-grey)] leading-[1.8] max-w-3xl"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Nesture-X isn&apos;t just an agency — it&apos;s a creative movement built from Nairobi,
          for the world. Every pixel, every line of code, every design we ship carries intention.
          We&apos;re small enough to care deeply about every client, and skilled enough to compete
          with anyone.
        </p>
      </motion.div>

      {/* ── Part 2: The Person ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-[clamp(4rem,8vw,6rem)]">

        {/* Image — crossfades on hover */}
        <motion.div
          variants={slideFromLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] max-w-sm mx-auto md:mx-0 shadow-[0_0_0_1px_rgba(26,111,212,0.2),0_12px_48px_rgba(26,111,212,0.18)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Ace1.jpg"
              alt="Peter Kiarie"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/Ace2.jpg"
              alt="Peter Kiarie"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          variants={slideFromRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-5"
        >
          <h3
            className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-[var(--color-white)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Peter Kiarie
          </h3>

          <span
            className="inline-block text-[0.6rem] tracking-widest uppercase text-[var(--color-blue)] border border-[rgba(26,111,212,0.5)] rounded-full px-4 py-1.5 self-start"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Founder &amp; Lead Creative
          </span>

          <p
            className="text-[clamp(0.9rem,1.5vw,1.05rem)] text-[var(--color-blue-grey)] leading-[1.8]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            My journey has been one filled with curiosity, creativity, and growth. I&apos;m driven
            by a passion to express creativity through code, art, and every avenue available —
            and Nesture-X is the fullest expression of that.
          </p>
        </motion.div>

      </div>{/* /Part 2 */}

      {/* ── Part 3: The Team ────────────────────────────────────────────────── */}
      <div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2
            className="text-[clamp(2.5rem,6vw,5rem)] leading-none text-[var(--color-white)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            THE TEAM
          </h2>
          <p
            className="text-[var(--color-blue-grey)] text-sm md:text-base"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Small but mighty. Every person here carries the mission.
          </p>
        </motion.div>

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
              className="bg-[var(--color-navy)] border border-white/[0.06] rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:border-[rgba(26,111,212,0.35)] hover:shadow-[0_0_0_1px_rgba(26,111,212,0.12),0_8px_32px_rgba(26,111,212,0.18)]"
            >
              <h4
                className="text-[1.65rem] leading-none text-[var(--color-white)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {member.name}
              </h4>

              <span
                className="inline-block text-[0.55rem] tracking-widest uppercase text-[var(--color-blue)] border border-[rgba(26,111,212,0.4)] rounded-full px-3 py-1 self-start"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {member.role}
              </span>

              <p
                className="text-sm text-[var(--color-blue-grey)] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {member.bio}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>{/* /Part 3 */}

    </section>
  );
}
