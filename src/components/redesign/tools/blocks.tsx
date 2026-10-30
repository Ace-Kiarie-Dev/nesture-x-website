import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/components/redesign/cx';

// Presentational building blocks shared by the /tools pages. They hold no tool logic:
// each tool keeps its own state and handlers and passes them in. Styles: tools.css.

type Option<T extends string> = { value: T; label: ReactNode };

/** Segmented control (tabs / modes / sizes): buttons with aria-pressed, one group label. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  className,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx('nxtl-seg', size === 'sm' && 'nxtl-seg--sm', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="nxtl-seg-btn"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Switch-style checkbox with a visible label. */
export function Toggle({
  checked,
  onChange,
  children,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  id?: string;
}) {
  return (
    <label className="nxtl-toggle">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="nxtl-toggle-track" aria-hidden="true" />
      <span className="nxtl-toggle-label">{children}</span>
    </label>
  );
}

/**
 * Keyboard access for a dropzone div: focusable, a button to assistive tech, and Enter /
 * Space open the tool's own file picker (the same input a click opens).
 */
export function dropzoneKeys(open: () => void, label: string) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    },
  };
}

/** Inline status line: info, success or error. Errors are announced. */
export function Status({ tone = 'info', children }: { tone?: 'info' | 'ok' | 'error'; children: ReactNode }) {
  return (
    <p className={cx('nxtl-status', `nxtl-status--${tone}`)} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

/** Small spinner for buttons and processing states. */
export function Spinner() {
  return <span className="nxtl-spinner" aria-hidden="true" />;
}
