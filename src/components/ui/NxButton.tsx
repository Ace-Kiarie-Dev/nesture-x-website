'use client';

import Link from 'next/link';

const CLIP = 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)';

const SIZES = {
  sm: { padding: '0.5rem 1.2rem', fontSize: '0.72rem' },
  md: { padding: '0.75rem 1.8rem', fontSize: '0.82rem' },
  lg: { padding: '0.9rem 2.2rem', fontSize: '0.9rem' },
} as const;

interface NxButtonProps {
  variant: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  target?: string;
}

export default function NxButton({
  variant,
  size = 'md',
  href,
  onClick,
  children,
  className = '',
  target,
}: NxButtonProps) {
  const { padding, fontSize } = SIZES[size];
  const isPrimary = variant === 'primary';

  const sharedStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding,
    fontFamily: 'var(--font-body), sans-serif',
    fontWeight: 600,
    fontSize,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: 'none',
    clipPath: CLIP,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...(isPrimary
      ? {
          background: '#1a6fd4',
          color: '#f5f5f5',
          border: 'none',
          boxShadow: 'none',
        }
      : {
          background: 'transparent',
          color: '#f5f5f5',
          borderStyle: 'solid',
          borderWidth: '1px',
          boxShadow: 'none',
        }),
  };

  const variantClass = isPrimary ? 'nx-btn--primary' : 'nx-btn--ghost';
  const cls = `nx-btn ${variantClass}${className ? ` ${className}` : ''}`;

  if (href) {
    return (
      <Link href={href} target={target} onClick={onClick} className={cls} style={sharedStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls} style={sharedStyle}>
      {children}
    </button>
  );
}
