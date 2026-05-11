import Link from 'next/link';

export default function BackLink() {
  return (
    <Link
      href="/tools"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.78rem',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: 'rgba(245,245,245,0.35)',
        textDecoration: 'none',
        marginBottom: '2.5rem',
      }}
    >
      ← Back to Tools
    </Link>
  );
}
