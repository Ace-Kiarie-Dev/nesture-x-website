'use client';

import { useState, useRef, useCallback } from 'react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

const MAX_BYTES = 4 * 1024 * 1024;

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function savings(orig: number, comp: number) {
  if (orig === 0) return '0%';
  const pct = ((orig - comp) / orig) * 100;
  return pct >= 0 ? `-${pct.toFixed(1)}%` : `+${Math.abs(pct).toFixed(1)}%`;
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

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<{
    url: string;
    name: string;
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function acceptFile(f: File) {
    setError(null);
    setResult(null);
    if (!f.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
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

  async function handleCompress() {
    if (!file) return;
    setLoading(true);
    setError(null);
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('quality', quality.toString());

      const res = await fetch('/api/tools/image-compressor', { method: 'POST', body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Compression failed.');
      }

      const originalSize = parseInt(res.headers.get('X-Original-Size') ?? '0', 10);
      const compressedSize = parseInt(res.headers.get('X-Compressed-Size') ?? '0', 10);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const stem = file.name.replace(/\.[^/.]+$/, '');
      const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';

      setResult({ url, name: `${stem}-compressed.${ext}`, originalSize, compressedSize });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.name;
    a.click();
  }

  const bigger = result && result.compressedSize > result.originalSize;

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
        IMAGE COMPRESSOR
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
        Reduce image file size without sacrificing quality.
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
            <img src={preview} alt="Preview" style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain' }} />
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

        {/* Quality slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
            <span style={LABEL}>Quality</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-primary)', letterSpacing: '0.06em' }}>
              {quality}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            value={quality}
            onChange={e => setQuality(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.2)' }}>10 — Smallest</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.2)' }}>90 — Best quality</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ border: '1px solid rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.07)', padding: '0.8rem 1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)' }}>{error}</p>
          </div>
        )}

        {/* Result stats */}
        {result && (
          <>
            {bigger && (
              <div style={{ border: '1px solid rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.05)', padding: '0.8rem 1rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(251,191,36)' }}>
                  Compression increased file size — try a lower quality setting.
                </p>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                flexWrap: 'wrap',
                padding: '1rem',
                background: 'rgba(26,111,212,0.05)',
                border: '1px solid rgba(26,111,212,0.12)',
                marginBottom: '1.25rem',
              }}
            >
              {[
                { label: 'Original', value: formatBytes(result.originalSize) },
                { label: 'Compressed', value: formatBytes(result.compressedSize) },
                { label: 'Saved', value: savings(result.originalSize, result.compressedSize) },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.3)', marginBottom: '0.2rem' }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, color: label === 'Saved' && !bigger ? 'var(--color-primary)' : 'var(--color-text)' }}>{value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <NxButton
            variant="primary"
            size="sm"
            onClick={handleCompress}
            disabled={!file || loading}
          >
            {loading ? 'Compressing…' : 'Compress Image'}
          </NxButton>

          {result && (
            <NxButton variant="ghost" size="sm" onClick={handleDownload}>
              Download
            </NxButton>
          )}
        </div>
      </div>

      <ToolCTA />
    </main>
  );
}
