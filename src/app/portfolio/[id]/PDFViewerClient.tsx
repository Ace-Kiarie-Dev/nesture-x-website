'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface Props {
  src: string;
  title: string;
}

// Styles live in components/redesign/portfolio/portfolio.css (.nxpf-pdf*); the
// buttons are ghost clay buttons, which style their own disabled state.
const BTN = 'nx-clay-btn nx-clay-btn-ghost nx-clay-btn--sm nxpf-pdf-btn';

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

  return (
    <div className={isFullscreen ? 'nxpf-pdf is-fullscreen' : 'nxpf-pdf'} role="region" aria-label={`${title} (PDF viewer)`}>
      {/* PDF canvas area */}
      <div ref={containerRef} className="nxpf-pdf-stage">
        <Document
          file={src}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          options={options}
          loading={
            <span className="nxpf-pdf-msg">
              Loading PDF…
            </span>
          }
          error={
            <span className="nxpf-pdf-msg">
              Could not load PDF.{' '}
              <a href={src} target="_blank" rel="noopener noreferrer">
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
      <div className="nxpf-pdf-bar">
        <button
          className={BTN}
          onClick={() => setPageNumber(n => Math.max(1, n - 1))}
          disabled={pageNumber <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={13} />
          PREV
        </button>

        <span className="nxpf-pdf-count" aria-live="polite">
          {pageNumber} / {numPages || '—'}
        </span>

        <button
          className={BTN}
          onClick={() => setPageNumber(n => Math.min(numPages, n + 1))}
          disabled={pageNumber >= numPages}
          aria-label="Next page"
        >
          NEXT
          <ChevronRight size={13} />
        </button>

        <button
          className={BTN}
          onClick={() => setIsFullscreen(f => !f)}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
      </div>
    </div>
  );
}
