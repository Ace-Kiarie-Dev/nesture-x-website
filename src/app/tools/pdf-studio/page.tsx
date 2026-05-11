'use client';

import { useState, useRef } from 'react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'compress' | 'merge' | 'split' | 'rotate' | 'protect';
type CompLevel = 'low' | 'medium' | 'high';
type SplitMode = 'extract' | 'split-all' | 'split-at';
interface MergeFile { id: string; file: File; pageCount: number | null; }

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_BYTES = 4 * 1024 * 1024;
const TABS: { key: Tab; label: string }[] = [
  { key: 'compress', label: 'Compress' }, { key: 'merge', label: 'Merge' },
  { key: 'split', label: 'Split' }, { key: 'rotate', label: 'Rotate' },
  { key: 'protect', label: 'Protect' },
];

// ── Style constants ───────────────────────────────────────────────────────────

const GLASS: React.CSSProperties = {
  background: 'rgba(20,25,32,0.6)', backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)',
};
const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em',
  textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', display: 'block', marginBottom: '0.5rem',
};
const INPUT: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--color-text)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
  padding: '0.5rem 0.75rem', width: '100%', outline: 'none',
};

// ── Pure helpers ──────────────────────────────────────────────────────────────

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

function sizeDiff(orig: number, proc: number) {
  if (!orig) return '';
  const pct = Math.abs(((orig - proc) / orig) * 100).toFixed(1);
  return proc <= orig
    ? `${formatBytes(orig)} → ${formatBytes(proc)} — ${pct}% smaller`
    : `${formatBytes(orig)} → ${formatBytes(proc)} — ${pct}% larger`;
}

function validatePdf(f: File): string | null {
  if (!f.name.toLowerCase().endsWith('.pdf') && !f.type.includes('pdf'))
    return 'Please upload a PDF file.';
  if (f.size > MAX_BYTES)
    return `File is ${formatBytes(f.size)} — exceeds the 4 MB limit.`;
  return null;
}

function validateRangeInput(str: string, total: number | null): string | null {
  if (!total || !str.trim()) return null;
  for (const part of str.split(',').map(s => s.trim()).filter(Boolean)) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map(Number);
      if (isNaN(a) || isNaN(b) || a < 1 || b > total || a > b)
        return `Range "${part}" is invalid — document has ${total} pages.`;
    } else {
      const n = Number(part);
      if (isNaN(n) || n < 1 || n > total)
        return `Page ${part} does not exist — document has ${total} pages.`;
    }
  }
  return null;
}

async function getPdfPageCount(file: File): Promise<number | null> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
    return doc.getPageCount();
  } catch { return null; }
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
}

// ── Reusable components ───────────────────────────────────────────────────────

function ToggleBtn({ active, onClick, children, title }: {
  active: boolean; onClick: () => void; children: React.ReactNode; title?: string;
}) {
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
      style={{
        fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em',
        padding: '0.5rem 1rem', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
        border: active ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
        background: active ? 'var(--color-primary)' : 'rgba(20,25,32,0.8)',
        color: 'var(--color-text)', transition: 'border-color 120ms ease, background 120ms ease',
      }}
    >
      {children}
    </button>
  );
}

function ErrCard({ msg }: { msg: string }) {
  return (
    <div style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.07)', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)', margin: 0 }}>{msg}</p>
    </div>
  );
}

function ResultRow({ url, filename, label }: { url: string; filename: string; label: string }) {
  return (
    <div style={{ padding: '1rem', background: 'rgba(26,111,212,0.04)', border: '1px solid rgba(26,111,212,0.12)', marginBottom: '1.25rem' }}>
      <NxButton variant="ghost" size="sm" onClick={() => triggerDownload(url, filename)}>
        {label}
      </NxButton>
    </div>
  );
}

function PdfZone({ file, pageCount, onFile, onClear, inputRef }: {
  file: File | null; pageCount?: number | null;
  onFile: (f: File) => void; onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div
        role="button" tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        style={{
          border: `2px dashed ${drag ? 'var(--color-primary)' : file ? 'rgba(26,111,212,0.3)' : 'rgba(255,255,255,0.15)'}`,
          padding: '1.75rem 1.5rem', cursor: 'pointer', textAlign: 'center',
          background: drag ? 'rgba(26,111,212,0.05)' : file ? 'rgba(26,111,212,0.03)' : 'transparent',
          transition: 'border-color 150ms ease, background 150ms ease',
          minHeight: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
        }}
      >
        {file ? (
          <>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>📄</span>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)', wordBreak: 'break-all', margin: 0 }}>{file.name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'rgba(245,245,245,0.35)', letterSpacing: '0.06em', margin: 0 }}>
              {formatBytes(file.size)}{pageCount != null ? ` · ${pageCount} page${pageCount !== 1 ? 's' : ''}` : ''}
            </p>
          </>
        ) : (
          <>
            <span style={{ fontSize: '1.5rem', color: 'rgba(26,111,212,0.4)', lineHeight: 1 }}>↑</span>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(245,245,245,0.4)', margin: 0 }}>Drop a PDF here, or click to browse</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(245,245,245,0.2)', margin: 0 }}>PDF ONLY · MAX 4 MB</p>
          </>
        )}
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
      </div>
      {file && (
        <button onClick={e => { e.stopPropagation(); onClear(); }}
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem 0', textDecoration: 'underline' }}>
          Change file
        </button>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PdfStudioPage() {
  const compRef  = useRef<HTMLInputElement>(null);
  const mergeRef = useRef<HTMLInputElement>(null);
  const splitRef = useRef<HTMLInputElement>(null);
  const rotRef   = useRef<HTMLInputElement>(null);
  const protRef  = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>('compress');

  // ── Compress state ─────────────────────────────────────────────────────────
  const [compFile, setCompFile]     = useState<File | null>(null);
  const [compLevel, setCompLevel]   = useState<CompLevel>('medium');
  const [compLoading, setCompLoading] = useState(false);
  const [compError, setCompError]   = useState<string | null>(null);
  const [compResult, setCompResult] = useState<{ url: string; origSize: number; procSize: number } | null>(null);

  // ── Merge state ────────────────────────────────────────────────────────────
  const [mergeFiles, setMergeFiles]   = useState<MergeFile[]>([]);
  const [mergeDragging, setMergeDragging] = useState(false);
  const [mergeLoading, setMergeLoading] = useState(false);
  const [mergeError, setMergeError]   = useState<string | null>(null);
  const [mergeResult, setMergeResult] = useState<{ url: string } | null>(null);

  // ── Split state ────────────────────────────────────────────────────────────
  const [splitFile, setSplitFile]           = useState<File | null>(null);
  const [splitPageCount, setSplitPageCount] = useState<number | null>(null);
  const [splitMode, setSplitMode]           = useState<SplitMode>('extract');
  const [splitPages, setSplitPages]         = useState('');
  const [splitAt, setSplitAt]               = useState(1);
  const [splitLoading, setSplitLoading]     = useState(false);
  const [splitError, setSplitError]         = useState<string | null>(null);
  const [splitResult, setSplitResult]       = useState<{ url: string; isZip: boolean } | null>(null);

  // ── Rotate state ───────────────────────────────────────────────────────────
  const [rotFile, setRotFile]           = useState<File | null>(null);
  const [rotPageCount, setRotPageCount] = useState<number | null>(null);
  const [rotAllPages, setRotAllPages]   = useState(true);
  const [rotPages, setRotPages]         = useState('');
  const [rotDegrees, setRotDegrees]     = useState<90 | 180 | 270>(90);
  const [rotLoading, setRotLoading]     = useState(false);
  const [rotError, setRotError]         = useState<string | null>(null);
  const [rotResult, setRotResult]       = useState<{ url: string } | null>(null);

  // ── Protect state ──────────────────────────────────────────────────────────
  const [protFile, setProtFile]           = useState<File | null>(null);
  const [protUserPwd, setProtUserPwd]     = useState('');
  const [protOwnerPwd, setProtOwnerPwd]   = useState('');
  const [protShowUser, setProtShowUser]   = useState(false);
  const [protShowOwner, setProtShowOwner] = useState(false);
  const [protEncLevel, setProtEncLevel]   = useState<128 | 256>(128);
  const [protLoading, setProtLoading]     = useState(false);
  const [protError, setProtError]         = useState<string | null>(null);
  const [protResult, setProtResult]       = useState<{ url: string } | null>(null);

  // ── File acceptance handlers ───────────────────────────────────────────────

  function acceptComp(f: File) {
    const e = validatePdf(f); if (e) { setCompError(e); return; }
    setCompError(null); setCompResult(null); setCompFile(f);
  }

  async function acceptMergeFiles(files: FileList | File[]) {
    setMergeError(null);
    const arr = Array.from(files);
    if (mergeFiles.length + arr.length > 10) { setMergeError('Maximum 10 files allowed.'); return; }
    for (const f of arr) { const e = validatePdf(f); if (e) { setMergeError(e); return; } }
    const entries: MergeFile[] = arr.map(f => ({ id: Math.random().toString(36).slice(2), file: f, pageCount: null }));
    setMergeFiles(prev => [...prev, ...entries]);
    entries.forEach(async entry => {
      const count = await getPdfPageCount(entry.file);
      setMergeFiles(prev => prev.map(m => m.id === entry.id ? { ...m, pageCount: count } : m));
    });
  }

  async function acceptSplit(f: File) {
    const e = validatePdf(f); if (e) { setSplitError(e); return; }
    setSplitError(null); setSplitResult(null); setSplitFile(f); setSplitPageCount(null);
    setSplitPageCount(await getPdfPageCount(f));
  }

  async function acceptRot(f: File) {
    const e = validatePdf(f); if (e) { setRotError(e); return; }
    setRotError(null); setRotResult(null); setRotFile(f); setRotPageCount(null);
    setRotPageCount(await getPdfPageCount(f));
  }

  function acceptProt(f: File) {
    const e = validatePdf(f); if (e) { setProtError(e); return; }
    setProtError(null); setProtResult(null); setProtFile(f);
  }

  // ── Process handlers ───────────────────────────────────────────────────────

  async function processCompress() {
    if (!compFile) return;
    setCompLoading(true); setCompError(null);
    if (compResult) URL.revokeObjectURL(compResult.url); setCompResult(null);
    try {
      const body = new FormData();
      body.append('file', compFile); body.append('operation', 'compress');
      body.append('config', JSON.stringify({ level: compLevel }));
      const res = await fetch('/api/tools/pdf-studio', { method: 'POST', body });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Compression failed.');
      const origSize = parseInt(res.headers.get('X-Original-Size') ?? '0', 10);
      const procSize = parseInt(res.headers.get('X-Processed-Size') ?? '0', 10);
      setCompResult({ url: URL.createObjectURL(await res.blob()), origSize, procSize });
    } catch (err: unknown) { setCompError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setCompLoading(false); }
  }

  async function processMerge() {
    if (mergeFiles.length < 2) { setMergeError('Add at least 2 PDF files to merge.'); return; }
    setMergeLoading(true); setMergeError(null);
    if (mergeResult) URL.revokeObjectURL(mergeResult.url); setMergeResult(null);
    try {
      const body = new FormData();
      mergeFiles.forEach(m => body.append('files', m.file));
      body.append('operation', 'merge');
      body.append('config', JSON.stringify({ order: mergeFiles.map((_, i) => i) }));
      const res = await fetch('/api/tools/pdf-studio', { method: 'POST', body });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Merge failed.');
      setMergeResult({ url: URL.createObjectURL(await res.blob()) });
    } catch (err: unknown) { setMergeError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setMergeLoading(false); }
  }

  async function processSplit() {
    if (!splitFile) return;
    setSplitLoading(true); setSplitError(null);
    if (splitResult) URL.revokeObjectURL(splitResult.url); setSplitResult(null);
    try {
      const body = new FormData();
      body.append('file', splitFile); body.append('operation', 'split');
      body.append('config', JSON.stringify({ mode: splitMode, pages: splitPages, splitAt }));
      const res = await fetch('/api/tools/pdf-studio', { method: 'POST', body });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Split failed.');
      const isZip = (res.headers.get('Content-Type') ?? '').includes('zip');
      setSplitResult({ url: URL.createObjectURL(await res.blob()), isZip });
    } catch (err: unknown) { setSplitError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setSplitLoading(false); }
  }

  async function processRotate() {
    if (!rotFile) return;
    setRotLoading(true); setRotError(null);
    if (rotResult) URL.revokeObjectURL(rotResult.url); setRotResult(null);
    try {
      const body = new FormData();
      body.append('file', rotFile); body.append('operation', 'rotate');
      body.append('config', JSON.stringify({ pages: rotAllPages ? 'all' : rotPages, degrees: rotDegrees }));
      const res = await fetch('/api/tools/pdf-studio', { method: 'POST', body });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Rotate failed.');
      setRotResult({ url: URL.createObjectURL(await res.blob()) });
    } catch (err: unknown) { setRotError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setRotLoading(false); }
  }

  async function processProtect() {
    if (!protFile) return;
    if (!protUserPwd.trim()) { setProtError('An open password is required.'); return; }
    setProtLoading(true); setProtError(null);
    if (protResult) URL.revokeObjectURL(protResult.url); setProtResult(null);
    try {
      const body = new FormData();
      body.append('file', protFile); body.append('operation', 'protect');
      body.append('config', JSON.stringify({ userPassword: protUserPwd, ownerPassword: protOwnerPwd, encryption: protEncLevel }));
      const res = await fetch('/api/tools/pdf-studio', { method: 'POST', body });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Protect failed.');
      setProtResult({ url: URL.createObjectURL(await res.blob()) });
    } catch (err: unknown) { setProtError(err instanceof Error ? err.message : 'Something went wrong.'); }
    finally { setProtLoading(false); }
  }

  // ── Inline validations ─────────────────────────────────────────────────────

  const splitRangeErr = splitMode === 'extract' ? validateRangeInput(splitPages, splitPageCount) : null;
  const rotRangeErr   = !rotAllPages ? validateRangeInput(rotPages, rotPageCount) : null;
  const totalMergePages = mergeFiles.reduce((s, m) => s + (m.pageCount ?? 0), 0);

  // ── Tab button style ───────────────────────────────────────────────────────

  const tabStyle = (key: Tab): React.CSSProperties => ({
    fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600,
    letterSpacing: '0.04em', textTransform: 'uppercase', padding: '0.65rem 1rem',
    background: 'none', border: 'none',
    borderBottom: activeTab === key ? '2px solid var(--color-primary)' : '2px solid transparent',
    color: activeTab === key ? 'var(--color-primary)' : 'rgba(245,245,245,0.4)',
    cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 120ms ease', marginBottom: '-1px',
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main style={{ padding: 'clamp(6rem,10vw,11rem) clamp(2rem,7vw,8rem) clamp(4rem,6vw,6rem)', background: 'var(--color-bg)' }}>
      <BackLink />

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem,8vw,8rem)', lineHeight: 0.9, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
        PDF STUDIO
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem,1.3vw,1.05rem)', color: 'rgba(245,245,245,0.5)', marginBottom: '2.5rem', maxWidth: '44rem' }}>
        Compress, merge, split, rotate and protect PDF files.
      </p>

      <div style={{ ...GLASS, padding: 'clamp(1.5rem,3vw,2.25rem)', maxWidth: '700px' }}>

        {/* ── Tab bar ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.75rem', overflowX: 'auto' }}>
          {TABS.map(t => <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>{t.label}</button>)}
        </div>

        {/* ── COMPRESS ── */}
        {activeTab === 'compress' && (
          <div>
            <PdfZone file={compFile} onFile={acceptComp} onClear={() => { setCompFile(null); setCompError(null); setCompResult(null); }} inputRef={compRef} />
            {compError && <ErrCard msg={compError} />}

            <span style={LABEL}>Compression Level</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {(['low', 'medium', 'high'] as CompLevel[]).map(l => (
                <ToggleBtn key={l} active={compLevel === l} onClick={() => setCompLevel(l)}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </ToggleBtn>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(245,245,245,0.3)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {compLevel === 'low' && 'Preserves quality, modest size reduction.'}
              {compLevel === 'medium' && 'Balanced compression — recommended for most files.'}
              {compLevel === 'high' && 'Maximum compression + metadata strip. Some quality loss possible.'}
            </p>

            {compResult && (
              <div style={{ marginBottom: '1.25rem', padding: '1rem', background: 'rgba(26,111,212,0.04)', border: '1px solid rgba(26,111,212,0.12)' }}>
                {compResult.procSize > compResult.origSize && (
                  <div style={{ border: '1px solid rgba(251,191,36,0.4)', background: 'rgba(251,191,36,0.05)', padding: '0.65rem 0.9rem', marginBottom: '0.75rem' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgb(251,191,36)', margin: 0 }}>
                      Compression could not reduce this file further. Try a higher compression level.
                    </p>
                  </div>
                )}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.5)', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                  {sizeDiff(compResult.origSize, compResult.procSize)}
                </p>
                <NxButton variant="ghost" size="sm" onClick={() => triggerDownload(compResult.url, 'compressed.pdf')}>
                  Download Compressed PDF
                </NxButton>
              </div>
            )}

            <NxButton variant="primary" size="md" onClick={processCompress} disabled={!compFile || compLoading}>
              {compLoading ? 'Compressing…' : 'Compress PDF'}
            </NxButton>
          </div>
        )}

        {/* ── MERGE ── */}
        {activeTab === 'merge' && (
          <div>
            <div
              role="button" tabIndex={0}
              onClick={() => mergeRef.current?.click()}
              onKeyDown={e => e.key === 'Enter' && mergeRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setMergeDragging(true); }}
              onDragLeave={() => setMergeDragging(false)}
              onDrop={e => { e.preventDefault(); setMergeDragging(false); acceptMergeFiles(e.dataTransfer.files); }}
              style={{
                border: `2px dashed ${mergeDragging ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
                padding: '1.25rem', cursor: 'pointer', textAlign: 'center',
                background: mergeDragging ? 'rgba(26,111,212,0.05)' : 'transparent',
                transition: 'border-color 150ms ease', marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap',
              }}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(245,245,245,0.4)' }}>
                {mergeFiles.length === 0 ? 'Drop PDFs here or click to browse' : '+ Add more PDFs'}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.2)', letterSpacing: '0.1em' }}>
                MAX {10 - mergeFiles.length} MORE · PDF ONLY
              </span>
              <input ref={mergeRef} type="file" accept=".pdf,application/pdf" multiple style={{ display: 'none' }}
                onChange={e => { if (e.target.files) acceptMergeFiles(e.target.files); e.target.value = ''; }} />
            </div>

            {mergeError && <ErrCard msg={mergeError} />}

            {mergeFiles.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                {mergeFiles.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.6rem 0.75rem', marginBottom: '0.3rem',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                      <button
                        onClick={() => { const a = [...mergeFiles]; [a[i-1], a[i]] = [a[i], a[i-1]]; setMergeFiles(a); }}
                        disabled={i === 0}
                        style={{ background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? 'rgba(245,245,245,0.12)' : 'rgba(245,245,245,0.5)', fontSize: '0.6rem', padding: '2px 4px', lineHeight: 1 }}
                      >▲</button>
                      <button
                        onClick={() => { const a = [...mergeFiles]; [a[i], a[i+1]] = [a[i+1], a[i]]; setMergeFiles(a); }}
                        disabled={i === mergeFiles.length - 1}
                        style={{ background: 'none', border: 'none', cursor: i === mergeFiles.length - 1 ? 'default' : 'pointer', color: i === mergeFiles.length - 1 ? 'rgba(245,245,245,0.12)' : 'rgba(245,245,245,0.5)', fontSize: '0.6rem', padding: '2px 4px', lineHeight: 1 }}
                      >▼</button>
                    </div>
                    <span style={{ fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{m.file.name}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.3)', letterSpacing: '0.05em', margin: 0 }}>
                        {formatBytes(m.file.size)}{m.pageCount != null ? ` · ${m.pageCount} page${m.pageCount !== 1 ? 's' : ''}` : ' · loading…'}
                      </p>
                    </div>
                    <button
                      onClick={() => setMergeFiles(prev => prev.filter(x => x.id !== m.id))}
                      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,245,245,0.4)', cursor: 'pointer', padding: '0.2rem 0.45rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', flexShrink: 0 }}
                    >✕</button>
                  </div>
                ))}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'rgba(245,245,245,0.3)', letterSpacing: '0.06em', marginTop: '0.65rem' }}>
                  {mergeFiles.length} file{mergeFiles.length !== 1 ? 's' : ''}{totalMergePages > 0 ? ` · ${totalMergePages} pages total` : ''}
                </p>
              </div>
            )}

            {mergeResult && <ResultRow url={mergeResult.url} filename="merged.pdf" label="Download Merged PDF" />}

            <NxButton variant="primary" size="md" onClick={processMerge} disabled={mergeFiles.length < 2 || mergeLoading}>
              {mergeLoading ? 'Merging…' : 'Merge PDFs'}
            </NxButton>
          </div>
        )}

        {/* ── SPLIT ── */}
        {activeTab === 'split' && (
          <div>
            <PdfZone file={splitFile} pageCount={splitPageCount} onFile={acceptSplit}
              onClear={() => { setSplitFile(null); setSplitPageCount(null); setSplitError(null); setSplitResult(null); }} inputRef={splitRef} />
            {splitError && <ErrCard msg={splitError} />}

            <span style={LABEL}>Split Mode</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {([
                { key: 'extract' as SplitMode, label: 'Extract Pages' },
                { key: 'split-all' as SplitMode, label: 'Split All Pages' },
                { key: 'split-at' as SplitMode, label: 'Split At Page' },
              ]).map(m => <ToggleBtn key={m.key} active={splitMode === m.key} onClick={() => setSplitMode(m.key)}>{m.label}</ToggleBtn>)}
            </div>

            {splitMode === 'extract' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={LABEL}>Pages to Extract</span>
                <input type="text" value={splitPages} onChange={e => setSplitPages(e.target.value)}
                  placeholder="e.g. 1, 3, 5-8" style={{ ...INPUT, marginBottom: '0.4rem' }} />
                {splitRangeErr && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgb(239,68,68)', margin: 0 }}>{splitRangeErr}</p>}
                {splitPageCount && !splitRangeErr && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.25)', margin: '0.3rem 0 0' }}>Document has {splitPageCount} pages</p>
                )}
              </div>
            )}

            {splitMode === 'split-all' && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.4)', marginBottom: '1.5rem', lineHeight: 1.6, padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                Each page saved as a separate PDF, packaged into a ZIP archive.
                {splitPageCount != null && <span style={{ color: 'var(--color-primary)' }}> ({splitPageCount} files)</span>}
              </div>
            )}

            {splitMode === 'split-at' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={LABEL}>Split After Page</span>
                <input type="number" value={splitAt} min={1} max={splitPageCount ? splitPageCount - 1 : undefined}
                  onChange={e => setSplitAt(Number(e.target.value))} style={{ ...INPUT, marginBottom: '0.4rem' }} />
                {splitPageCount != null && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.25)', margin: 0 }}>
                    Produces: pages 1–{splitAt} + pages {splitAt + 1}–{splitPageCount}. Downloads as ZIP.
                  </p>
                )}
              </div>
            )}

            {splitResult && <ResultRow url={splitResult.url} filename={splitResult.isZip ? 'split.zip' : 'extracted.pdf'} label={splitResult.isZip ? 'Download ZIP' : 'Download PDF'} />}

            <NxButton variant="primary" size="md" onClick={processSplit} disabled={!splitFile || splitLoading || !!splitRangeErr}>
              {splitLoading ? 'Splitting…' : 'Split PDF'}
            </NxButton>
          </div>
        )}

        {/* ── ROTATE ── */}
        {activeTab === 'rotate' && (
          <div>
            <PdfZone file={rotFile} pageCount={rotPageCount} onFile={acceptRot}
              onClear={() => { setRotFile(null); setRotPageCount(null); setRotError(null); setRotResult(null); }} inputRef={rotRef} />
            {rotError && <ErrCard msg={rotError} />}

            <span style={LABEL}>Pages to Rotate</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <ToggleBtn active={rotAllPages} onClick={() => setRotAllPages(true)}>All Pages</ToggleBtn>
              <ToggleBtn active={!rotAllPages} onClick={() => setRotAllPages(false)}>Specific Pages</ToggleBtn>
            </div>
            {!rotAllPages && (
              <div style={{ marginBottom: '1.25rem' }}>
                <input type="text" value={rotPages} onChange={e => setRotPages(e.target.value)}
                  placeholder="e.g. 1, 3, 5-8" style={{ ...INPUT, marginBottom: '0.4rem' }} />
                {rotRangeErr && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgb(239,68,68)', margin: 0 }}>{rotRangeErr}</p>}
                {rotPageCount && !rotRangeErr && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(245,245,245,0.25)', margin: '0.3rem 0 0' }}>Document has {rotPageCount} pages</p>
                )}
              </div>
            )}
            {rotAllPages && <div style={{ marginBottom: '1.25rem' }} />}

            <span style={LABEL}>Rotation</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {([
                { val: 90 as const,  label: '90° Clockwise' },
                { val: 180 as const, label: '180°' },
                { val: 270 as const, label: '90° Counter-clockwise' },
              ]).map(r => <ToggleBtn key={r.val} active={rotDegrees === r.val} onClick={() => setRotDegrees(r.val)}>{r.label}</ToggleBtn>)}
            </div>

            {rotResult && <ResultRow url={rotResult.url} filename="rotated.pdf" label="Download Rotated PDF" />}

            <NxButton variant="primary" size="md" onClick={processRotate} disabled={!rotFile || rotLoading || !!rotRangeErr}>
              {rotLoading ? 'Rotating…' : 'Rotate PDF'}
            </NxButton>
          </div>
        )}

        {/* ── PROTECT ── */}
        {activeTab === 'protect' && (
          <div>
            <PdfZone file={protFile} onFile={acceptProt}
              onClear={() => { setProtFile(null); setProtError(null); setProtResult(null); }} inputRef={protRef} />
            {protError && <ErrCard msg={protError} />}

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={LABEL}>Open Password — required to open the PDF</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type={protShowUser ? 'text' : 'password'} value={protUserPwd}
                  onChange={e => setProtUserPwd(e.target.value)} placeholder="Enter password…"
                  style={{ ...INPUT, flex: 1 }} />
                <button onClick={() => setProtShowUser(v => !v)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(245,245,245,0.5)', cursor: 'pointer', padding: '0 0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', flexShrink: 0, letterSpacing: '0.05em' }}>
                  {protShowUser ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={LABEL}>Owner Password — controls editing & printing permissions (optional)</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type={protShowOwner ? 'text' : 'password'} value={protOwnerPwd}
                  onChange={e => setProtOwnerPwd(e.target.value)} placeholder="Optional…"
                  style={{ ...INPUT, flex: 1 }} />
                <button onClick={() => setProtShowOwner(v => !v)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(245,245,245,0.5)', cursor: 'pointer', padding: '0 0.85rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', flexShrink: 0, letterSpacing: '0.05em' }}>
                  {protShowOwner ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <span style={LABEL}>Encryption Level</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <ToggleBtn active={protEncLevel === 128} onClick={() => setProtEncLevel(128)}>128-bit</ToggleBtn>
              <ToggleBtn active={protEncLevel === 256} onClick={() => setProtEncLevel(256)}>256-bit</ToggleBtn>
            </div>

            <div style={{ border: '1px solid rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.04)', padding: '0.9rem 1rem', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(251,191,36,0.8)', lineHeight: 1.6, margin: 0 }}>
                Once protected, you will need the password to open this file. Store it safely — there is no recovery option.
              </p>
            </div>

            {protResult && <ResultRow url={protResult.url} filename="protected.pdf" label="Download Protected PDF" />}

            <NxButton variant="primary" size="md" onClick={processProtect} disabled={!protFile || !protUserPwd.trim() || protLoading}>
              {protLoading ? 'Encrypting…' : 'Protect PDF'}
            </NxButton>
          </div>
        )}
      </div>

      <ToolCTA />
    </main>
  );
}
