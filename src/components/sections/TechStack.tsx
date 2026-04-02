'use client';

import { useBreakpoint } from '@/lib/useBreakpoint';

const FEATURED = [
  'React',
  'Node.js',
  'MongoDB Atlas',
  'M-Pesa Daraja API',
  'Railway',
  'Netlify',
  'Vercel',
];

const REGULAR = [
  'Express.js',
  'Vanilla JavaScript',
  'HTML5/CSS3',
  'Tailwind CSS',
  'React Native',
  'Framer Motion',
  'Bootstrap 5',
  'Vite',
  'Firebase',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'GitHub',
  'WhatsApp Business API',
];

export default function TechStack() {
  const { isMobile, isTablet } = useBreakpoint();
  const sectionPadding = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2rem' : '6rem 3rem';

  return (
    <section style={{ background: '#0a0a0a', padding: sectionPadding }}>
      <div style={{ marginBottom: '3rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>Technologies</div>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: '#f5f5f5',
            lineHeight: 1,
            margin: 0,
          }}
        >
          THE STACK
        </h2>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {FEATURED.map(tech => (
          <Pill key={tech} label={tech} featured isMobile={isMobile} />
        ))}
        {REGULAR.map(tech => (
          <Pill key={tech} label={tech} featured={false} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}

function Pill({ label, featured, isMobile }: { label: string; featured: boolean; isMobile: boolean }) {
  return (
    <span
      data-hover
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: isMobile ? '0.65rem' : '0.72rem',
        letterSpacing: '0.08em',
        border: featured ? '1px solid rgba(26,111,212,0.5)' : '1px solid rgba(26,111,212,0.2)',
        padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
        color: featured ? '#1a6fd4' : 'rgba(245,245,245,0.6)',
        cursor: 'default',
        transition: 'border-color 0.3s, color 0.3s, background 0.3s',
        display: 'inline-block',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = '#1a6fd4';
        el.style.color = '#f5f5f5';
        el.style.background = 'rgba(26,111,212,0.1)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = featured ? 'rgba(26,111,212,0.5)' : 'rgba(26,111,212,0.2)';
        el.style.color = featured ? '#1a6fd4' : 'rgba(245,245,245,0.6)';
        el.style.background = 'transparent';
      }}
    >
      {label}
    </span>
  );
}
