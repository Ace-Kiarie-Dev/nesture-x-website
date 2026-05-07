'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, MoreHorizontal, Send, FileText } from 'lucide-react';
import type { PortfolioItem } from '@/components/sections/Portfolio';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

// ─── Animation variants ───────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const leftColVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const leftItemVariants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
};

const rightGridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.018, delayChildren: 0.1 } },
};

const rightCardVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease } },
};

const bottomVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.012, delayChildren: 0.18 } },
};

const bottomCardVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileSrc(item: PortfolioItem): string {
  return `/images/portfolio/${item.filename}`;
}

function getThumbSrc(item: PortfolioItem): string | null {
  if (item.isPDF) return item.coverImage ? `/images/portfolio/${item.coverImage}` : null;
  return `/images/portfolio/${item.filename}`;
}

function getDisplayClient(client: string): string {
  return client === 'Various Clients' ? 'Nesture-X Client Work' : client;
}

function getAspectRatio(type: string): string {
  switch (type) {
    case 'Logo':            return '1 / 1';
    case 'Web':             return '16 / 9';
    case 'Company Profile':
    case 'One-Pager':
    case 'White Paper':
    case 'PowerPoint':
    case 'Proposal':        return '3 / 4';
    case 'Business Cards':  return '9 / 5';
    default:                return '4 / 3';
  }
}

function getCaption(item: PortfolioItem): string {
  if (item.type === 'Logo') return `${item.client} Logo`;
  if (item.type === 'Social Media' || item.client === 'Various Clients') return item.type;
  return `${item.client} — ${item.type}`;
}

function getAllRelated(current: PortfolioItem, all: PortfolioItem[]): PortfolioItem[] {
  const others = all.filter(i => i.id !== current.id);
  const byClient = current.client === 'Various Clients'
    ? []
    : others.filter(i => i.client === current.client);
  const byType = others.filter(
    i => i.type === current.type &&
         (current.client === 'Various Clients' || i.client !== current.client),
  );
  const seen = new Set([...byClient.map(i => i.id), ...byType.map(i => i.id)]);
  const rest = others.filter(i => !seen.has(i.id));
  return [...byClient, ...byType, ...rest];
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

// ─── Viewer sub-components ────────────────────────────────────────────────────

function ImageViewer({ item }: { item: PortfolioItem }) {
  return (
    <div className="relative w-full" style={{ aspectRatio: getAspectRatio(item.type) }}>
      <Image
        src={getFileSrc(item)}
        alt={`${item.client} — ${item.type}`}
        fill
        priority
        sizes="(max-width: 767px) 100vw, 40vw"
        style={{ objectFit: 'contain' }}
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
      className="w-full block"
    />
  );
}

function PDFViewer({ item }: { item: PortfolioItem }) {
  const src = getFileSrc(item);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <iframe
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0`}
        title={`${item.client} — ${item.type}`}
        style={{
          width: '100%',
          height: 'clamp(420px, 65vh, 720px)',
          border: 'none',
          background: 'var(--color-mid)',
          display: 'block',
        }}
      />
      <a href={src} target="_blank" rel="noopener noreferrer" className="pd-pdf-link">
        Open full PDF ↗
      </a>
    </div>
  );
}

// ─── Right-column card (image only) ──────────────────────────────────────────

function RelatedCard({ item }: { item: PortfolioItem }) {
  const isGif  = item.filename.endsWith('.gif');
  const imgSrc = getThumbSrc(item);

  return (
    <motion.div variants={rightCardVariants}>
      <Link
        href={`/portfolio/${item.id}`}
        aria-label={`${getDisplayClient(item.client)} — ${item.type}`}
        className="block overflow-hidden border border-white/[0.06] transition-all duration-300 hover:border-[rgba(26,111,212,0.4)] hover:shadow-[0_0_0_1px_rgba(26,111,212,0.15),0_4px_20px_rgba(26,111,212,0.25)]"
        data-hover
      >
        <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'var(--color-bg)' }}>
          {isGif && imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgSrc} alt="" className="w-full h-full object-cover block" />
          ) : imgSrc ? (
            <Image
              src={imgSrc}
              alt={`${item.client} — ${item.type}`}
              fill
              sizes="(max-width: 767px) 33vw, 10vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full" style={{ background: 'var(--color-surface)' }}>
              <span style={{ fontFamily: 'var(--font-mono)' }} className="text-[0.55rem] tracking-widest uppercase text-[var(--color-primary)]">
                PDF
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Bottom masonry card (with caption, mirrors Portfolio.tsx) ────────────────

function BottomCard({ item }: { item: PortfolioItem }) {
  const isGif      = item.filename.endsWith('.gif');
  const imgSrc     = getThumbSrc(item);
  const aspectRatio = getAspectRatio(item.type);

  return (
    <Link
      href={`/portfolio/${item.id}`}
      className="portfolio-card"
      data-hover
      aria-label={`${item.client} — ${item.type}`}
    >
      <div className="relative" style={{ aspectRatio }}>
        {isGif && imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgSrc} alt={`${item.client} logo animation`} className="portfolio-card__gif" />
        ) : imgSrc ? (
          <Image
            src={imgSrc}
            alt={`${item.client} — ${item.type}`}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 13vw"
          />
        ) : (
          <div className="portfolio-card__placeholder">
            <FileText size={20} color="var(--color-blue)" aria-hidden />
          </div>
        )}
      </div>

      {item.isPDF && (
        <div className="portfolio-card__pdf-badge" aria-label="PDF document">PDF</div>
      )}

      <div className="portfolio-card__overlay" aria-hidden>
        <span className="portfolio-card__type">{item.type}</span>
        <p className="portfolio-card__client">{item.client}</p>
      </div>

      <p className="portfolio-card__caption">{getCaption(item)}</p>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PortfolioDetail({
  item,
  items,
}: {
  item: PortfolioItem;
  items: PortfolioItem[];
}) {
  const [liked,       setLiked]       = useState(false);
  const [likeCount,   setLikeCount]   = useState(0);
  const [comments,    setComments]    = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  const isGif         = item.filename.endsWith('.gif');
  const allRelated    = getAllRelated(item, items);
  const displayClient = getDisplayClient(item.client);

  const likedKey    = `nx-liked-${item.id}`;
  const likesKey    = `nx-likes-${item.id}`;
  const commentsKey = `nx-comments-${item.id}`;

  // Hydrate from localStorage
  useEffect(() => {
    try {
      setLiked(localStorage.getItem(likedKey) === 'true');
      setLikeCount(parseInt(localStorage.getItem(likesKey) ?? '0', 10) || 0);
    } catch { /* ignore */ }
    try {
      const stored = JSON.parse(localStorage.getItem(commentsKey) ?? '[]') as Comment[];
      setComments(stored);
    } catch { /* ignore */ }
  }, [item.id, likedKey, likesKey, commentsKey]);

  const toggleLike = () => {
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLiked(newLiked);
    setLikeCount(newCount);
    try {
      localStorage.setItem(likedKey, String(newLiked));
      localStorage.setItem(likesKey,  String(newCount));
    } catch { /* ignore */ }
  };

  const submitComment = () => {
    const text = commentText.trim();
    if (!text) return;
    const next: Comment[] = [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, timestamp: Date.now() },
      ...comments,
    ];
    setComments(next);
    setCommentText('');
    try {
      localStorage.setItem(commentsKey, JSON.stringify(next));
    } catch { /* ignore */ }
  };

  return (
    <div className="pd-page">

      {/* ── ZONE 1: Floating icon row ────────────────────────────────────────── */}
      <div className="pd-topbar" style={{ position: 'sticky', top: '4rem', zIndex: 20 }}>
        <Link href="/portfolio" className="pd-icon-btn" aria-label="Back to portfolio" data-hover>
          <ArrowLeft size={16} aria-hidden />
        </Link>
        <button className="pd-icon-btn" aria-label="More options" data-hover>
          <MoreHorizontal size={16} aria-hidden />
        </button>
      </div>

      {/* ── ZONE 2: Two-column section ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start">

        {/* LEFT — 40%, scrolls with page */}
        <motion.div
          className="w-full md:w-[40%] md:shrink-0 p-6"
          variants={leftColVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Viewer — padded so image never touches column edges */}
          <motion.div
            variants={leftItemVariants}
            className="p-8 bg-[var(--color-bg)]"
          >
            {isGif ? (
              <GifViewer item={item} />
            ) : item.isPDF ? (
              <PDFViewer item={item} />
            ) : (
              <ImageViewer item={item} />
            )}
          </motion.div>

          {/* Info + comments */}
          <div className="pd-info">

            {/* Like */}
            <motion.div variants={leftItemVariants}>
              <button
                className={`pd-like-btn cursor-pointer${liked ? ' pd-like-btn--liked' : ''}`}
                onClick={toggleLike}
                aria-label={liked ? 'Unlike this piece' : 'Like this piece'}
                aria-pressed={liked}
                data-hover
              >
                <Heart size={16} aria-hidden style={{ fill: liked ? 'currentColor' : 'none' }} />
                <span>{likeCount}</span>
              </button>
            </motion.div>

            {/* Client name */}
            <motion.h1 variants={leftItemVariants} className="pd-client">
              {displayClient}
            </motion.h1>

            {/* Type badge */}
            <motion.div variants={leftItemVariants}>
              <span className="pd-type-badge">{item.type}</span>
            </motion.div>

            {/* Description */}
            {item.description && (
              <motion.p variants={leftItemVariants} className="pd-description">
                {item.description}
              </motion.p>
            )}

            {/* Comments */}
            <motion.div variants={leftItemVariants} className="pd-comments">
              <p className="pd-comments-title">Comments</p>

              <div className="pd-comments-list">
                {comments.length === 0 ? (
                  <p className="pd-comments-empty">No comments yet</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="pd-comment">
                      <span className="pd-comment-user">NX Visitor</span>
                      <p className="pd-comment-text">{c.text}</p>
                      <span className="pd-comment-time">{relativeTime(c.timestamp)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="pd-comment-input-row">
                <input
                  className="pd-comment-input"
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitComment(); }}
                  aria-label="Add a comment"
                />
                <button
                  className="pd-comment-send"
                  onClick={submitComment}
                  aria-label="Send comment"
                  data-hover
                >
                  <Send size={14} aria-hidden />
                </button>
              </div>
            </motion.div>

          </div>{/* /pd-info */}
        </motion.div>{/* /LEFT */}

        {/* RIGHT — 60%, sticky, 6-column image-only grid */}
        <div className="w-full md:w-[60%] md:sticky md:top-[80px] md:h-[calc(100vh-80px)] border-t border-white/[0.06] md:border-t-0 md:border-l flex flex-col overflow-hidden" style={{ background: 'var(--color-surface)' }}>
          <div className="flex-1 overflow-y-auto p-3 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.08)_transparent]">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-1.5"
              variants={rightGridVariants}
              initial="hidden"
              animate="visible"
            >
              {allRelated.map(rel => (
                <RelatedCard key={rel.id} item={rel} />
              ))}
            </motion.div>
          </div>
        </div>{/* /RIGHT */}

      </div>{/* /Zone 2 */}

      {/* ── ZONE 3: Full-width bottom masonry ───────────────────────────────── */}
      <div className="pd-more">
        <h2 className="pd-more-heading">MORE LIKE THIS</h2>

        <motion.div
          className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 xl:columns-8"
          style={{ columnGap: '0.5rem' }}
          variants={bottomVariants}
          initial="hidden"
          animate="visible"
        >
          {allRelated.map(rel => (
            <motion.div
              key={rel.id}
              variants={bottomCardVariants}
              className="break-inside-avoid block"
              style={{ marginBottom: '0.5rem' }}
            >
              <BottomCard item={rel} />
            </motion.div>
          ))}
        </motion.div>
      </div>{/* /Zone 3 */}

    </div>
  );
}
