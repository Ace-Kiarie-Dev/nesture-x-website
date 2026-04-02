'use client';

import { useEffect, useRef } from 'react';
import { useBreakpoint } from '@/lib/useBreakpoint';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description:
      "We interrogate the brief. What's the actual problem? What does success look like? We don't start building until we know.",
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Strategy meets aesthetics. Every design decision has a reason behind it — from colour choices to user flows.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Clean, production-grade code. Responsive. Fast. Secure. With payment integrations, backends, and APIs that work as designed.',
  },
  {
    number: '04',
    title: 'Launch & Grow',
    description:
      "We deploy, monitor, and stay engaged. We grow when you grow — that's not a slogan, it's how our equity partnerships work.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const sectionPadding = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2rem' : '6rem 3rem';

  const gridCols = isMobile
    ? '1fr'
    : isTablet
    ? 'repeat(2, 1fr)'
    : 'repeat(4, 1fr)';

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.reveal');
    if (!cards) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: '#111318', padding: sectionPadding }}>
      <div style={{ marginBottom: isMobile ? '2rem' : '4rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>How We Work</div>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: '#f5f5f5',
            lineHeight: 1,
            margin: 0,
          }}
        >
          THE PROCESS
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: '1px',
          background: 'rgba(26,111,212,0.1)',
        }}
      >
        {STEPS.map(step => (
          <StepCard key={step.number} isMobile={isMobile} {...step} />
        ))}
      </div>
    </section>
  );
}

function StepCard({
  number,
  title,
  description,
  isMobile,
}: {
  number: string;
  title: string;
  description: string;
  isMobile: boolean;
}) {
  const accentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="reveal"
      style={{
        background: '#111318',
        padding: isMobile ? '1.5rem' : '2.5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => {
        if (accentRef.current) accentRef.current.style.height = '100%';
      }}
      onMouseLeave={() => {
        if (accentRef.current) accentRef.current.style.height = '0';
      }}
    >
      <div
        ref={accentRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '3px',
          height: '0',
          background: '#1a6fd4',
          transition: 'height 0.5s ease',
        }}
      />
      <div
        style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: '4rem',
          color: 'rgba(26,111,212,0.12)',
          lineHeight: 1,
          marginBottom: '1.5rem',
        }}
      >
        {number}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-grotesk), sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          color: '#f5f5f5',
          marginBottom: '0.75rem',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-grotesk), sans-serif',
          fontWeight: 400,
          fontSize: '0.82rem',
          color: 'rgba(245,245,245,0.5)',
          lineHeight: 1.7,
        }}
      >
        {description}
      </div>
    </div>
  );
}
