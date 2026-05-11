'use client';

import { useState, useRef, useCallback } from 'react';
import type { Metadata } from 'next';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

type Format = 'jpg' | 'png' | 'webp' | 'avif' | 'tiff' | 'bmp' | 'gif' | 'ico';

const MAX_BYTES = 4 * 1024 * 1024;

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

const GLASS: React.CSSProperties = {
  background: 'rgba(20, 25, 32, 0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: 'clamp(1.5rem, 3vw, 2.25rem)',
};

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(245,245,245,0.35)',
  display: 'block',
  marginBottom: '0.6rem',
};

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState<Format>('webp');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(f: File) {
    setError(null);
    setDownloadUrl(null);
    if (!f.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP, GIF, etc.).');
      return;
    }
    if (f.size > MAX_BYTES) {
      setError(`File is ${formatBytes(f.size)} — exceeds the 4 MB limit.`);
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) acceptFile(f);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError(null);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl(null);

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('targetFormat', format);

      const res = await fetch('/api/tools/image-converter', { method: 'POST', body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Conversion failed.');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const stem = file.name.replace(/\.[^/.]+$/, '');
      setDownloadUrl(url);
      setDownloadName(`${stem}.${format}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = downloadName;
    a.click();
  }

  return (
    <main
      style={{
        padding: 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem) clamp(4rem, 6vw, 6rem)',
        background: 'var(--color-bg)',
      }}
    >
      <BackLink />

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 8vw, 8rem)',
          lineHeight: 0.9,
          color: 'var(--color-text)',
          marginBottom: '0.75rem',
        }}
      >
        IMAGE CONVERTER
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
          color: 'rgba(245,245,245,0.5)',
          marginBottom: '2.5rem',
          maxWidth: '40rem',
        }}
      >
        Convert images between JPG, PNG, and WebP instantly.
      </p>

      {/* Tool card */}
      <div style={{ ...GLASS, maxWidth: '640px' }}>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          onClick={() => inputRef.current?.click()}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${dragging ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            transition: 'border-color 150ms ease, background 150ms ease',
            background: dragging ? 'rgba(26,111,212,0.05)' : 'transparent',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          {preview ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={preview}
              alt="Preview"
              style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ color: 'rgba(245,245,245,0.25)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.35rem', color: 'rgba(26,111,212,0.5)' }}>↑</div>
              Drop an image here, or click to browse
            </div>
          )}
          {file && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(245,245,245,0.3)', letterSpacing: '0.06em' }}>
              {file.name} · {formatBytes(file.size)}
            </p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f); e.target.value = ''; }}
          />
        </div>

        {/* Format toggle */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={LABEL}>Output Format</span>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(['jpg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif', 'ico'] as Format[]).map(f => (
              <button
                key={f}
                data-hover
                onClick={() => setFormat(f)}
                style={{
                  padding: '0.5rem 0.25rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: format === f ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: 'var(--color-text)',
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
                onMouseEnter={e => {
                  if (format !== f) (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                }}
                onMouseLeave={e => {
                  if (format !== f) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              border: '1px solid rgba(239,68,68,0.45)',
              background: 'rgba(239,68,68,0.07)',
              padding: '0.8rem 1rem',
              marginBottom: '1.25rem',
            }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)' }}>
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <NxButton
            variant="primary"
            size="sm"
            onClick={handleConvert}
            disabled={!file || loading}
          >
            {loading ? 'Converting…' : 'Convert Image'}
          </NxButton>

          {downloadUrl && (
            <NxButton variant="ghost" size="sm" onClick={handleDownload}>
              Download {format.toUpperCase()}
            </NxButton>
          )}
        </div>

        {/* Success note */}
        {downloadUrl && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-primary)', marginTop: '1rem', letterSpacing: '0.08em' }}>
            ✓ Conversion complete — click Download to save your file.
          </p>
        )}
      </div>

      <ToolCTA />
    </main>
  );
}
