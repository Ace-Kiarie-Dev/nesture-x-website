'use client';

interface StatusBadgeProps {
  label: string;
  description?: string;
}

// Green treatment for shipped products (pulse + glow live in globals.css).
export const LIVE_GREEN = '#22c55e';
export const LIVE_TEXT = '#4ade80';

export function isLiveStatus(status?: string): boolean {
  return status?.trim().toLowerCase() === 'live';
}

export default function StatusBadge({ label, description }: StatusBadgeProps) {
  const live = isLiveStatus(label);
  return (
    <div
      className={live ? 'nx-live-badge' : undefined}
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        border: `1px solid ${live ? LIVE_GREEN : 'var(--color-primary)'}`,
        borderRadius: '4px',
        padding: '8px 12px',
        backdropFilter: 'blur(8px)',
        maxWidth: '140px',
      }}
    >
      <div
        className={live ? 'nx-live-label' : undefined}
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: live ? LIVE_TEXT : 'var(--color-primary)',
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: description ? '4px' : '0',
        }}
      >
        {live && <span className="nx-live-dot" aria-hidden="true" />}
        {label}
      </div>
      {description && (
        <div
          style={{
            fontSize: '10px',
            color: 'rgba(245,245,245,0.7)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.3,
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
