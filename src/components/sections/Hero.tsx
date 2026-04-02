'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from '@/components/ui/ParticleCanvas';
import NxButton from '@/components/ui/NxButton';
import { useBreakpoint } from '@/lib/useBreakpoint';

const TYPED_PHRASES = [
  'for tourism brands',
  'for fitness coaches',
  'for logistics companies',
  'end-to-end, M-Pesa included',
  'for the Nairobi hustle',
];

export default function Hero() {
  const { isMobile, isTablet } = useBreakpoint();
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPED_PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typedText.length < phrase.length) {
        timeout = setTimeout(() => setTypedText(phrase.slice(0, typedText.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else {
      if (typedText.length > 0) {
        timeout = setTimeout(() => setTypedText(typedText.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % TYPED_PHRASES.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex]);

  const headlineFontSize = isMobile
    ? 'clamp(3.5rem, 15vw, 5rem)'
    : isTablet
    ? 'clamp(4rem, 10vw, 7rem)'
    : 'clamp(5rem, 12vw, 11rem)';

  const sectionPadding = isMobile ? '0 1.5rem' : isTablet ? '0 2rem' : '0 3rem';

  const headlineLines = [
    { text: 'CREATE.', outline: false },
    { text: 'DISCOVER.', outline: true },
    { text: 'EXPLORE.', outline: false },
  ];

  const stats = [
    { number: '11+', label: 'Clients Served' },
    { number: '5', label: 'Equity Partners' },
    { number: '100%', label: 'Full-Stack Capable' },
  ];

  return (
    <section
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: sectionPadding,
        background: '#0a0a0a',
      }}
    >
      {/* z-0: Particle field */}
      <ParticleCanvas />

      {/* z-1: Grid overlay */}
      <div
        className="grid-overlay"
        style={{ position: 'absolute', inset: 0, zIndex: 1 }}
      />

      {/* z-2: Hero content */}
      <div style={{ position: 'relative', zIndex: 2, maxWidth: isMobile ? '100%' : '700px' }}>
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <span style={{ display: 'block', width: '24px', height: '1px', background: '#1a6fd4', flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.72rem',
              color: '#1a6fd4',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Nairobi · Kenya · Est. 2024
          </span>
        </div>

        {/* Headline */}
        <h1 style={{ margin: 0, lineHeight: 0.92 }}>
          {headlineLines.map((line, i) => (
            <motion.span
              key={line.text}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 + 0.1, ease: 'easeOut' }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: headlineFontSize,
                lineHeight: 0.92,
                color: line.outline ? 'transparent' : '#f5f5f5',
                WebkitTextStroke: line.outline ? '1px #1a6fd4' : undefined,
              }}
            >
              {line.text}
            </motion.span>
          ))}
        </h1>

        {/* Subheading with typed text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ marginTop: '2rem', borderLeft: '2px solid #1a6fd4', paddingLeft: '1rem' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontWeight: 300,
              fontSize: isMobile ? '0.9rem' : '1.05rem',
              color: 'rgba(245,245,245,0.65)',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            We don&apos;t make products. We build solutions —{' '}
            <span>{typedText}</span>
            <span
              style={{
                display: 'inline-block',
                width: '3px',
                height: '1em',
                background: '#1a6fd4',
                verticalAlign: 'middle',
                marginLeft: '2px',
                animation: 'blink 0.8s infinite',
              }}
            />
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1rem',
            marginTop: '2.5rem',
          }}
        >
          <NxButton
            variant="primary"
            size="lg"
            href="#contact"
            className={isMobile ? 'w-full' : ''}
          >
            Book a Consultation
          </NxButton>
          <NxButton
            variant="ghost"
            size="lg"
            href="#portfolio"
            className={isMobile ? 'w-full' : ''}
          >
            View Our Work
          </NxButton>
        </motion.div>
      </div>

      {/* Stats strip — hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            right: isTablet ? '2rem' : '3rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            textAlign: 'right',
          }}
        >
          {stats.map(stat => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: isTablet ? '2rem' : '2.8rem',
                  color: '#1a6fd4',
                  lineHeight: 1,
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: isTablet ? '0.55rem' : '0.6rem',
                  color: 'rgba(245,245,245,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginTop: '0.3rem',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scroll hint — hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: isTablet ? '2rem' : '3rem',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.65rem',
              color: 'rgba(245,245,245,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Scroll to explore
          </span>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(26,111,212,0.2)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#1a6fd4',
                animation: 'scrollLine 2s infinite',
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
