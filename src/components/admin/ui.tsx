'use client';

// Shared admin building blocks, one place for every admin page. Presentational only:
// each page keeps its own state, fetching and handlers and passes them in.
// Styles: components/admin/admin.css (.nxad-*).

import Image from 'next/image';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import { cx } from '@/components/redesign/cx';

// ── Page frame ────────────────────────────────────────────────────────────────

/** The page's <main>. The shell's skip link targets #nxad-main. */
export function AdminPage({ className, children, ...rest }: ComponentPropsWithoutRef<'main'>) {
  return (
    <main id="nxad-main" tabIndex={-1} className={cx('nxad-page nxad-scope', className)} {...rest}>
      {children}
    </main>
  );
}

export function PageHeader({ title, count, description, action }: {
  title:        string;
  count?:       ReactNode;
  description?: ReactNode;
  action?:      ReactNode;
}) {
  return (
    <div className="nxad-head">
      <div className="nxad-head-copy">
        <h1 className="nxad-h1">{title}</h1>
        {count !== undefined && <p className="nxad-count">{count}</p>}
        {description && <p className="nxad-desc">{description}</p>}
      </div>
      {action && <div className="nxad-head-action">{action}</div>}
    </div>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export function StatRow({ children }: { children: ReactNode }) {
  return <div className="nxad-stats">{children}</div>;
}

export function StatTile({ label, value, delta }: { label: string; value: ReactNode; delta?: ReactNode }) {
  return (
    <div className="nxad-stat nx-clay">
      <span className="nxad-stat-value">{value}</span>
      <span className="nxad-stat-label">{label}</span>
      {delta && <span className="nxad-stat-delta">{delta}</span>}
    </div>
  );
}

// ── Status chip ───────────────────────────────────────────────────────────────
// Vocabulary: neutral (grey), blue (new / in progress), green (done / paid /
// approved), amber (pending / waiting), red (failed / overdue / rejected).
// Always text plus a shape, never colour alone.

export type Tone = 'neutral' | 'blue' | 'green' | 'amber' | 'red';

export function StatusChip({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cx('nxad-chip', `nxad-chip--${tone}`, className)}>
      <span className="nxad-chip-mark" aria-hidden="true" />
      {children}
    </span>
  );
}

// ── Inline status (errors, notices, success) ──────────────────────────────────

export function Notice({ tone = 'error', children, className }: {
  tone?:      'error' | 'warn' | 'success' | 'info';
  children:   ReactNode;
  className?: string;
}) {
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'info' ? Info : AlertTriangle;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('nxad-notice', `nxad-notice--${tone}`, className)}>
      <Icon size={16} aria-hidden />
      <div>{children}</div>
    </div>
  );
}

// ── Empty state (the one place a small 3D asset is allowed) ──────────────────

export function EmptyState({ title, text, action, art = 'tool-box' }: {
  title:   string;
  text?:   ReactNode;
  action?: ReactNode;
  art?:    Asset3dKey;
}) {
  const a = ASSETS_3D[art];
  return (
    <div className="nxad-empty">
      <Image src={a.src} alt="" width={a.width} height={a.height} sizes="96px" className="nxad-empty-art" />
      <p className="nxad-empty-title">{title}</p>
      {text && <p className="nxad-empty-text">{text}</p>}
      {action}
    </div>
  );
}

// ── Loading skeleton (reserves roughly the loaded height) ────────────────────

export function SkeletonRows({ rows = 5, label, tall = false }: { rows?: number; label: string; tall?: boolean }) {
  return (
    <div className="nxad-skeleton" role="status" aria-live="polite">
      <span className="nx-sr-only">{label}</span>
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className={cx('nxad-skel-row', tall && 'is-tall')} aria-hidden="true" />
      ))}
    </div>
  );
}

// ── Segmented control (tabs as pressed buttons) ─────────────────────────────────────────────────

export function Segmented<T extends string>({ label, options, value, onChange, className }: {
  label:      string;
  options:    { value: T; label: string }[];
  value:      T;
  onChange:   (v: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx('nxad-seg', className)}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          className={cx('nxad-seg-btn', o.value === value && 'is-active')}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Cards (clay sections) ─────────────────────────────────────────────────────

export function Section({ title, children, className, aside }: {
  title:      string;
  children:   ReactNode;
  className?: string;
  aside?:     ReactNode;
}) {
  return (
    <section className={cx('nxad-section nx-clay', className)}>
      <div className="nxad-section-head">
        <h2 className="nxad-section-title">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
