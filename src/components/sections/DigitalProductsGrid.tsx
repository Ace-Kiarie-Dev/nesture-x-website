'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBreakpoint } from '@/lib/useBreakpoint';
import { getNxOriginalsByCategory } from '@/data/nxOriginals';
import { slugify } from '@/lib/slugify';
import { getProjectDestination } from '@/lib/getProjectDestination';
import { DEV_PROJECTS } from '@/data/devProjects';

// ─── Shared card shape ─────────────────────────────────────────────────────────
// Normalises both data sources (NX Originals + WebDevGrid client sites) into
// one shape so a single card renderer can present them identically.

interface ProductCardData {
  key: string;
  anchorId: string;
  name: string;
  image: string | null;
  url: string | null;
  tag: string;
  badge?: string;
}

function getItems(type: 'web' | 'mobile'): ProductCardData[] {
  const originals = getNxOriginalsByCategory(type).map(item => ({
    key: `original-${item.id}`,
    anchorId: item.slug,
    name: item.title,
    image: item.imageSrc,
    url: item.link ?? null,
    tag: item.description,
    badge: item.status,
  }));

  if (type === 'mobile') return originals;

  // Web Apps also folds in the existing client-site projects.
  const clientSites = DEV_PROJECTS.map(project => ({
    key: `client-${project.name}`,
    anchorId: slugify(project.name),
    name: project.name,
    image: project.image,
    url: project.url,
    tag: project.industry,
    badge: project.comingSoon ? 'Coming Soon' : undefined,
  }));

  return [...originals, ...clientSites];
}

// ─── Card ───────────────────────────────────────────────────────────────────────

function ProductCard({ item }: { item: ProductCardData }) {
  const [hovered, setHovered] = useState(false);
  const { href, isExternal } = getProjectDestination(item.url, item.anchorId);

  const inner = (
    <div
      id={item.anchorId}
      onMouseEnter={() => setHovered(true)}
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
        scrollMarginTop: '120px',
      }}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt={item.name}
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

      {item.badge && (
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
          {item.badge}
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered
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
          {item.tag}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: '1.6rem',
            color: 'var(--color-text)',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          {item.name}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontSize: '0.75rem',
              color: 'var(--color-text)',
            }}
          >
            {isExternal ? 'Visit Site' : 'View Status'}
          </span>
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
        </div>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }}
        data-hover
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} style={{ display: 'block', textDecoration: 'none', cursor: 'pointer' }} data-hover>
      {inner}
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DigitalProductsGridProps {
  type: 'web' | 'mobile';
}

export default function DigitalProductsGrid({ type }: DigitalProductsGridProps) {
  const { isMobile } = useBreakpoint();
  const items = getItems(type);

  // Deep-link scroll: if the URL carries a #slug (from the homepage hero
  // carousel), scroll that card into view once the grid has mounted.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [type]);

  return (
    <section
      style={{
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 3vw, 2rem)',
        background: 'rgba(10,10,10,0.93)',
      }}
    >
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          Digital Products
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: 'var(--color-text)',
            lineHeight: 1,
          }}
        >
          {type === 'web' ? 'WEB APPS' : 'MOBILE APPS'}
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '1rem',
        }}
      >
        {items.map(item => (
          <ProductCard key={item.key} item={item} />
        ))}
      </div>
    </section>
  );
}
