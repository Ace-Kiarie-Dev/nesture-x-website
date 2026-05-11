'use client';

import { useState, useRef, useCallback } from 'react';
import { Copy, Check, Upload } from 'lucide-react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

// ── Helpers ───────────────────────────────────────────────────────────────────

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_');
}

function fromUrlSafe(b64: string): string {
  return b64.replace(/-/g, '+').replace(/_/g, '/');
}

function encodeText(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decodeText(b64: string): string {
  const normalised = fromUrlSafe(b64.trim());
  const binary = atob(normalised);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function stripDataUriPrefix(s: string): string {
  const idx = s.indexOf('base64,');
  if (idx !== -1) return s.slice(idx + 7);
  return s;
}

const MIME_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
  'text/plain': 'txt',
  'text/html': 'html',
  'application/json': 'json',
  'application/zip': 'zip',
  'application/octet-stream': 'bin',
};

function mimeToExt(mime: string): string {
  return MIME_EXT[mime.toLowerCase()] ?? 'bin';
}

// ── Shared styles ─────────────────────────────────────────────────────────────

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
  textTransform: 'uppercase' as const,
  color: 'rgba(245,245,245,0.35)',
  display: 'block',
  marginBottom: '0.5rem',
};

const TOGGLE_BASE: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  padding: '0.4rem 0.9rem',
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'transparent',
  color: 'rgba(245,245,245,0.4)',
  cursor: 'pointer',
  transition: 'all 150ms',
};

const TOGGLE_ACTIVE: React.CSSProperties = {
  ...TOGGLE_BASE,
  border: '1px solid var(--color-primary)',
  background: 'rgba(26,111,212,0.15)',
  color: 'var(--color-primary)',
};

const MONO_OUTPUT: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.82rem',
  lineHeight: 1.6,
  background: 'rgba(10,10,10,0.5)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '0.75rem 1rem',
  color: 'var(--color-text)',
  wordBreak: 'break-all' as const,
  minHeight: '80px',
  whiteSpace: 'pre-wrap' as const,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function CopyButton({ text, style }: { text: string; style?: React.CSSProperties }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* silent */ }
  }
  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        letterSpacing: '0.08em',
        padding: '0.35rem 0.75rem',
        border: '1px solid rgba(255,255,255,0.12)',
        background: copied ? 'rgba(22,163,74,0.12)' : 'transparent',
        color: copied ? '#16a34a' : 'rgba(245,245,245,0.45)',
        cursor: text ? 'pointer' : 'default',
        opacity: text ? 1 : 0.4,
        transition: 'all 150ms',
        ...style,
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function DataUriButton({ dataUri }: { dataUri: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(dataUri);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* silent */ }
  }
  return (
    <button
      onClick={handleCopy}
      disabled={!dataUri}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em',
        padding: '0.35rem 0.75rem',
        border: '1px solid rgba(255,255,255,0.12)',
        background: copied ? 'rgba(22,163,74,0.12)' : 'transparent',
        color: copied ? '#16a34a' : 'rgba(245,245,245,0.45)',
        cursor: dataUri ? 'pointer' : 'default',
        opacity: dataUri ? 1 : 0.4,
        transition: 'all 150ms',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy as Data URI'}
    </button>
  );
}

// ── Encode Text tab ───────────────────────────────────────────────────────────

function EncodeTextTab() {
  const [input, setInput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [encoded, setEncoded] = useState('');

  const process = useCallback((val: string, safe: boolean) => {
    if (!val.trim()) { setEncoded(''); return; }
    try {
      const b64 = encodeText(val);
      setEncoded(safe ? toUrlSafe(b64) : b64);
    } catch { setEncoded(''); }
  }, []);

  function handleInput(val: string) {
    setInput(val);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => process(val, urlSafe), 200);
  }

  function handleUrlSafe(val: boolean) {
    setUrlSafe(val);
    process(input, val);
  }

  const dataUri = encoded ? `data:text/plain;base64,${encoded}` : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={LABEL}>Text Input</label>
        <textarea
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder="Type or paste text to encode…"
          style={{
            width: '100%',
            minHeight: '140px',
            resize: 'vertical',
            background: 'rgba(10,10,10,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            color: 'var(--color-text)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button onClick={() => handleUrlSafe(!urlSafe)} style={urlSafe ? TOGGLE_ACTIVE : TOGGLE_BASE}>URL-safe</button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(245,245,245,0.25)' }}>
          replaces + → - and / → _
        </span>
      </div>

      {encoded && (
        <div>
          <label style={LABEL}>Base64 Output</label>
          <div style={MONO_OUTPUT}>{encoded}</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <CopyButton text={encoded} />
            <DataUriButton dataUri={dataUri} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Encode File tab ───────────────────────────────────────────────────────────

function EncodeFileTab() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileMime, setFileMime] = useState('');
  const [encoded, setEncoded] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState('');
  const [dataUriCopied, setDataUriCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function processFile(file: File) {
    setError('');
    if (file.size > 4 * 1024 * 1024) {
      setError('File exceeds 4 MB limit.');
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    setFileMime(file.type || 'application/octet-stream');
    const reader = new FileReader();
    reader.onload = () => {
      const buf = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(buf);
      let binary = '';
      bytes.forEach(b => (binary += String.fromCharCode(b)));
      const b64 = btoa(binary);
      setEncoded(urlSafe ? toUrlSafe(b64) : b64);
    };
    reader.readAsArrayBuffer(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  }

  function handleUrlSafe(val: boolean) {
    setUrlSafe(val);
    if (encoded) setEncoded(val ? toUrlSafe(fromUrlSafe(encoded)) : fromUrlSafe(encoded));
  }

  const mime = fileMime || 'application/octet-stream';
  const dataUri = encoded ? `data:${mime};base64,${encoded}` : '';
  const encodedSize = encoded ? Math.ceil(encoded.length * 0.75) : 0;

  async function copyDataUri() {
    try {
      await navigator.clipboard.writeText(dataUri);
      setDataUriCopied(true);
      setTimeout(() => setDataUriCopied(false), 1800);
    } catch { /* silent */ }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--color-primary)' : 'rgba(255,255,255,0.12)'}`,
          padding: '2rem 1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 150ms',
          background: dragging ? 'rgba(26,111,212,0.05)' : 'transparent',
        }}
      >
        <Upload size={24} style={{ margin: '0 auto 0.5rem', display: 'block', color: 'rgba(245,245,245,0.3)' }} />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(245,245,245,0.4)', margin: 0 }}>
          Drag & drop a file, or click to browse
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(245,245,245,0.2)', marginTop: '0.25rem' }}>
          Max 4 MB · any file type
        </p>
        <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />
      </div>

      {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#dc2626', margin: 0 }}>{error}</p>}

      {fileName && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.5)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <span>{fileName}</span>
          <span>{(fileSize / 1024).toFixed(1)} KB original</span>
          {encoded && <span>{(encoded.length / 1024).toFixed(1)} KB encoded</span>}
          <span>{fileMime}</span>
        </div>
      )}

      {encoded && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={() => handleUrlSafe(!urlSafe)} style={urlSafe ? TOGGLE_ACTIVE : TOGGLE_BASE}>URL-safe</button>
          </div>
          <div>
            <label style={LABEL}>Base64 Output ({(encodedSize / 1024).toFixed(1)} KB)</label>
            <div style={{ ...MONO_OUTPUT, maxHeight: '200px', overflowY: 'auto' }}>{encoded}</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <CopyButton text={encoded} />
              <button
                onClick={copyDataUri}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em',
                  padding: '0.35rem 0.75rem',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: dataUriCopied ? 'rgba(22,163,74,0.12)' : 'transparent',
                  color: dataUriCopied ? '#16a34a' : 'rgba(245,245,245,0.45)',
                  cursor: 'pointer', transition: 'all 150ms',
                }}
              >
                {dataUriCopied ? <Check size={12} /> : <Copy size={12} />}
                Copy as Data URI
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Decode Text tab ───────────────────────────────────────────────────────────

function DecodeTextTab() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState('');
  const [error, setError] = useState('');
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function process(raw: string) {
    const val = stripDataUriPrefix(raw.trim());
    if (!val) { setDecoded(''); setError(''); return; }
    try {
      setDecoded(decodeText(val));
      setError('');
    } catch {
      setDecoded('');
      setError('Invalid Base64 — check your input.');
    }
  }

  function handleInput(val: string) {
    setInput(val);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => process(val), 200);
  }

  const borderColor = error ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.1)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={LABEL}>Base64 Input</label>
        <textarea
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder="Paste Base64 or data URI here…"
          style={{
            width: '100%',
            minHeight: '140px',
            resize: 'vertical',
            background: 'rgba(10,10,10,0.5)',
            border: `1px solid ${borderColor}`,
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--color-text)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = error ? 'rgba(220,38,38,0.7)' : 'var(--color-primary)')}
          onBlur={e => (e.target.style.borderColor = borderColor)}
        />
        {error && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#dc2626', marginTop: '0.25rem' }}>{error}</p>
        )}
      </div>
      {decoded && (
        <div>
          <label style={LABEL}>Decoded Text</label>
          <div
            style={{
              background: 'rgba(10,10,10,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '0.75rem 1rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--color-text)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '240px',
              overflowY: 'auto',
            }}
          >
            {decoded}
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <CopyButton text={decoded} />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Decode File tab ───────────────────────────────────────────────────────────

function DecodeFileTab() {
  const [input, setInput] = useState('');
  const [mime, setMime] = useState('application/octet-stream');
  const [error, setError] = useState('');

  function handleDownload() {
    const val = stripDataUriPrefix(input.trim());
    if (!val) return;
    try {
      const binary = atob(fromUrlSafe(val));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: mime });
      const ext = mimeToExt(mime);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `decoded-file.${ext}`;
      a.click();
      URL.revokeObjectURL(a.href);
      setError('');
    } catch {
      setError('Invalid Base64 — cannot decode.');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={LABEL}>Base64 Input</label>
        <textarea
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder="Paste Base64 or data URI to download as a file…"
          style={{
            width: '100%',
            minHeight: '140px',
            resize: 'vertical',
            background: 'rgba(10,10,10,0.5)',
            border: `1px solid ${error ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.1)'}`,
            padding: '0.75rem 1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--color-text)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#dc2626', marginTop: '0.25rem' }}>{error}</p>}
      </div>
      <div>
        <label style={LABEL}>MIME Type</label>
        <input
          type="text"
          value={mime}
          onChange={e => setMime(e.target.value)}
          placeholder="application/octet-stream"
          style={{
            background: 'rgba(10,10,10,0.5)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.4rem 0.75rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--color-text)',
            outline: 'none',
            width: '260px',
          }}
        />
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.2)', marginTop: '0.3rem' }}>
          e.g. image/png · application/pdf · text/html
        </p>
      </div>
      <div>
        <NxButton variant="primary" size="sm" onClick={handleDownload} disabled={!input.trim()}>
          Download Decoded File
        </NxButton>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type Direction = 'encode' | 'decode';
type SubTab = 'text' | 'file';

export default function Base64EncoderPage() {
  const [dir, setDir] = useState<Direction>('encode');
  const [sub, setSub] = useState<SubTab>('text');

  function switchDir(d: Direction) {
    setDir(d);
    setSub('text');
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
        BASE64 ENCODER / DECODER
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
          color: 'rgba(245,245,245,0.5)',
          marginBottom: '2.5rem',
          maxWidth: '42rem',
        }}
      >
        Encode and decode text and files to and from Base64. URL-safe mode and data URI support included. Everything runs locally.
      </p>

      <div style={{ maxWidth: '700px' }}>
        {/* Direction tabs */}
        <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
          <button style={dir === 'encode' ? TOGGLE_ACTIVE : TOGGLE_BASE} onClick={() => switchDir('encode')}>Encode</button>
          <button style={dir === 'decode' ? TOGGLE_ACTIVE : TOGGLE_BASE} onClick={() => switchDir('decode')}>Decode</button>
        </div>

        {/* Sub-tabs */}
        <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {(['text', 'file'] as SubTab[]).map(t => (
            <button
              key={t}
              onClick={() => setSub(t)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.5rem 1rem',
                border: 'none',
                borderBottom: sub === t ? '2px solid var(--color-primary)' : '2px solid transparent',
                background: 'transparent',
                color: sub === t ? 'var(--color-primary)' : 'rgba(245,245,245,0.35)',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 150ms',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ ...GLASS, marginBottom: '2rem' }}>
          {dir === 'encode' && sub === 'text' && <EncodeTextTab />}
          {dir === 'encode' && sub === 'file' && <EncodeFileTab />}
          {dir === 'decode' && sub === 'text' && <DecodeTextTab />}
          {dir === 'decode' && sub === 'file' && <DecodeFileTab />}
        </div>

        <ToolCTA />
      </div>
    </main>
  );
}
