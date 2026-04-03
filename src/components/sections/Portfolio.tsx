'use client';

import { useState } from 'react';
import { useBreakpoint } from '@/lib/useBreakpoint';

const CATEGORIES = ['All', 'Web Projects', 'Brand Identity', 'Print Design', 'Originals'];

const CARDS = [
  { id: 1, title: 'Vicking Ventures', category: 'Web Projects', ghost: 'VV', tall: true, bg: 'linear-gradient(135deg,#0d1b3e 0%,#0a0a0a 100%)' },
  { id: 2, title: 'ODU Active', category: 'Web Projects', ghost: 'ODU', tall: false, bg: 'linear-gradient(135deg,#111318 0%,#0a0a0a 100%)' },
  { id: 3, title: 'Shinkusen', category: 'Brand Identity', ghost: 'SHN', tall: false, bg: 'linear-gradient(135deg,#0a0a0a 0%,#141920 100%)' },
  { id: 4, title: 'MR Right Imports', category: 'Web Projects', ghost: 'MR', tall: false, bg: 'linear-gradient(135deg,#141920 0%,#0d1b3e 100%)' },
  { id: 5, title: 'NX Originals', category: 'Originals', ghost: 'NX', tall: true, bg: 'linear-gradient(135deg,#0d1b3e 0%,#111318 100%)' },
  { id: 6, title: 'Brand Collateral', category: 'Print Design', ghost: 'PRINT', tall: false, bg: 'linear-gradient(135deg,#111318 0%,#0a0a0a 100%)' },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  const filtered = activeCategory === 'All'
    ? CARDS
    : CARDS.filter(c => c.category === activeCategory);

  const gridCols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
  const sectionPadding = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2rem' : '6rem 3rem';

  return (
    <section id="portfolio" style={{ background: 'rgba(17,19,24,0.92)', padding: sectionPadding }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>Selected Work</div>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: '#f5f5f5',
            lineHeight: 1,
            margin: 0,
          }}
        >
          OUR WORK
        </h2>
      </div>

      {/* Category tabs — scrollable on mobile */}
      <div
        style={{
          overflowX: isMobile ? 'auto' : 'visible',
          scrollbarWidth: 'none',
          display: 'flex',
          gap: isMobile ? '0' : '2rem',
          borderBottom: '1px solid rgba(26,111,212,0.15)',
          marginBottom: '2rem',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        {CATEGORIES.map(cat => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-hover
              style={{
                flexShrink: 0,
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid #1a6fd4' : '2px solid transparent',
                marginBottom: '-1px',
                padding: isMobile ? '0.5rem 0.75rem' : '0.5rem 0',
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: active ? '#1a6fd4' : 'rgba(245,245,245,0.4)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Portfolio grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: '1px',
          background: 'rgba(26,111,212,0.1)',
        }}
      >
        {filtered.map(card => {
          const isTall = !isMobile && card.tall;
          const overlayVisible = isMobile || hoveredCard === card.id;

          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                gridRow: isTall ? 'span 2' : 'span 1',
                aspectRatio: isTall ? undefined : '4/3',
                background: card.bg,
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                minHeight: isTall ? '400px' : undefined,
              }}
            >
              {/* Ghost text */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: '5rem',
                  color: 'rgba(26,111,212,0.08)',
                  userSelect: 'none',
                  letterSpacing: '0.1em',
                }}
              >
                {card.ghost}
              </div>

              {/* Blue dot accent */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#1a6fd4',
                }}
              />

              {/* Overlay — always visible on mobile, hover on desktop */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)',
                  opacity: overlayVisible ? 1 : 0,
                  transition: isMobile ? 'none' : 'opacity 0.4s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '0.6rem',
                    color: '#1a6fd4',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: '0.4rem',
                  }}
                >
                  {card.category}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-bebas), sans-serif',
                    fontSize: '1.6rem',
                    color: '#f5f5f5',
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-grotesk), sans-serif',
                    fontSize: '0.78rem',
                    color: '#1a6fd4',
                  }}
                >
                  View →
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
