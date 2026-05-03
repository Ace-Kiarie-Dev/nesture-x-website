'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import NxButton from '@/components/ui/NxButton';
import { FileText } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PortfolioItem {
  id: string;
  filename: string;
  client: string;
  type: string;
  isPDF: boolean;
  coverImage?: string;
  description: string;
  tags: string[];
  featured: boolean;
}

type Tab = 'All' | 'Logos' | 'Branding' | 'Social Media' | 'Web' | 'Print & Merch' | 'Documents';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  'All',
  'Logos',
  'Branding',
  'Social Media',
  'Web',
  'Print & Merch',
  'Documents',
];

const BRANDING_TYPES = new Set([
  'Business Cards',
  'Flyer',
  'Menu',
  'Mockup',
  'One-Pager',
  'Infographic',
]);

const DOCUMENT_TYPES = new Set([
  'Company Profile',
  'Proposal',
  'Quotation',
  'Rate Card',
  'PowerPoint',
  'White Paper',
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCaption(item: PortfolioItem): string {
  if (item.type === 'Logo') return `${item.client} Logo`;
  if (item.type === 'Social Media' || item.client === 'Various Clients') return item.type;
  return `${item.client} — ${item.type}`;
}

function filterByTab(tab: Tab, items: PortfolioItem[]): PortfolioItem[] {
  switch (tab) {
    case 'Logos':        return items.filter(i => i.type === 'Logo');
    case 'Branding':     return items.filter(i => BRANDING_TYPES.has(i.type));
    case 'Social Media': return items.filter(i => i.type === 'Social Media');
    case 'Web':          return items.filter(i => i.type === 'Web');
    case 'Print & Merch':return items.filter(i => i.type === 'Print');
    case 'Documents':    return items.filter(i => DOCUMENT_TYPES.has(i.type));
    default:             return items;
  }
}

function getAspectRatio(type: string): string {
  switch (type) {
    case 'Logo':          return '1 / 1';
    case 'Web':           return '16 / 9';
    case 'Company Profile':
    case 'One-Pager':
    case 'White Paper':
    case 'PowerPoint':
    case 'Proposal':      return '3 / 4';
    case 'Business Cards':return '9 / 5';
    default:              return '4 / 3';
  }
}

function getThumbnailSrc(item: PortfolioItem): string | null {
  if (item.isPDF) return item.coverImage ? `/images/portfolio/${item.coverImage}` : null;
  return `/images/portfolio/${item.filename}`;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.012, delayChildren: 0.03 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PDFPlaceholder({ filename }: { filename: string }) {
  return (
    <div className="portfolio-card__placeholder">
      <FileText size={20} color="var(--color-blue)" aria-hidden />
      <span className="portfolio-card__placeholder-name">{filename}</span>
    </div>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const imgSrc = getThumbnailSrc(item);
  const isGif = item.filename.endsWith('.gif');
  const aspectRatio = getAspectRatio(item.type);

  return (
    <Link
      href={`/portfolio/${item.id}`}
      className="portfolio-card"
      data-hover
      aria-label={`${item.client} — ${item.type}`}
    >
      {/* Image / media area */}
      <div className="relative" style={{ aspectRatio }}>
        {isGif && imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={`${item.client} logo animation`}
            className="portfolio-card__gif"
          />
        ) : imgSrc ? (
          <Image
            src={imgSrc}
            alt={`${item.client} — ${item.type}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 17vw"
          />
        ) : (
          <PDFPlaceholder filename={item.filename} />
        )}
      </div>

      {/* PDF corner badge */}
      {item.isPDF && (
        <div className="portfolio-card__pdf-badge" aria-label="PDF document">
          PDF
        </div>
      )}

      {/* Hover overlay */}
      <div className="portfolio-card__overlay" aria-hidden>
        <span className="portfolio-card__type">{item.type}</span>
        <p className="portfolio-card__client">{item.client}</p>
      </div>

      {/* Caption */}
      <p className="portfolio-card__caption">{getCaption(item)}</p>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Portfolio({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const items = portfolioData as PortfolioItem[];
  const filtered = featuredOnly
    ? items.filter(i => i.featured).slice(0, 8)
    : filterByTab(activeTab, items);

  return (
    <section
      id="portfolio"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 3vw, 2rem)',
        background: 'rgba(17, 19, 24, 0.92)',
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          Selected Work
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: 'var(--color-text)',
            lineHeight: 1,
          }}
        >
          OUR PORTFOLIO
        </h2>
      </div>

      {/* ── Filter tabs — hidden in featuredOnly mode ── */}
      {!featuredOnly && (
        <div
          style={{
            overflowX: 'auto',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          } as React.CSSProperties}
        >
          <div
            role="tablist"
            aria-label="Portfolio categories"
            style={{
              display: 'flex',
              gap: '1.75rem',
              borderBottom: '1px solid rgba(26, 111, 212, 0.15)',
              marginBottom: '0.75rem',
              minWidth: 'max-content',
            }}
          >
            {TABS.map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`portfolio-tab${activeTab === tab ? ' portfolio-tab--active' : ''}`}
                data-hover
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Item count — hidden in featuredOnly mode ── */}
      {!featuredOnly && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'rgba(245, 245, 245, 0.3)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}
        >
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        </p>
      )}

      {/* ── Masonry grid ── 6 columns on wide, dense thumbnail layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 xl:columns-8"
          style={{ columnGap: '0.5rem' }}
        >
          {filtered.map(item => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="break-inside-avoid block"
              style={{ marginBottom: '0.5rem' }}
            >
              <PortfolioCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── View all CTA — shown in featuredOnly mode ── */}
      {featuredOnly && (
        <div className="mt-12 flex justify-center">
          <NxButton variant="primary" size="lg" href="/portfolio">
            VIEW ALL WORK
          </NxButton>
        </div>
      )}
    </section>
  );
}
