'use client';

import { useState, useRef, useCallback } from 'react';
import { Copy, Check, Upload } from 'lucide-react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented, Status } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';

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
      type="button"
      onClick={handleCopy}
      disabled={!text}
      className={`nxtl-b64-copy${copied ? ' is-copied' : ''}`}
      style={style}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
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
      type="button"
      onClick={handleCopy}
      disabled={!dataUri}
      className={`nxtl-b64-copy${copied ? ' is-copied' : ''}`}
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
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
    <div className="nxtl-b64-tab">
      <div className="nx-field">
        <label htmlFor="b64-enc-text">Text Input</label>
        <textarea
          id="b64-enc-text"
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder="Type or paste text to encode…"
          className="nx-input nx-textarea nxtl-b64-area"
        />
      </div>

      <div className="nxtl-b64-safe">
        <button type="button" onClick={() => handleUrlSafe(!urlSafe)} aria-pressed={urlSafe} className="nxtl-chip-btn">URL-safe</button>
        <span className="nxtl-hint">
          replaces + → - and / → _
        </span>
      </div>

      {encoded && (
        <div className="nxtl-b64-result" aria-live="polite">
          <span className="nxtl-label" style={{ marginBottom: 0 }}>Base64 Output</span>
          <div className="nxtl-b64-out">{encoded}</div>
          <div className="nxtl-b64-btns">
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
    <div className="nxtl-b64-tab">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        role="button"
        tabIndex={0}
        aria-label="Choose a file to encode"
        className={`nxtl-drop${dragging ? ' is-drag' : ''}`}
      >
        <Upload size={28} aria-hidden="true" className="nxtl-b64-drop-icon" />
        <p className="nxtl-drop-title">
          Drag & drop a file, or click to browse
        </p>
        <p className="nxtl-drop-hint">
          Max 4 MB · any file type
        </p>
        <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />
      </div>

      {error && <Status tone="error">{error}</Status>}

      {fileName && (
        <div className="nxtl-b64-meta">
          <span className="nxtl-b64-meta-name">{fileName}</span>
          <span>{(fileSize / 1024).toFixed(1)} KB original</span>
          {encoded && <span>{(encoded.length / 1024).toFixed(1)} KB encoded</span>}
          <span>{fileMime}</span>
        </div>
      )}

      {encoded && (
        <>
          <div className="nxtl-b64-safe">
            <button type="button" onClick={() => handleUrlSafe(!urlSafe)} aria-pressed={urlSafe} className="nxtl-chip-btn">URL-safe</button>
          </div>
          <div className="nxtl-b64-result">
            <span className="nxtl-label" style={{ marginBottom: 0 }}>Base64 Output ({(encodedSize / 1024).toFixed(1)} KB)</span>
            <div className="nxtl-b64-out nxtl-b64-out--scroll">{encoded}</div>
            <div className="nxtl-b64-btns">
              <CopyButton text={encoded} />
              <button
                type="button"
                onClick={copyDataUri}
                className={`nxtl-b64-copy${dataUriCopied ? ' is-copied' : ''}`}
              >
                {dataUriCopied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
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

  return (
    <div className="nxtl-b64-tab">
      <div className="nx-field">
        <label htmlFor="b64-dec-text">Base64 Input</label>
        <textarea
          id="b64-dec-text"
          value={input}
          onChange={e => handleInput(e.target.value)}
          placeholder="Paste Base64 or data URI here…"
          aria-invalid={!!error}
          spellCheck={false}
          className="nx-input nx-textarea nxtl-b64-area nxtl-b64-area--mono"
        />
        {error && <Status tone="error">{error}</Status>}
      </div>
      {decoded && (
        <div className="nxtl-b64-result" aria-live="polite">
          <span className="nxtl-label" style={{ marginBottom: 0 }}>Decoded Text</span>
          <div className="nxtl-b64-out nxtl-b64-out--text">
            {decoded}
          </div>
          <div className="nxtl-b64-btns">
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
    <div className="nxtl-b64-tab">
      <div className="nx-field">
        <label htmlFor="b64-dec-file">Base64 Input</label>
        <textarea
          id="b64-dec-file"
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          placeholder="Paste Base64 or data URI to download as a file…"
          aria-invalid={!!error}
          spellCheck={false}
          className="nx-input nx-textarea nxtl-b64-area nxtl-b64-area--mono"
        />
        {error && <Status tone="error">{error}</Status>}
      </div>
      <div className="nx-field">
        <label htmlFor="b64-mime">MIME Type</label>
        <input
          id="b64-mime"
          type="text"
          value={mime}
          onChange={e => setMime(e.target.value)}
          placeholder="application/octet-stream"
          spellCheck={false}
          className="nx-input nxtl-b64-mime"
        />
        <p className="nxtl-hint">
          e.g. image/png · application/pdf · text/html
        </p>
      </div>
      <div className="nxtl-actions">
        <ClayButton onClick={handleDownload} disabled={!input.trim()}>
          Download Decoded File
        </ClayButton>
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
    <ToolShell
      title="Base64 Encoder / Decoder"
      outline="Encoder"
      description="Encode and decode text and files to and from Base64. URL-safe mode and data URI support included. Everything runs locally."
      cta
    >
      <div className="nxtl-panel nx-clay nxtl-b64">
        <div className="nxtl-b64-tabs">
          {/* Direction tabs */}
          <Segmented
            label="Direction"
            options={[
              { value: 'encode' as Direction, label: 'Encode' },
              { value: 'decode' as Direction, label: 'Decode' },
            ]}
            value={dir}
            onChange={switchDir}
          />

          {/* Sub-tabs */}
          <Segmented
            label="Input type"
            size="sm"
            className="nxtl-b64-sub"
            options={(['text', 'file'] as SubTab[]).map(t => ({ value: t, label: t }))}
            value={sub}
            onChange={setSub}
          />
        </div>

        {dir === 'encode' && sub === 'text' && <EncodeTextTab />}
        {dir === 'encode' && sub === 'file' && <EncodeFileTab />}
        {dir === 'decode' && sub === 'text' && <DecodeTextTab />}
        {dir === 'decode' && sub === 'file' && <DecodeFileTab />}
      </div>
    </ToolShell>
  );
}
