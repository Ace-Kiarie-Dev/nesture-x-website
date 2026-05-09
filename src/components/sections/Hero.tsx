'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NxButton from '@/components/ui/NxButton';
import { useBreakpoint } from '@/lib/useBreakpoint';

const TYPED_PHRASES = [
  'for tourism brands',
  'for fitness coaches',
  'for logistics companies',
  'end-to-end, M-Pesa included',
  'for the Nairobi hustle',
];

const APP_CARDS = [
  { name: 'BetLedger',       platform: 'Mobile App',     tagline: 'Bet tracking & analytics', status: 'Awaiting Deployment' },
  { name: 'Hikarani',        platform: 'Cross Platform', tagline: 'Faith & community app',    status: 'In Development'      },
  { name: 'Kikota',          platform: 'Web App · SaaS', tagline: 'Gym management SaaS',      status: 'In Development'      },
  { name: 'No-Snooze Alarm', platform: 'Mobile App',     tagline: "You can't snooze this",    status: 'In Development'      },
];

// Absolute px positions + 3D rotations within the cluster container.
// 2-column grid: left col (0) and right col (250), rows aligned on the same top values.
const CARD_META = [
  { top:   0, left:   0, rotateX:  8, rotateY: -12, translateZ: 20 }, // left  row 1
  { top:   0, left: 250, rotateX: -6, rotateY:  10, translateZ: 10 }, // right row 1
  { top: 180, left:   0, rotateX: 10, rotateY:  -8, translateZ: 30 }, // left  row 2
  { top: 180, left: 250, rotateX: -8, rotateY:  12, translateZ:  5 }, // right row 2
];

function statusColor(status: string): string {
  if (status === 'Awaiting Deployment') return 'var(--color-text)';
  if (status === 'In Development')      return 'var(--color-primary)';
  if (status === 'Coming Soon')         return 'rgba(245,245,245,0.4)';
  return 'rgba(245,245,245,0.25)';
}

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
  const sidePad        = isTablet ? '2rem' : '3rem';

  const headlineLines = [
    { text: 'CREATE.',   outline: false },
    { text: 'DISCOVER.', outline: true  },
    { text: 'EXPLORE.',  outline: false },
  ];

  const stats = [
    { number: '11+',  label: 'Clients Served'    },
    { number: '5',    label: 'Equity Partners'    },
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
        justifyContent: 'space-between',
        padding: sectionPadding,
        background: 'rgba(10,10,10,0.93)',
      }}
    >
      {/* z-1: Grid overlay */}
      <div className="grid-overlay" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* z-2: Left — Hero text content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: '0 1 600px',
          maxWidth: isMobile ? '100%' : isTablet ? '50%' : '52%',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <span style={{ display: 'block', width: '24px', height: '1px', background: 'var(--color-primary)', flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.72rem',
              color: 'var(--color-primary)',
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
                color: line.outline ? 'transparent' : 'var(--color-text)',
                WebkitTextStroke: line.outline ? '1px var(--color-primary)' : undefined,
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
          style={{ marginTop: '2rem', borderLeft: '2px solid var(--color-primary)', paddingLeft: '1rem' }}
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
                background: 'var(--color-primary)',
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
          <NxButton variant="primary" size="lg" href="/booking" className={isMobile ? 'w-full' : ''}>
            Book a Consultation
          </NxButton>
          <NxButton variant="ghost" size="lg" href="#portfolio" className={isMobile ? 'w-full' : ''}>
            View Our Work
          </NxButton>
        </motion.div>
      </div>

      {/* z-2: Right — NX Originals label + 3D App Cards cluster (desktop + tablet only) */}
      {!isMobile && (
        <motion.div
          className="hidden md:flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position: 'relative',
            zIndex: 2,
            flexShrink: 0,
            gap: '1.75rem',
            alignItems: 'flex-start',
          }}
        >
          {/* NX Originals label — centered over the full cluster width */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '460px' }}>
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '1px',
                background: 'var(--color-primary)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              NX Originals
            </span>
          </div>

          {/* Perspective container */}
          <div style={{ width: '460px', height: '360px', perspective: '800px' }}>
          {/* Breathing container — slow rotateY oscillation */}
          <motion.div
            animate={{ rotateY: [-5, 5, -5] }}
            transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
            style={{
              position: 'relative',
              width: '460px',
              height: '360px',
              transformStyle: 'preserve-3d',
            }}
          >
            {APP_CARDS.map((card, i) => {
              const meta = CARD_META[i];
              return (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.12 }}
                  whileHover={{
                    translateZ: meta.translateZ + 40,
                    scale: 1.06,
                    borderColor: 'var(--color-primary)',
                    boxShadow: '0 0 24px rgba(26,111,212,0.4)',
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }}
                  style={{
                    position: 'absolute',
                    top: meta.top,
                    left: meta.left,
                    width: '200px',
                    height: '120px',
                    minHeight: '120px',
                    rotateX: meta.rotateX,
                    rotateY: meta.rotateY,
                    translateZ: meta.translateZ,
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(26,111,212,0.25)',
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                    overflow: 'hidden',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                  }}
                >
                  {/* ROW 1 — App name */}
                  <div
                    style={{
                      fontFamily: 'var(--font-bebas), sans-serif',
                      fontSize: '1.3rem',
                      color: 'var(--color-text)',
                      lineHeight: 1,
                    }}
                  >
                    {card.name}
                  </div>

                  {/* ROW 2 — Platform tag */}
                  <div
                    style={{
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '0.55rem',
                      color: 'var(--color-primary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {card.platform}
                  </div>

                  {/* ROW 3 — One-liner */}
                  <div
                    style={{
                      fontFamily: 'var(--font-grotesk), sans-serif',
                      fontSize: '0.65rem',
                      color: 'rgba(245,245,245,0.5)',
                      lineHeight: 1.3,
                    }}
                  >
                    {card.tagline}
                  </div>

                  {/* ROW 4 — Status (pushed to bottom) */}
                  <div
                    style={{
                      marginTop: 'auto',
                      fontFamily: 'var(--font-jetbrains), monospace',
                      fontSize: '0.55rem',
                      color: statusColor(card.status),
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {card.status}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
          </div>
        </motion.div>
      )}

      {/* Stats strip — in-flow flex child on the right, hidden on mobile */}
      {!isMobile && (
        <div
          style={{
            flexShrink: 0,
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
                  color: 'var(--color-primary)',
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
            left: sidePad,
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
                background: 'var(--color-primary)',
                animation: 'scrollLine 2s infinite',
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
