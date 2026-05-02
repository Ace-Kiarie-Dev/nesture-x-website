'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBreakpoint } from '@/lib/useBreakpoint';
import Portfolio from './Portfolio';
import WebDevGrid from './WebDevGrid';

type View = 'entry' | 'design' | 'digital';

const fadeSlide = {
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0,  transition: { duration: 0.35, ease: 'easeOut' as const } },
  exit:     { opacity: 0, y: -10, transition: { duration: 0.22, ease: 'easeIn'  as const } },
};

// ─── Back bar ─────────────────────────────────────────────────────────────────

function BackBar({ onBack }: { onBack: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '0.85rem 2rem',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(26,111,212,0.12)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <button
        onClick={onBack}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-hover
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: hovered ? 'rgba(26,111,212,0.06)' : 'transparent',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: hovered ? 'var(--color-primary)' : 'rgba(245,245,245,0.2)',
          color: hovered ? 'var(--color-primary)' : 'var(--color-text)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.4rem 0.9rem',
          cursor: 'none',
          transition: 'border-color 0.25s ease, color 0.25s ease, background 0.25s ease',
        }}
      >
        <motion.span
          animate={{ x: hovered ? -4 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' as const }}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <ChevronLeft size={14} aria-hidden />
        </motion.span>
        Back
      </button>
    </div>
  );
}

// ─── Entry panel ──────────────────────────────────────────────────────────────

interface EntryPanelProps {
  label: string;
  sublabel?: string;
  backgroundPattern: React.CSSProperties;
  onClick: () => void;
}

function EntryPanel({ label, sublabel, backgroundPattern, onClick }: EntryPanelProps) {
  const [hovered, setHovered] = useState(false);
  const { isMobile } = useBreakpoint();

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      animate={{
        backgroundColor: hovered ? 'rgba(26,111,212,0.06)' : 'rgba(10,10,10,0)',
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        flex: isMobile ? '0 0 50vh' : '0 0 50%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Texture / grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          ...backgroundPattern,
        }}
      />

      {/* Label */}
      <span
        style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 'clamp(4rem, 10vw, 9rem)',
          color: hovered ? 'transparent' : 'var(--color-text)',
          WebkitTextStroke: hovered ? '1px var(--color-primary)' : undefined,
          lineHeight: 0.9,
          textAlign: 'center',
          userSelect: 'none',
          position: 'relative',
          zIndex: 1,
          transition: 'color 0.2s ease',
        }}
      >
        {label}
        {sublabel && (
          <>
            <br />
            {sublabel}
          </>
        )}
      </span>

      {/* Chevron — fades + slides in on hover */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          color: 'var(--color-primary)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <ChevronRight size={28} aria-hidden />
      </motion.div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function PortfolioEntry() {
  const [view, setView] = useState<View>('entry');
  const { isMobile } = useBreakpoint();

  const noisePattern: React.CSSProperties = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      rgba(26,111,212,0.025) 0px,
      rgba(26,111,212,0.025) 1px,
      transparent 1px,
      transparent 10px
    )`,
  };

  const gridPattern: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(rgba(26,111,212,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,111,212,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  };

  return (
    <AnimatePresence mode="wait">

      {/* ── Split entry screen ── */}
      {view === 'entry' && (
        <motion.div
          key="entry"
          {...fadeSlide}
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            background: 'var(--color-bg)',
          }}
        >
          <EntryPanel
            label="DESIGN"
            sublabel="WORK"
            backgroundPattern={noisePattern}
            onClick={() => setView('design')}
          />

          {/* Divider */}
          <div
            style={{
              width: isMobile ? '100%' : '1px',
              height: isMobile ? '1px' : 'auto',
              background: 'var(--color-primary)',
              flexShrink: 0,
            }}
          />

          <EntryPanel
            label="DIGITAL"
            sublabel="PRODUCTS"
            backgroundPattern={gridPattern}
            onClick={() => setView('digital')}
          />
        </motion.div>
      )}

      {/* ── Design work view (existing Portfolio component, untouched) ── */}
      {view === 'design' && (
        <motion.div key="design" {...fadeSlide}>
          <BackBar onBack={() => setView('entry')} />
          <Portfolio />
        </motion.div>
      )}

      {/* ── Digital products view ── */}
      {view === 'digital' && (
        <motion.div key="digital" {...fadeSlide}>
          <BackBar onBack={() => setView('entry')} />
          <WebDevGrid />
        </motion.div>
      )}

    </AnimatePresence>
  );
}
