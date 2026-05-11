import NxButton from '@/components/ui/NxButton';

export default function ToolCTA() {
  return (
    <div
      style={{
        marginTop: '3rem',
        borderTop: '1px solid rgba(26,111,212,0.15)',
        borderRight: '1px solid rgba(26,111,212,0.15)',
        borderBottom: '1px solid rgba(26,111,212,0.15)',
        borderLeft: '3px solid var(--color-primary)',
        padding: '1.75rem 2rem',
        background: 'rgba(26,111,212,0.04)',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-primary)',
          marginBottom: '0.6rem',
        }}
      >
        Custom Tools
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.92rem, 1.3vw, 1rem)',
          lineHeight: 1.75,
          color: 'rgba(245,245,245,0.6)',
          marginBottom: '1.5rem',
          maxWidth: '40rem',
        }}
      >
        Need a custom tool like this built for your business? Let&apos;s talk.
      </p>
      <NxButton variant="ghost" size="sm" href="/contact">
        Get in Touch
      </NxButton>
    </div>
  );
}
