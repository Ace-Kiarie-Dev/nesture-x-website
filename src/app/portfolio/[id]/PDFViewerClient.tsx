'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface Props {
  src: string;
  title: string;
}

const btnBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.3rem',
  background: 'transparent',
  border: '1px solid rgba(26,111,212,0.4)',
  color: 'var(--color-primary)',
  fontFamily: 'var(--font-grotesk), sans-serif',
  fontSize: '0.7rem',
  letterSpacing: '0.08em',
  padding: '0.35rem 0.65rem',
  cursor: 'pointer',
  transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
};

const btnDisabled: React.CSSProperties = {
  ...btnBase,
  color: 'rgba(245,245,245,0.25)',
  border: '1px solid rgba(26,111,212,0.15)',
  cursor: 'not-allowed',
};

const PDF_OPTIONS = { cMapUrl: 'cmaps/', cMapPacked: true };

export default function PDFViewerClient({ src, title }: Props) {
  const [numPages, setNumPages]         = useState(0);
  const [pageNumber, setPageNumber]     = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageWidth, setPageWidth]       = useState(480);
  const containerRef = useRef<HTMLDivElement>(null);
  const options = useMemo(() => PDF_OPTIONS, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setPageWidth(Math.floor(entry.contentRect.width) - 32);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const wrapperStyle: React.CSSProperties = isFullscreen
    ? { position: 'fixed', inset: 0, zIndex: 1000, background: '#0a0a0a', display: 'flex', flexDirection: 'column' }
    : { position: 'relative', width: '100%', background: '#0a0a0a', display: 'flex', flexDirection: 'column' };

  return (
    <div style={wrapperStyle}>
      {/* PDF canvas area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '1rem 0',
          minHeight: isFullscreen ? 0 : 'clamp(320px, 55vh, 640px)',
        }}
      >
        <Document
          file={src}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          options={options}
          loading={
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.35)', padding: '2rem', display: 'block' }}>
              Loading PDF…
            </span>
          }
          error={
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.35)', padding: '2rem', display: 'block' }}>
              Could not load PDF.{' '}
              <a href={src} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                Open directly ↗
              </a>
            </span>
          }
        >
          <Page
            pageNumber={pageNumber}
            width={pageWidth > 0 ? pageWidth : 480}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      </div>

      {/* Controls bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          padding: '0.55rem 0.85rem',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <button
          style={pageNumber <= 1 ? btnDisabled : btnBase}
          onClick={() => setPageNumber(n => Math.max(1, n - 1))}
          disabled={pageNumber <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
          PREV
        </button>

        <span
          style={{
            fontFamily: 'var(--font-grotesk), sans-serif',
            fontSize: '0.7rem',
            color: 'rgba(245,245,245,0.55)',
            letterSpacing: '0.06em',
            userSelect: 'none',
          }}
        >
          {pageNumber} / {numPages || '—'}
        </span>

        <button
          style={pageNumber >= numPages ? btnDisabled : btnBase}
          onClick={() => setPageNumber(n => Math.min(numPages, n + 1))}
          disabled={pageNumber >= numPages}
          aria-label="Next page"
        >
          NEXT
          <ChevronRight size={13} />
        </button>

        <button
          style={btnBase}
          onClick={() => setIsFullscreen(f => !f)}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>
    </div>
  );
}
