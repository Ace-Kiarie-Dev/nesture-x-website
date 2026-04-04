'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';
import NxButton from '@/components/ui/NxButton';
import PortfolioModal from '@/components/sections/PortfolioModal';
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

function filterByTab(tab: Tab, items: PortfolioItem[]): PortfolioItem[] {
  switch (tab) {
    case 'Logos':       return items.filter(i => i.type === 'Logo');
    case 'Branding':    return items.filter(i => BRANDING_TYPES.has(i.type));
    case 'Social Media':return items.filter(i => i.type === 'Social Media');
    case 'Web':         return items.filter(i => i.type === 'Web');
    case 'Print & Merch':return items.filter(i => i.type === 'Print');
    case 'Documents':   return items.filter(i => DOCUMENT_TYPES.has(i.type));
    default:            return items;
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
  if (item.isPDF) {
    return item.coverImage ? `/images/portfolio/${item.coverImage}` : null;
  }
  return `/images/portfolio/${item.filename}`;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    // 0.012s stagger: 50 visible cards ≈ 0.6 s total, 174 ≈ 2.1 s max
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
      <FileText size={28} color="var(--color-blue)" aria-hidden />
      <span className="portfolio-card__placeholder-name">{filename}</span>
    </div>
  );
}

function PortfolioCard({
  item,
  onOpen,
}: {
  item: PortfolioItem;
  onOpen: () => void;
}) {
  const imgSrc = getThumbnailSrc(item);
  const isGif = item.filename.endsWith('.gif');
  const aspectRatio = getAspectRatio(item.type);

  return (
    <article className="portfolio-card" onClick={onOpen} data-hover aria-label={`${item.client} — ${item.type}`}>
      {/* Image / media area */}
      <div className="relative" style={{ aspectRatio }}>
        {isGif && imgSrc ? (
          // Must be <img> — next/image strips GIF animation
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
        <NxButton variant="ghost" size="sm">
          View →
        </NxButton>
      </div>
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  // selectedItem is set here; modal (Step 3) reads it via prop/context
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const items = portfolioData as PortfolioItem[];
  const filtered = filterByTab(activeTab, items);

  return (
    <section
      id="portfolio"
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 4vw, 3rem)',
        background: 'rgba(17, 19, 24, 0.92)',
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: '3rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          Selected Work
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: 'var(--color-white)',
            lineHeight: 1,
          }}
        >
          OUR PORTFOLIO
        </h2>
      </div>

      {/* ── Filter tabs ── */}
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
            gap: '2rem',
            borderBottom: '1px solid rgba(26, 111, 212, 0.15)',
            marginBottom: '1rem',
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

      {/* ── Item count ── */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'rgba(245, 245, 245, 0.3)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}
      >
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
      </p>

      {/* ── Masonry grid ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
          style={{ columnGap: '1rem' }}
        >
          {filtered.map(item => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="break-inside-avoid block"
              style={{ marginBottom: '1rem' }}
            >
              <PortfolioCard item={item} onOpen={() => setSelectedItem(item)} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Modal ── */}
      {selectedItem !== null && (
        <PortfolioModal
          item={selectedItem}
          items={items}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}
