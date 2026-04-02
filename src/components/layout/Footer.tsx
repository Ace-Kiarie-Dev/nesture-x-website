'use client';

import Link from 'next/link';

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
  { label: 'Shinkusen ↗', href: 'https://shinkusen.co.ke' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(26,111,212,0.15)',
        padding: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: '1.4rem',
          letterSpacing: '0.05em',
        }}
      >
        <span style={{ color: '#f5f5f5' }}>NESTURE</span>
        <span style={{ color: '#1a6fd4' }}>-X</span>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {NAV.map(link => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontSize: '0.75rem',
              color: 'rgba(245,245,245,0.35)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#f5f5f5';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(245,245,245,0.35)';
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Copyright */}
      <div
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '0.62rem',
          color: 'rgba(245,245,245,0.2)',
          letterSpacing: '0.1em',
        }}
      >
        © 2025 NESTURE-X. NAIROBI, KENYA.
      </div>
    </footer>
  );
}
