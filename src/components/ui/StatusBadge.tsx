'use client';

interface StatusBadgeProps {
  label: string;
  description?: string;
}

export default function StatusBadge({ label, description }: StatusBadgeProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        border: '1px solid var(--color-primary)',
        borderRadius: '4px',
        padding: '8px 12px',
        backdropFilter: 'blur(8px)',
        maxWidth: '140px',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--color-primary)',
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: description ? '4px' : '0',
        }}
      >
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
