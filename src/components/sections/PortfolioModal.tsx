'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, FileText, ExternalLink } from 'lucide-react';
import NxButton from '@/components/ui/NxButton';
import type { PortfolioItem } from './Portfolio';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PortfolioModalProps {
  item: PortfolioItem;
  items: PortfolioItem[];
  onClose: () => void;
}

interface LikeState {
  liked: boolean;
  count: number;
}

// ─── localStorage ─────────────────────────────────────────────────────────────

const LIKES_KEY = 'nx-portfolio-likes';

function loadAllLikes(): Record<string, LikeState> {
  try {
    return JSON.parse(localStorage.getItem(LIKES_KEY) ?? '{}') as Record<string, LikeState>;
  } catch {
    return {};
  }
}

function loadLikeState(id: string): LikeState {
  return loadAllLikes()[id] ?? { liked: false, count: 0 };
}

function persistLikeState(id: string, state: LikeState): void {
  const all = loadAllLikes();
  all[id] = state;
  localStorage.setItem(LIKES_KEY, JSON.stringify(all));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRelated(current: PortfolioItem, all: PortfolioItem[]): PortfolioItem[] {
  const others = all.filter(i => i.id !== current.id);
  const byClient = others.filter(i => i.client === current.client);
  const byType = others.filter(
    i => i.type === current.type && i.client !== current.client,
  );
  const combined = [...byClient, ...byType];
  const seen = new Set<string>();
  const unique: PortfolioItem[] = [];
  for (const it of combined) {
    if (!seen.has(it.id)) { seen.add(it.id); unique.push(it); }
  }
  return unique.slice(0, 3);
}

function getFileSrc(item: PortfolioItem): string {
  return `/images/portfolio/${item.filename}`;
}

function getThumbSrc(item: PortfolioItem): string | null {
  if (item.isPDF) return item.coverImage ? `/images/portfolio/${item.coverImage}` : null;
  return `/images/portfolio/${item.filename}`;
}

// ─── Viewer sub-components ────────────────────────────────────────────────────

function ImageViewer({ item }: { item: PortfolioItem }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={getFileSrc(item)}
        alt={`${item.client} — ${item.type}`}
        fill
        priority
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 768px) 100vw, 60vw"
      />
    </div>
  );
}

function GifViewer({ item }: { item: PortfolioItem }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getFileSrc(item)}
      alt={`${item.client} logo animation`}
      style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
    />
  );
}

function PDFViewer({ item }: { item: PortfolioItem }) {
  const src = getFileSrc(item);
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <iframe
        src={src}
        title={`${item.client} — ${item.type}`}
        style={{ flex: 1, width: '100%', border: 'none', background: '#111' }}
      />
      {/* PDF.js fallback — browser may block iframe; link is always visible */}
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-blue)',
          borderTop: '1px solid rgba(26,111,212,0.2)',
          background: 'rgba(20,25,32,0.9)',
          textDecoration: 'none',
          flexShrink: 0,
        }}
      >
        <ExternalLink size={11} aria-hidden />
        Open in new tab
      </a>
    </div>
  );
}

// ─── Related mini-card ────────────────────────────────────────────────────────

function RelatedCard({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: () => void;
}) {
  const thumb = getThumbSrc(item);
  const isGif = item.filename.endsWith('.gif');

  return (
    <button className="modal-related-card" onClick={onClick} data-hover>
      {/* Thumbnail */}
      <div
        style={{
          width: '3.25rem',
          height: '3.25rem',
          flexShrink: 0,
          position: 'relative',
          background: 'rgba(10,10,10,0.5)',
          overflow: 'hidden',
        }}
      >
        {isGif && thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            aria-hidden
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : thumb ? (
          <Image src={thumb} alt="" fill aria-hidden style={{ objectFit: 'cover' }} sizes="52px" />
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
          }}>
            <FileText size={14} color="var(--color-blue)" aria-hidden />
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.95rem',
          color: 'var(--color-white)',
          lineHeight: 1.1,
          marginBottom: '0.2rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.client}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-blue)',
        }}>
          {item.type}
        </p>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PortfolioModal({ item, items, onClose }: PortfolioModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentItem, setCurrentItem] = useState<PortfolioItem>(item);
  const [likeState, setLikeState] = useState<LikeState>({ liked: false, count: 0 });

  // Portal mount guard
  useEffect(() => { setMounted(true); }, []);

  // Reload like state whenever the active item changes
  useEffect(() => {
    setLikeState(loadLikeState(currentItem.id));
  }, [currentItem.id]);

  // Lock body scroll for the duration the modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const currentIndex = items.findIndex(i => i.id === currentItem.id);

  // Trigger exit animation then call onClose
  const close = useCallback(() => {
    setIsExiting(true);
    setTimeout(onClose, 220);
  }, [onClose]);

  const goNext = useCallback(() => {
    setCurrentItem(items[(currentIndex + 1) % items.length]);
  }, [currentIndex, items]);

  const goPrev = useCallback(() => {
    setCurrentItem(items[(currentIndex - 1 + items.length) % items.length]);
  }, [currentIndex, items]);

  // Keyboard: ESC, ←, →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, goNext, goPrev]);

  const toggleLike = () => {
    const newLiked = !likeState.liked;
    const newCount = newLiked
      ? likeState.count + 1
      : Math.max(0, likeState.count - 1);
    const next = { liked: newLiked, count: newCount };
    setLikeState(next);
    persistLikeState(currentItem.id, next);
  };

  const isGif = currentItem.filename.endsWith('.gif');
  const related = getRelated(currentItem, items);

  const modalTarget = isExiting
    ? { opacity: 0, scale: 0.95 }
    : { opacity: 1, scale: 1 };

  const backdropTarget = isExiting ? { opacity: 0 } : { opacity: 1 };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* ── Backdrop ── */}
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={backdropTarget}
        transition={{ duration: 0.2 }}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Positioner + modal box ── */}
      <div className="modal-positioner">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${currentItem.client} — ${currentItem.type}`}
          className="modal-box"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={modalTarget}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="modal-header">
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.28)',
            }}>
              {currentIndex + 1} / {items.length}
            </span>
            <NxButton variant="ghost" size="sm" onClick={close}>
              <X size={13} aria-hidden /> Close
            </NxButton>
          </div>

          {/* ── Body ── */}
          <div className="modal-body">

            {/* ── LEFT: viewer ── */}
            <div className="modal-viewer">
              {/* Prev arrow */}
              <button
                className="modal-nav modal-nav--prev"
                onClick={goPrev}
                aria-label="Previous item"
                data-hover
              >
                <ChevronLeft size={17} aria-hidden />
              </button>

              {/* Next arrow */}
              <button
                className="modal-nav modal-nav--next"
                onClick={goNext}
                aria-label="Next item"
                data-hover
              >
                <ChevronRight size={17} aria-hidden />
              </button>

              {/* Cross-fade between items */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {isGif ? (
                    <GifViewer item={currentItem} />
                  ) : currentItem.isPDF ? (
                    <PDFViewer item={currentItem} />
                  ) : (
                    <ImageViewer item={currentItem} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── RIGHT: metadata ── */}
            <div className="modal-meta">
              {/* Type badge */}
              <span style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-blue)',
                marginBottom: '0.5rem',
              }}>
                {currentItem.type}
              </span>

              {/* Client name */}
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                color: 'var(--color-white)',
                lineHeight: 1,
                marginBottom: '1rem',
              }}>
                {currentItem.client}
              </h2>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                color: 'rgba(245,245,245,0.6)',
                lineHeight: 1.7,
                marginBottom: '1.25rem',
              }}>
                {currentItem.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                {currentItem.tags.map(tag => (
                  <span key={tag} className="modal-tag">{tag}</span>
                ))}
              </div>

              {/* Like button */}
              <button
                className={`modal-like-btn${likeState.liked ? ' modal-like-btn--liked' : ''}`}
                onClick={toggleLike}
                aria-label={likeState.liked ? 'Unlike this piece' : 'Like this piece'}
                aria-pressed={likeState.liked}
                data-hover
              >
                <Heart
                  size={13}
                  fill={likeState.liked ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
                <span>{likeState.count}</span>
                <span>{likeState.liked ? 'Liked' : 'Like'}</span>
              </button>

              {/* Related projects */}
              {related.length > 0 && (
                <>
                  <div style={{
                    height: '1px',
                    background: 'rgba(26,111,212,0.15)',
                    margin: '1.75rem 0 1.25rem',
                  }} />

                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,245,0.28)',
                    marginBottom: '0.85rem',
                  }}>
                    Related Projects
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {related.map(rel => (
                      <RelatedCard
                        key={rel.id}
                        item={rel}
                        onClick={() => setCurrentItem(rel)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>,
    document.body,
  );
}
