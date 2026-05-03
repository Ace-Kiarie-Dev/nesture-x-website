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
  // ── Added ──
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function NxButton({
  variant,
  size = 'md',
  href,
  onClick,
  children,
  className = '',
  target,
  type = 'button',   // default stays 'button' — safe everywhere else
  disabled = false,
}: NxButtonProps) {
  const { padding, fontSize } = SIZES[size];
  const isPrimary = variant === 'primary';

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding,
    fontFamily: 'var(--font-body), sans-serif',
    fontWeight: 600,
    fontSize,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    border: 'none',
    opacity: disabled ? 0.5 : 1,
    transition: 'opacity 0.2s',
    ...(isPrimary
      ? { background: 'var(--color-primary)', color: 'var(--color-text)', clipPath: CLIP }
      : { background: 'transparent', color: 'var(--color-text)', borderStyle: 'solid', borderWidth: '1px' }),
  };

  const wrapperClass = `nx-btn-wrapper nx-btn-wrapper--${variant}${className ? ` ${className}` : ''}`;
  const btnClass = `nx-btn nx-btn--${variant}`;

  const el = href ? (
    <Link href={href} target={target} onClick={onClick} className={btnClass} style={btnStyle}>
      {children}
    </Link>
  ) : (
    <button
      type={type}          
      onClick={onClick}
      disabled={disabled}  
      className={btnClass}
      style={btnStyle}
    >
      {children}
    </button>
  );

  return <div className={wrapperClass}>{el}</div>;
}