import NxOriginalsCarousel from './NxOriginalsCarousel';

export default function NxOriginals() {
  return (
    <section
      style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 3vw, 2rem)',
        background: 'var(--color-bg)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            Our Own Products
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--color-text)',
              lineHeight: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
            }}
          >
            NX Originals
          </h2>
        </div>
        <NxOriginalsCarousel />
      </div>
    </section>
  );
}
