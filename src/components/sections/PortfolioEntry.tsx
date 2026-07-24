'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBreakpoint } from '@/lib/useBreakpoint';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Portfolio from './Portfolio';
import DigitalProductsGrid from './DigitalProductsGrid';

type View = 'entry' | 'design' | 'digital';
type DigitalType = 'web' | 'mobile' | null;

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
        top: 80,
        zIndex: 49,
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
          background: hovered ? 'rgba(26,111,212,0.12)' : 'transparent',
          border: hovered
            ? '1px solid var(--color-primary)'
            : '1px solid rgba(245,245,245,0.2)',
          color: hovered ? 'var(--color-primary)' : 'var(--color-text)',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          padding: '0.4rem 0.9rem',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: hovered ? '0 0 14px rgba(26,111,212,0.35)' : 'none',
          transform: hovered ? 'translateX(-2px)' : 'translateX(0)',
          transition: 'border 0.22s ease, color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease',
        }}
      >
        <ChevronLeft size={14} aria-hidden />
        Back
      </button>
    </div>
  );
}

// ─── Background texture motifs — Web Apps / Mobile Apps sub-split ────────────
// Decorative only: absolutely positioned, low opacity, pointer-events none.
// Sits behind the big headline text inside an EntryPanel.

const MOTIF_LINE = 'rgba(26,111,212,0.28)';
const MOTIF_FILL = 'rgba(26,111,212,0.05)';
const MOTIF_GREY = 'rgba(184,206,240,0.22)';

function BrowserChromeMotif() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 'min(360px, 60%)',
          aspectRatio: '4 / 3',
          border: `1px solid ${MOTIF_LINE}`,
          borderRadius: '6px',
          background: MOTIF_FILL,
          position: 'relative',
        }}
      >
        {/* title bar */}
        <div
          style={{
            height: '22px',
            borderBottom: `1px solid ${MOTIF_LINE}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 10px',
          }}
        >
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: MOTIF_LINE }} />
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: MOTIF_GREY }} />
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: MOTIF_LINE }} />
          <span style={{ marginLeft: '10px', flex: 1, height: '10px', background: MOTIF_FILL, border: `1px solid ${MOTIF_LINE}`, borderRadius: '2px' }} />
        </div>
        {/* wireframe body */}
        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ width: '45%', height: '8px', background: MOTIF_LINE }} />
          <span style={{ width: '100%', height: '40px', background: MOTIF_GREY }} />
          <span style={{ width: '80%', height: '8px', background: MOTIF_LINE }} />
          <span style={{ width: '60%', height: '8px', background: MOTIF_LINE }} />
        </div>
      </div>
    </div>
  );
}

function PhoneViewportMotif() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 'min(180px, 34%)',
          aspectRatio: '9 / 19',
          border: `1px solid ${MOTIF_LINE}`,
          borderRadius: '22px',
          background: MOTIF_FILL,
          position: 'relative',
          padding: '22px 10px 16px',
        }}
      >
        {/* notch */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '36%',
            height: '8px',
            borderRadius: '4px',
            background: MOTIF_GREY,
          }}
        />
        {/* screen blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ width: '70%', height: '8px', background: MOTIF_LINE }} />
          <span style={{ width: '100%', height: '70px', background: MOTIF_GREY }} />
          <span style={{ width: '50%', height: '8px', background: MOTIF_LINE }} />
        </div>
        {/* home indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '30%',
            height: '4px',
            borderRadius: '2px',
            background: MOTIF_LINE,
          }}
        />
      </div>
    </div>
  );
}

// ─── Entry panel ──────────────────────────────────────────────────────────────

interface EntryPanelProps {
  label: string;
  sublabel?: string;
  backgroundPattern?: React.CSSProperties;
  visual?: React.ReactNode;
  onClick: () => void;
}

function EntryPanel({ label, sublabel, backgroundPattern, visual, onClick }: EntryPanelProps) {
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
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {backgroundPattern && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            ...backgroundPattern,
          }}
        />
      )}

      {visual}

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

// ─── Inner component ──────────────────────────────────────────────────────────
// Separated so useSearchParams is inside a Suspense boundary (required for
// static prerendering — see Next.js docs on useSearchParams).

function PortfolioEntryInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  const rawView = searchParams.get('view');
  const view: View = rawView === 'design' || rawView === 'digital' ? rawView : 'entry';

  const rawType = searchParams.get('type');
  const digitalType: DigitalType = view === 'digital' && (rawType === 'web' || rawType === 'mobile') ? rawType : null;

  const goTo = (v: View) => {
    router.push(v === 'entry' ? '/portfolio' : `/portfolio?view=${v}`);
  };

  const goToDigitalType = (t: 'web' | 'mobile') => {
    router.push(`/portfolio?view=digital&type=${t}`);
  };

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

  // Animation-key for the outer AnimatePresence — one per distinct screen so
  // the same fade/slide transition (no zoom) plays between every level.
  const screenKey = view === 'digital'
    ? (digitalType ? `digital-${digitalType}` : 'digital-split')
    : view;

  return (
    <AnimatePresence mode="wait">

      {/* ── Top-level split entry screen ── */}
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
            onClick={() => goTo('design')}
          />

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
            onClick={() => goTo('digital')}
          />
        </motion.div>
      )}

      {/* ── Design work view ── */}
      {view === 'design' && (
        <motion.div key="design" {...fadeSlide}>
          <BackBar onBack={() => goTo('entry')} />
          <Portfolio />
        </motion.div>
      )}

      {/* ── Digital Products: second-level split (Web Apps / Mobile Apps) ── */}
      {view === 'digital' && !digitalType && (
        <motion.div key={screenKey} {...fadeSlide}>
          <Breadcrumb
            segments={[
              { label: 'Portfolio', onClick: () => goTo('entry') },
              { label: 'Digital Products' },
            ]}
          />
          <div
            style={{
              minHeight: 'calc(100vh - 80px)',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              background: 'var(--color-bg)',
            }}
          >
            <EntryPanel
              label="WEB"
              sublabel="APPS"
              backgroundPattern={gridPattern}
              visual={<BrowserChromeMotif />}
              onClick={() => goToDigitalType('web')}
            />

            <div
              style={{
                width: isMobile ? '100%' : '1px',
                height: isMobile ? '1px' : 'auto',
                background: 'var(--color-primary)',
                flexShrink: 0,
              }}
            />

            <EntryPanel
              label="MOBILE"
              sublabel="APPS"
              backgroundPattern={noisePattern}
              visual={<PhoneViewportMotif />}
              onClick={() => goToDigitalType('mobile')}
            />
          </div>
        </motion.div>
      )}

      {/* ── Digital Products: Web Apps tab ── */}
      {view === 'digital' && digitalType === 'web' && (
        <motion.div key={screenKey} {...fadeSlide}>
          <Breadcrumb
            segments={[
              { label: 'Portfolio', onClick: () => goTo('entry') },
              { label: 'Digital Products', onClick: () => goTo('digital') },
              { label: 'Web Apps' },
            ]}
          />
          <DigitalProductsGrid type="web" />
        </motion.div>
      )}

      {/* ── Digital Products: Mobile Apps tab ── */}
      {view === 'digital' && digitalType === 'mobile' && (
        <motion.div key={screenKey} {...fadeSlide}>
          <Breadcrumb
            segments={[
              { label: 'Portfolio', onClick: () => goTo('entry') },
              { label: 'Digital Products', onClick: () => goTo('digital') },
              { label: 'Mobile Apps' },
            ]}
          />
          <DigitalProductsGrid type="mobile" />
        </motion.div>
      )}

    </AnimatePresence>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function PortfolioEntry() {
  return (
    <Suspense fallback={null}>
      <PortfolioEntryInner />
    </Suspense>
  );
}
