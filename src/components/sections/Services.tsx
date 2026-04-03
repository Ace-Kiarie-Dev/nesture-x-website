'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES } from '@/constants';
import NxButton from '@/components/ui/NxButton';
import { useBreakpoint } from '@/lib/useBreakpoint';


export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const service = SERVICES[activeTab];

  const sectionPadding = isMobile ? '4rem 1.5rem' : isTablet ? '5rem 2rem' : '7rem 3rem';

  return (
    <section
      id="services"
      style={{ background: '#111318', padding: sectionPadding, position: 'relative' }}
    >
      {/* Header */}
      <div style={{ marginBottom: isMobile ? '2rem' : '3rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>What We Do</div>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1,
            margin: 0,
          }}
        >
          <span style={{ display: 'block', color: '#f5f5f5' }}>OUR</span>
          <span
            style={{
              display: 'block',
              color: 'transparent',
              WebkitTextStroke: '1px #1a6fd4',
            }}
          >
            SERVICES
          </span>
        </h2>
      </div>

      {/* Mobile / Tablet: horizontal scrollable tabs */}
      {!isDesktop && (
        <div
          style={{
            overflowX: 'auto',
            display: 'flex',
            borderBottom: '1px solid rgba(26,111,212,0.15)',
            marginBottom: '2rem',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          {SERVICES.map((svc, i) => {
            const active = i === activeTab;
            return (
              <button
                key={svc.id}
                onClick={() => setActiveTab(i)}
                data-hover
                style={{
                  flexShrink: 0,
                  padding: '0.75rem 1.2rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: active ? '2px solid #1a6fd4' : '2px solid transparent',
                  marginBottom: '-1px',
                  fontFamily: 'var(--font-grotesk), sans-serif',
                  fontWeight: 500,
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: active ? '#1a6fd4' : 'rgba(245,245,245,0.4)',
                  cursor: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}
              >
                {svc.tab}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid: desktop 2-col, otherwise single col */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '280px 1fr' : '1fr',
          gap: isDesktop ? '4rem' : '0',
          alignItems: 'start',
        }}
      >
        {/* Desktop: sticky vertical tab nav */}
        {isDesktop && (
          <nav style={{ position: 'sticky', top: '100px' }}>
            {SERVICES.map((svc, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveTab(i)}
                  data-hover
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '1rem 0 1rem 1rem',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid rgba(245,245,245,0.06)',
                    borderLeft: active
                      ? '2px solid #1a6fd4'
                      : '2px solid transparent',
                    background: 'none',
                    cursor: 'none',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color =
                        'rgba(245,245,245,0.8)';
                  }}
                  onMouseLeave={e => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.color =
                        'rgba(245,245,245,0.35)';
                  }}
                >
                  <div>
                    {/* Number label */}
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '0.6rem',
                        color: 'rgba(26,111,212,0.5)',
                        letterSpacing: '0.15em',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {svc.number}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-grotesk), sans-serif',
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: active
                          ? '#1a6fd4'
                          : 'rgba(245,245,245,0.35)',
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {svc.tab}
                    </span>
                  </div>
                  {/* Arrow */}
                  <span
                    style={{
                      opacity: active ? 1 : 0,
                      transform: active
                        ? 'translateX(0)'
                        : 'translateX(-8px)',
                      transition: 'opacity 0.3s, transform 0.3s',
                      color: '#1a6fd4',
                      fontSize: '1rem',
                    }}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Content panel — AnimatePresence transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Visual block */}
            <div
              style={{
                height: '200px',
                background: service.gradient,
                border: '1px solid rgba(26,111,212,0.15)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '2rem',
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
                  fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                  color: 'rgba(26,111,212,0.07)',
                  letterSpacing: '0.1em',
                  userSelect: 'none',
                }}
              >
                {service.visual}
              </div>

              {/* Animated bottom line */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  background: '#1a6fd4',
                }}
              />

              {/* Dot accent */}
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
            </div>

            {/* Headline */}
            <h3
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: '#f5f5f5',
                marginBottom: '0.75rem',
                lineHeight: 1,
              }}
            >
              {service.headline}
            </h3>

            {/* Description */}
            <p
              style={{
                fontFamily: 'var(--font-grotesk), sans-serif',
                fontWeight: 300,
                fontSize: '1rem',
                color: 'rgba(245,245,245,0.6)',
                lineHeight: 1.8,
                maxWidth: '520px',
                marginBottom: '2rem',
                borderLeft: '2px solid rgba(26,111,212,0.3)',
                paddingLeft: '1rem',
              }}
            >
              {service.description}
            </p>

            {/* Features grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
                gap: '0.6rem',
                marginBottom: '2.5rem',
              }}
            >
              {service.features.map(feature => (
                <FeatureItem key={feature} text={feature} />
              ))}
            </div>

            {/* CTA row */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <NxButton variant="primary" size="md" href="/services">
                See Full Details
              </NxButton>
              <NxButton variant="ghost" size="md" href="#contact">
                Get a Quote
              </NxButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function FeatureItem({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        border: `1px solid ${hovered ? 'rgba(26,111,212,0.3)' : 'rgba(26,111,212,0.1)'}`,
        background: hovered ? 'rgba(26,111,212,0.06)' : 'rgba(26,111,212,0.02)',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.3s ease',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.7rem',
          color: '#1a6fd4',
          flexShrink: 0,
        }}
      >
        →
      </span>
      <span
        style={{
          fontFamily: 'var(--font-grotesk), sans-serif',
          fontSize: '0.82rem',
          color: 'rgba(245,245,245,0.75)',
        }}
      >
        {text}
      </span>
    </div>
  );
}
