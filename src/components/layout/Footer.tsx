'use client';

import Link from 'next/link';
import { useBreakpoint } from '@/lib/useBreakpoint';
import { activeSocialLinks } from '@/constants';
import { SocialIcon } from './SocialIcons';

const SOCIAL_LINKS = activeSocialLinks();

const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
  { label: 'Free Tools', href: '/tools' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Shinkusen ↗', href: 'https://shinkusen.co.ke' },
];

export default function Footer() {
  const { isMobile } = useBreakpoint();

  return (
    <footer
      style={{
        background: 'var(--color-bg)',
        borderTop: '1px solid rgba(26,111,212,0.15)',
        padding: isMobile ? '2rem 1.5rem' : '3rem',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
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
        <span style={{ color: 'var(--color-text)' }}>NESTURE</span>
        <span style={{ color: '#1a6fd4' }}>-X</span>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', gap: isMobile ? '1.5rem' : '2rem', flexWrap: 'wrap' }}>
        {NAV.map(link => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Social links + copyright */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: isMobile ? '0.5rem' : '0.75rem',
        }}
      >
        {SOCIAL_LINKS.length > 0 && (
          <ul
            style={{
              display: 'flex',
              listStyle: 'none',
              margin: isMobile ? '0 0 0 -13px' : '0 -9px 0 0',
              padding: 0,
            }}
          >
            {SOCIAL_LINKS.map(link => (
              <li key={link.network}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={`Nesture-X on ${link.label}`}
                  title={link.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: isMobile ? 44 : 36,
                    height: isMobile ? 44 : 36,
                    color: 'var(--color-text-muted)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
                  }}
                >
                  <SocialIcon network={link.network} />
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Copyright */}
        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '0.62rem',
            color: 'var(--color-text-faint)',
            letterSpacing: '0.1em',
          }}
        >
          © 2025 NESTURE-X. NAIROBI, KENYA.
        </div>
      </div>
    </footer>
  );
}
