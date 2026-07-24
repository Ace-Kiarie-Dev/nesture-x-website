'use client';

import { useBreakpoint } from '@/lib/useBreakpoint';

const PARTNERS = [
  { name: 'Rar Ray Bakes', industry: 'Bakery · Food' },
  { name: 'MR Right Imports', industry: 'Imports · Fitness Equipment' },
  { name: 'Joyspark Enterprises', industry: 'Décor · Events' },
  { name: 'Vicking Ventures', industry: 'Tours · Travel' },
  { name: 'ODU Fitness', industry: 'Fitness · Coaching' },
];

export default function Partners() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const sectionPadding = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2rem' : '6rem 3rem';

  const partnerCols = isMobile
    ? '1fr'
    : isTablet
    ? 'repeat(3, 1fr)'
    : 'repeat(5, 1fr)';

  return (
    <section style={{ background: 'var(--color-bg)', padding: sectionPadding }}>
      {/* Two-column intro — stacks on mobile/tablet */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: isDesktop ? '4rem' : '2rem',
          marginBottom: '4rem',
          alignItems: 'end',
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: '1rem' }}>Portfolio Companies</div>
          <h2
            style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              color: 'var(--color-text)',
              lineHeight: 1,
              margin: 0,
            }}
          >
            NX EQUITY PARTNERS
          </h2>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-grotesk), sans-serif',
            fontWeight: 300,
            fontSize: '1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          We don&apos;t just build for clients — we co-own businesses. These are
          the brands where Nesture-X holds equity stakes, builds the technology,
          and grows alongside the founders.
        </p>
      </div>

      {/* Partners grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: partnerCols,
          gap: '1px',
          background: 'rgba(26,111,212,0.1)',
        }}
      >
        {PARTNERS.map(partner => (
          <PartnerCard key={partner.name} {...partner} />
        ))}
      </div>
    </section>
  );
}

function PartnerCard({ name, industry }: { name: string; industry: string }) {
  return (
    <div
      data-hover
      style={{
        background: 'var(--color-bg)',
        padding: '2rem 1.5rem',
        transition: 'background 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(26,111,212,0.06)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)';
      }}
    >
      <div
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          color: '#1a6fd4',
          border: '1px solid rgba(26,111,212,0.4)',
          padding: '0.2rem 0.5rem',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}
      >
        NX Partner
      </div>
      <div
        style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: '1.5rem',
          color: 'var(--color-text)',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-grotesk), sans-serif',
          fontSize: '0.72rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {industry}
      </div>
    </div>
  );
}
