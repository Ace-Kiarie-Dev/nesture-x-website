'use client';

import { useBreakpoint } from '@/lib/useBreakpoint';

const ITEMS = [
  'Web Development',
  'Brand Identity',
  'M-Pesa Integration',
  'Digital Marketing',
  'Full-Stack Applications',
  'Graphic Design',
  'Nairobi Made',
  'World Class',
];

export default function MarqueeStrip() {
  const { isMobile } = useBreakpoint();
  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      style={{
        borderTop: '1px solid rgba(26,111,212,0.2)',
        borderBottom: '1px solid rgba(26,111,212,0.2)',
        background: 'rgba(26,111,212,0.04)',
        padding: '1.2rem 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '2rem' : '2rem',
          animation: 'marquee 20s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
        }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '2rem' : '2rem', flexShrink: 0 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: isMobile ? '0.85rem' : '1rem',
                letterSpacing: '0.15em',
                color: 'var(--color-text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {item}
            </span>
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#1a6fd4',
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
