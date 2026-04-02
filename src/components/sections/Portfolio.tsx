'use client';

import { useState } from 'react';

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

  const filtered = activeCategory === 'All'
    ? CARDS
    : CARDS.filter(c => c.category === activeCategory);

  return (
    <section
      id="portfolio"
      style={{ background: '#111318', padding: '6rem 3rem' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          Selected Work
        </div>
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

      {/* Category tabs */}
      <div
        style={{
          display: 'flex',
          gap: '2rem',
          borderBottom: '1px solid rgba(26,111,212,0.15)',
          marginBottom: '2rem',
        }}
      >
        {CATEGORIES.map(cat => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-hover
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid #1a6fd4' : '2px solid transparent',
                marginBottom: '-1px',
                padding: '0.5rem 0',
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: active ? '#1a6fd4' : 'rgba(245,245,245,0.4)',
                cursor: 'pointer',
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
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(26,111,212,0.1)',
        }}
      >
        {filtered.map(card => (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              gridRow: card.tall ? 'span 2' : 'span 1',
              aspectRatio: card.tall ? undefined : '4/3',
              background: card.bg,
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              minHeight: card.tall ? '400px' : undefined,
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

            {/* Hover overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)',
                opacity: hoveredCard === card.id ? 1 : 0,
                transition: 'opacity 0.4s',
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
        ))}
      </div>
    </section>
  );
}
