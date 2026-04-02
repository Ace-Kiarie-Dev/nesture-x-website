'use client';

import Link from 'next/link';
import { useBreakpoint } from '@/lib/useBreakpoint';

export default function CTA() {
  const { isMobile, isTablet } = useBreakpoint();
  const sectionPadding = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2rem' : '6rem 3rem';

  return (
    <section
      style={{
        background: '#0d1b3e',
        borderTop: '1px solid rgba(26,111,212,0.3)',
        padding: sectionPadding,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(26,111,212,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            color: '#f5f5f5',
            lineHeight: 1,
            margin: '0 0 1.5rem',
          }}
        >
          READY TO BUILD SOMETHING?
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-grotesk), sans-serif',
            fontSize: '1rem',
            color: 'rgba(245,245,245,0.5)',
            margin: '0 0 2.5rem',
          }}
        >
          Tell us what you&apos;re trying to solve. The first conversation is always free.
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <Link href="#contact" style={{ textDecoration: 'none', width: isMobile ? '100%' : undefined }}>
            <button
              data-hover
              style={{
                width: isMobile ? '100%' : undefined,
                padding: '0.85rem 2rem',
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontWeight: 600,
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f5f5f5',
                background: '#1a6fd4',
                border: 'none',
                clipPath: 'polygon(12px 0%,100% 0%,100% calc(100% - 12px),calc(100% - 12px) 100%,0% 100%,0% 12px)',
                cursor: 'pointer',
              }}
            >
              Book a Consultation
            </button>
          </Link>
          <Link href="#portfolio" style={{ textDecoration: 'none', width: isMobile ? '100%' : undefined }}>
            <button
              data-hover
              style={{
                width: isMobile ? '100%' : undefined,
                padding: '0.85rem 2rem',
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontWeight: 600,
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f5f5f5',
                background: 'transparent',
                border: '1px solid rgba(245,245,245,0.2)',
                cursor: 'pointer',
                transition: 'border-color 0.3s, color 0.3s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#1a6fd4';
                (e.currentTarget as HTMLElement).style.color = '#1a6fd4';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,245,245,0.2)';
                (e.currentTarget as HTMLElement).style.color = '#f5f5f5';
              }}
            >
              See More Work
            </button>
          </Link>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.68rem',
            color: 'rgba(245,245,245,0.3)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Nairobi, Kenya · info@nesturex.co.ke
        </div>
      </div>
    </section>
  );
}
