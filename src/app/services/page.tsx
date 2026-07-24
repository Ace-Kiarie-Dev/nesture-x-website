import type { Metadata } from 'next';
import Services from '@/components/sections/Services';
import NxButton from '@/components/ui/NxButton';
import { CONTACT } from '@/constants';

export const metadata: Metadata = {
  title: 'Services | Nesture-X',
  description:
    "Web development, mobile apps, graphic design, print & branding, and digital marketing from Nairobi's creative technology agency.",
};

const STATS = [
  { number: '11+', label: 'Clients Served' },
  { number: '5', label: 'Equity Partners' },
  { number: '100%', label: 'Full-Stack In-House' },
  { number: '2024', label: 'Founded & Building' },
];

export default function ServicesPage() {
  return (
    <main>
      {/* ── Page Hero ── */}
      <section
        style={{
          minHeight: '40vh',
          background: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          padding: 'clamp(5rem, 10vw, 7rem) clamp(1.5rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)',
          paddingTop: 'calc(80px + clamp(2rem, 5vw, 4rem))',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid overlay */}
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          {/* Eyebrow */}
          <div
            className="section-label"
            style={{ marginBottom: '1.5rem' }}
          >
            What We Do
          </div>

          {/* Headline */}
          <h1 style={{ margin: '0 0 1.5rem', lineHeight: 0.9 }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                color: 'var(--color-text)',
                lineHeight: 0.9,
              }}
            >
              SERVICES
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                color: 'transparent',
                WebkitTextStroke: '1px var(--color-border-subtle)',
                margin: '0.2rem 0',
              }}
            >
              &amp;
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                color: 'transparent',
                WebkitTextStroke: '1px #1a6fd4',
                lineHeight: 0.9,
              }}
            >
              SOLUTIONS
            </span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontWeight: 300,
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '480px',
              marginTop: '1.5rem',
              margin: 0,
            }}
          >
            We solve problems with design and code.
            <br />
            Here&apos;s what that looks like in practice.
          </p>
        </div>
      </section>

      {/* ── Services Interactive Section ── */}
      <Services />

      {/* ── Stats Strip ── */}
      <section style={{ background: 'var(--color-surface)', padding: 'clamp(3rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3rem)' }}>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: '1px', background: 'rgba(26,111,212,0.1)' }}
        >
          {STATS.map(stat => (
            <div
              key={stat.label}
              style={{
                background: 'var(--color-surface)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-bebas), sans-serif',
                  fontSize: '3.5rem',
                  color: '#1a6fd4',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '0.65rem',
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section
        style={{
          background: 'var(--color-bg-secondary)',
          padding: 'clamp(3rem, 8vw, 5rem) clamp(1.5rem, 5vw, 3rem)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(26,111,212,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'var(--color-text)',
              lineHeight: 1,
              margin: '0 0 1rem',
            }}
          >
            READY TO START?
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontWeight: 300,
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2rem',
            }}
          >
            Tell us what you need. We&apos;ll tell you how to build it.
          </p>

          <NxButton variant="primary" size="lg" href="/#contact">
            Book a Free Consultation
          </NxButton>

          <p
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '0.68rem',
              color: 'var(--color-text-faint)',
              letterSpacing: '0.1em',
              marginTop: '2rem',
            }}
          >
            {CONTACT.phoneDisplay} &nbsp;·&nbsp; {CONTACT.email} &nbsp;·&nbsp; {CONTACT.location}
          </p>
        </div>
      </section>
    </main>
  );
}
