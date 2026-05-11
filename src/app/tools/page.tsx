'use client';

// Note: metadata moved out of this file because 'use client' + Framer Motion
// are required for the animated grid. Restore via app/tools/layout.tsx when needed.

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers, FileStack, QrCode, Receipt, Palette,
  Type, ShieldCheck, Link as LinkIcon, AlignLeft, KeyRound, Code2,
} from 'lucide-react';
import type { ElementType } from 'react';

// ── Tools data ────────────────────────────────────────────────────────────────

const TOOLS: { icon: ElementType; name: string; description: string; href: string }[] = [
  {
    icon: Layers,
    name: 'Image Studio',
    href: '/tools/image-studio',
    description: 'Convert, compress, resize, transform and adjust images. Full power, one tool.',
  },
  {
    icon: FileStack,
    name: 'PDF Studio',
    href: '/tools/pdf-studio',
    description: 'Compress, merge, split, rotate and protect PDF files.',
  },
  {
    icon: QrCode,
    name: 'QR Code Generator',
    href: '/tools/qr-generator',
    description: 'Generate QR codes with custom colours, logo overlay, and SVG/PNG export.',
  },
  {
    icon: Receipt,
    name: 'Invoice Generator',
    href: '/tools/invoice-generator',
    description: 'Create professional PDF invoices with logo, tax, discount and M-Pesa payment details.',
  },
  {
    icon: Palette,
    name: 'Color Palette Generator',
    href: '/tools/color-palette',
    description: 'Generate palettes and export as CSS variables, Tailwind config, JSON or PNG.',
  },
  {
    icon: Type,
    name: 'Logo Text Previewer',
    href: '/tools/logo-text-preview',
    description: 'Preview your brand name across fonts and layouts before commissioning a logo.',
  },
  {
    icon: ShieldCheck,
    name: 'M-Pesa Validator',
    href: '/tools/mpesa-validator',
    description: 'Validate M-Pesa Till numbers, Paybill numbers and phone numbers instantly.',
  },
  {
    icon: LinkIcon,
    name: 'UTM Link Builder',
    href: '/tools/utm-builder',
    description: 'Build UTM tracking links with presets, live preview and bulk CSV export.',
  },
  {
    icon: AlignLeft,
    name: 'Word & Character Counter',
    href: '/tools/word-counter',
    description: 'Count words, characters, sentences, reading time and keyword density.',
  },
  {
    icon: KeyRound,
    name: 'Password Generator',
    href: '/tools/password-generator',
    description: 'Generate cryptographically secure passwords or passphrases in bulk.',
  },
  {
    icon: Code2,
    name: 'Base64 Encoder/Decoder',
    href: '/tools/base64-encoder',
    description: 'Encode and decode text or files to Base64, with data URI and URL-safe mode.',
  },
];

// ── Animation variants ────────────────────────────────────────────────────────

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

// ── Page ──────────────────────────────────────────────────────────────────────

const SECTION_PAD = 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem)';

export default function ToolsPage() {
  return (
    <main>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        style={{ padding: SECTION_PAD }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />
        <div className="relative z-[1]">
          <p className="section-label" style={{ marginBottom: '2rem' }}>Nesture-X</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 14vw, 13rem)',
              lineHeight: 0.87,
              color: 'var(--color-text)',
              marginBottom: '2.5rem',
            }}
          >
            FREE TOOLS
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
              lineHeight: 1.75,
              color: 'rgba(245,245,245,0.6)',
              maxWidth: '38rem',
            }}
          >
            Useful tools, no account needed. Built by Nesture-X.
          </p>
        </div>
      </section>

      {/* ── Tool grid ── */}
      <section
        style={{
          background: 'var(--color-surface)',
          padding: 'clamp(4rem, 6vw, 6rem) clamp(2rem, 7vw, 8rem)',
        }}
      >
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.href} variants={cardVariant}>
                <Link
                  href={tool.href}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    padding: 'clamp(1.25rem, 2.5vw, 2rem)',
                    height: '100%',
                    background: 'rgba(20, 25, 32, 0.6)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textDecoration: 'none',
                    transition: 'box-shadow 180ms ease, border-color 180ms ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = '4px 4px 0 var(--color-primary)';
                    el.style.borderColor = 'rgba(26,111,212,0.4)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = 'none';
                    el.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(26,111,212,0.25)',
                      background: 'rgba(26,111,212,0.08)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Icon size={28} />
                  </div>

                  {/* Name */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)',
                      fontWeight: 700,
                      color: 'var(--color-text)',
                      lineHeight: 1.3,
                    }}
                  >
                    {tool.name}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      lineHeight: 1.7,
                      color: 'rgba(245,245,245,0.5)',
                      flex: 1,
                    }}
                  >
                    {tool.description}
                  </p>

                  {/* CTA label */}
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-primary)',
                    }}
                  >
                    Use Tool →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── CTA banner ── */}
      <section
        style={{
          background: 'var(--color-bg)',
          padding: 'clamp(4rem, 6vw, 6rem) clamp(2rem, 7vw, 8rem)',
          borderTop: '2px solid var(--color-primary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            alignItems: 'flex-start',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              lineHeight: 0.93,
              color: 'var(--color-text)',
              maxWidth: '36rem',
            }}
          >
            NEED A CUSTOM TOOL BUILT FOR YOUR BUSINESS?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)',
              lineHeight: 1.8,
              color: 'rgba(245,245,245,0.5)',
              maxWidth: '42rem',
            }}
          >
            We build bespoke web tools, internal dashboards, and workflow automations for
            businesses across Kenya and beyond. Let&apos;s talk about what you need.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-bg)',
              background: 'var(--color-primary)',
              border: '2px solid var(--color-primary)',
              padding: '0.85rem 2rem',
              textDecoration: 'none',
            }}
          >
            Get in Touch →
          </Link>
        </div>
      </section>

    </main>
  );
}
