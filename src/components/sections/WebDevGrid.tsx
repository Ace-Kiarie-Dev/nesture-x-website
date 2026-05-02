'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useBreakpoint } from '@/lib/useBreakpoint';

interface DevProject {
  name: string;
  image: string | null;
  url: string | null;
  industry: string;
  comingSoon?: boolean;
}

const DEV_PROJECTS: DevProject[] = [
  {
    name: 'MegaJackpot Predictions',
    image: '/images/megajp.png',
    url: 'https://megajackpot-predicitions.netlify.app/',
    industry: 'Sports & Betting',
  },
  {
    name: 'ShadowScope',
    image: '/images/shadowscope.png',
    url: 'https://shadowscope.netlify.app/',
    industry: 'Mystery Shopping',
  },
  {
    name: 'Zaidi Movers',
    image: '/images/zaidi.png',
    url: 'https://zaidi-movers.netlify.app/',
    industry: 'Logistics',
  },
  {
    name: 'Gucha Youth FC',
    image: '/images/gutcha.png',
    url: 'https://gutcha-youth.netlify.app/',
    industry: 'Sports & Community',
  },
  {
    name: 'Fit Track',
    image: '/images/fit.png',
    url: 'https://fit-track-fitii.netlify.app/',
    industry: 'Health & Fitness',
  },
  {
    name: 'ODU Active',
    image: '/images/odu.png',
    url: 'https://www.oduactive.com/',
    industry: 'Fitness Coaching',
  },
  {
    name: 'Vicking Ventures',
    image: null,
    url: null,
    industry: 'Tours & Travel',
    comingSoon: true,
  },
];

function DevCard({ project, isMobile }: { project: DevProject; isMobile: boolean }) {
  const [hovered, setHovered] = useState(false);
  const isComingSoon = !!project.comingSoon;
  const isFullWidth = isComingSoon && !isMobile;

  const inner = (
    <div
      onMouseEnter={() => { if (!isComingSoon) setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        height: '320px',
        overflow: 'hidden',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: hovered ? 'var(--color-primary)' : 'rgba(26,111,212,0.2)',
        boxShadow: hovered ? '0 8px 32px rgba(26,111,212,0.2)' : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Background: screenshot image or gradient placeholder */}
      {project.image ? (
        <Image
          src={project.image}
          alt={project.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg))',
          }}
        />
      )}

      {/* Coming soon badge — top right */}
      {isComingSoon && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            border: '1px solid var(--color-primary)',
            padding: '0.25rem 0.65rem',
            background: 'rgba(10,10,10,0.8)',
            zIndex: 2,
          }}
        >
          Coming Soon
        </div>
      )}

      {/* Bottom overlay — darkens on hover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered && !isComingSoon
            ? 'linear-gradient(to top, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.4) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.2) 50%, transparent 100%)',
          transition: 'background 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '1.25rem',
          zIndex: 1,
        }}
      >
        {/* Industry tag */}
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-primary)',
            marginBottom: '0.35rem',
          }}
        >
          {project.industry}
        </div>

        {/* Project name */}
        <div
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: '1.6rem',
            color: 'var(--color-text)',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          {project.name}
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontSize: '0.75rem',
              color: 'var(--color-text)',
            }}
          >
            {isComingSoon ? 'Back Online Soon' : 'Visit Site'}
          </span>
          {!isComingSoon && (
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontSize: '0.75rem',
                color: 'var(--color-text)',
                display: 'inline-block',
              }}
            >
              →
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );

  if (isComingSoon) {
    return (
      <div style={{ gridColumn: isFullWidth ? '1 / -1' : undefined }}>
        {inner}
      </div>
    );
  }

  return (
    <a
      href={project.url!}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', textDecoration: 'none', cursor: 'none' }}
      data-hover
    >
      {inner}
    </a>
  );
}

export default function WebDevGrid() {
  const { isMobile } = useBreakpoint();

  return (
    <section
      style={{
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
        background: 'rgba(10,10,10,0.93)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          Web Development
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: 'var(--color-text)',
            lineHeight: 1,
          }}
        >
          LIVE PROJECTS
        </h2>
      </div>

      {/* 2-column grid on desktop, 1 on mobile */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '1rem',
        }}
      >
        {DEV_PROJECTS.map(project => (
          <DevCard key={project.name} project={project} isMobile={isMobile} />
        ))}
      </div>
    </section>
  );
}
