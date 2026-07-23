'use client';

import { useState } from 'react';

// Shared by PortfolioEntry.tsx (Digital Products branch) and the
// /portfolio/status/[slug] status page — one persistent, clickable
// JetBrains Mono breadcrumb bar for both.

export interface BreadcrumbSegment {
  label: string;
  onClick?: () => void;
}

function BreadcrumbLink({ label, onClick }: BreadcrumbSegment) {
  const [hovered, setHovered] = useState(false);
  const clickable = !!onClick;

  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      data-hover={clickable || undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: clickable ? (hovered ? 'var(--color-primary)' : 'rgba(245,245,245,0.55)') : 'var(--color-primary)',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'color 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

export default function Breadcrumb({ segments }: { segments: BreadcrumbSegment[] }) {
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
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      {segments.map((seg, i) => (
        <span key={seg.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          {i > 0 && (
            <span style={{ color: 'rgba(245,245,245,0.2)', fontFamily: 'var(--font-mono), monospace', fontSize: '0.65rem' }}>
              /
            </span>
          )}
          <BreadcrumbLink label={seg.label} onClick={seg.onClick} />
        </span>
      ))}
    </div>
  );
}
