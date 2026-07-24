'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBreakpoint } from '@/lib/useBreakpoint';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const SOLUTIONS = [
  {
    title: 'Custom Business Systems',
    description:
      "Running your business on spreadsheets and WhatsApp? We build the custom system that runs it — like Kikota, our gym-management SaaS.",
  },
  {
    title: 'Payment Integration',
    description:
      'Take payments the way Kenya actually pays. M-Pesa STK Push, end to end — plus secure card payments when you need them.',
  },
  {
    title: 'Booking & Scheduling',
    description:
      'Let clients book you automatically — live availability, slot management, and confirmations handled without the back-and-forth.',
  },
  {
    title: 'E-Commerce',
    description:
      'Sell online, end to end — storefront, cart, checkout, and order management. Built and proven on SHINKUSEN.',
  },
  {
    title: 'Secure Access',
    description:
      'Logins and protected admin areas done right — role-based access and secure authentication for you and your team.',
  },
  {
    title: 'Brand & Web Presence',
    description:
      'Identity, design, and a site that proves you belong — the full brand presence, not just a page on the internet.',
  },
];

export default function Solutions() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const sectionPadding = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2rem' : '7rem 3rem';

  return (
    <section style={{ background: 'var(--color-bg)', padding: sectionPadding }}>
      <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {/* Header */}
        <motion.div variants={item} style={{ marginBottom: isMobile ? '2rem' : '3rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>What We Solve</div>
          <h2
            style={{
              fontFamily: 'var(--font-display), sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'var(--color-text)',
              lineHeight: 1,
              margin: 0,
            }}
          >
            SOLUTIONS, NOT JUST SOFTWARE.
          </h2>
        </motion.div>

        {/* Intro line */}
        <motion.p
          variants={item}
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontWeight: 300,
            fontSize: '1rem',
            color: 'rgba(245,245,245,0.6)',
            lineHeight: 1.8,
            maxWidth: '620px',
            marginBottom: isMobile ? '2rem' : '3rem',
            borderLeft: '2px solid rgba(26,111,212,0.3)',
            paddingLeft: '1rem',
          }}
        >
          You don&apos;t need a stack — you need the problem solved. Here&apos;s what we build for businesses.
        </motion.p>

        {/* Solutions grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
            gap: '0.6rem',
            marginBottom: isMobile ? '2.5rem' : '3.5rem',
          }}
        >
          {SOLUTIONS.map(solution => (
            <motion.div key={solution.title} variants={item}>
              <SolutionRow title={solution.title} description={solution.description} />
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          variants={item}
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
            color: 'var(--color-text)',
            lineHeight: 1.6,
            borderTop: '1px solid rgba(26,111,212,0.15)',
            paddingTop: '2rem',
            margin: 0,
          }}
        >
          Have a problem that doesn&apos;t fit a box? That&apos;s our favourite kind.
        </motion.p>
      </motion.div>
    </section>
  );
}

function SolutionRow({ title, description }: { title: string; description: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.25rem',
        height: '100%',
        border: `1px solid ${hovered ? 'rgba(26,111,212,0.3)' : 'rgba(26,111,212,0.1)'}`,
        background: hovered ? 'rgba(26,111,212,0.06)' : 'rgba(26,111,212,0.02)',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.3s ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '0.9rem',
          color: 'var(--color-primary)',
          flexShrink: 0,
          lineHeight: 1.7,
        }}
      >
        →
      </span>
      <div>
        <div
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--color-text)',
            marginBottom: '0.4rem',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body), sans-serif',
            fontWeight: 300,
            fontSize: '0.82rem',
            color: 'rgba(245,245,245,0.6)',
            lineHeight: 1.7,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
