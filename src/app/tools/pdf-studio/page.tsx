'use client';

import { useState, useRef } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented, Spinner, Status } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'compress' | 'merge' | 'split' | 'rotate' | 'protect';
type CompLevel = 'low' | 'medium' | 'high';
type SplitMode = 'extract' | 'split-all' | 'split-at';
interface MergeFile { id: string; file: File; pageCount: number | null; }

// ── Constants ─────────────────────────────────────────────────────────────────

// Protect needs qpdf on the server, which isn't configured yet (the API returns 501).
// The tab and its code stay; set to true to offer it again.
const PDF_PROTECT_ENABLED = false;

const MAX_BYTES = 4 * 1024 * 1024;
const TABS: { key: Tab; label: string }[] = [
  { key: 'compress', label: 'Compress' }, { key: 'merge', label: 'Merge' },
  { key: 'split', label: 'Split' }, { key: 'rotate', label: 'Rotate' },
  ...(PDF_PROTECT_ENABLED ? [{ key: 'protect' as const, label: 'Protect' }] : []),
];

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
      type="button"
      onClick={onClick} title={title}
      aria-pressed={active}
      className="nxtl-is-opt"
    >
      {children}
    </button>
  );
}

function ErrCard({ msg }: { msg: string }) {
  return (
    <Status tone="error">{msg}</Status>
  );
}

function ResultRow({ url, filename, label }: { url: string; filename: string; label: string }) {
  return (
    <div className="nxtl-pdf-result">
      <span className="nxtl-pdf-result-icon" aria-hidden="true">✓</span>
      <ClayButton onClick={() => triggerDownload(url, filename)}>
        {label}
      </ClayButton>
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
    <div className="nxtl-pdf-zone">
      <div
        role="button" tabIndex={0}
        aria-label={file ? `Selected: ${file.name}. Choose a different PDF` : 'Choose a PDF'}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        className={`nxtl-drop${drag ? ' is-drag' : ''}${file ? ' nxtl-pdf-drop--file' : ''}`}
      >
        {file ? (
          <>
            <span className="nxtl-pdf-icon" aria-hidden="true">📄</span>
            <p className="nxtl-drop-title nxtl-pdf-name">{file.name}</p>
            <p className="nxtl-mono">
              {formatBytes(file.size)}{pageCount != null ? ` · ${pageCount} page${pageCount !== 1 ? 's' : ''}` : ''}
            </p>
          </>
        ) : (
          <>
            <span className="nxtl-is-drop-icon" aria-hidden="true">↑</span>
            <p className="nxtl-drop-title">Drop a PDF here, or click to browse</p>
            <p className="nxtl-drop-hint nxtl-is-formats">PDF ONLY · MAX 4 MB</p>
          </>
        )}
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
      </div>
      {file && (
        <button type="button" onClick={e => { e.stopPropagation(); onClear(); }} className="nxtl-link-btn nxtl-pdf-change">
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <ToolShell
      title="PDF Studio"
      outline="Studio"
      description="Compress, merge, split, rotate and protect PDF files."
      cta
    >
      <div className="nxtl-panel nx-clay nxtl-pdf">

        {/* ── Tab bar ── */}
        <Segmented
          label="Operation"
          size="sm"
          className="nxtl-is-tabs"
          options={TABS.map(t => ({ value: t.key, label: t.label }))}
          value={activeTab}
          onChange={setActiveTab}
        />

        {/* ── COMPRESS ── */}
        {activeTab === 'compress' && (
          <div className="nxtl-is-tab">
            <PdfZone file={compFile} onFile={acceptComp} onClear={() => { setCompFile(null); setCompError(null); setCompResult(null); }} inputRef={compRef} />
            {compError && <ErrCard msg={compError} />}

            <div>
              <span className="nxtl-label">Compression Level</span>
              <div className="nxtl-is-opts">
                {(['low', 'medium', 'high'] as CompLevel[]).map(l => (
                  <ToggleBtn key={l} active={compLevel === l} onClick={() => setCompLevel(l)}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </ToggleBtn>
                ))}
              </div>
              <p className="nxtl-hint nxtl-pdf-hint">
                {compLevel === 'low' && 'Preserves quality, modest size reduction.'}
                {compLevel === 'medium' && 'Balanced compression — recommended for most files.'}
                {compLevel === 'high' && 'Maximum compression + metadata strip. Some quality loss possible.'}
              </p>
            </div>

            {compResult && (
              <div className="nxtl-pdf-result nxtl-pdf-result--stack" aria-live="polite">
                {compResult.procSize > compResult.origSize && (
                  <p className="nxtl-pdf-warn">
                    Compression could not reduce this file further. Try a higher compression level.
                  </p>
                )}
                <p className="nxtl-is-diff">
                  {sizeDiff(compResult.origSize, compResult.procSize)}
                </p>
                <ClayButton onClick={() => triggerDownload(compResult.url, 'compressed.pdf')}>
                  Download Compressed PDF
                </ClayButton>
              </div>
            )}

            <div className="nxtl-actions">
              <ClayButton variant={compResult ? 'ghost' : 'primary'} onClick={processCompress} disabled={!compFile || compLoading} aria-busy={compLoading}>
                {compLoading && <Spinner />}
                {compLoading ? 'Compressing…' : 'Compress PDF'}
              </ClayButton>
            </div>
          </div>
        )}

        {/* ── MERGE ── */}
        {activeTab === 'merge' && (
          <div className="nxtl-is-tab">
            <div
              role="button" tabIndex={0}
              aria-label={mergeFiles.length === 0 ? 'Choose PDFs to merge' : 'Add more PDFs'}
              onClick={() => mergeRef.current?.click()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mergeRef.current?.click(); } }}
              onDragOver={e => { e.preventDefault(); setMergeDragging(true); }}
              onDragLeave={() => setMergeDragging(false)}
              onDrop={e => { e.preventDefault(); setMergeDragging(false); acceptMergeFiles(e.dataTransfer.files); }}
              className={`nxtl-drop${mergeFiles.length > 0 ? ' nxtl-pdf-drop--compact' : ''}${mergeDragging ? ' is-drag' : ''}`}
            >
              <span className="nxtl-drop-title">
                {mergeFiles.length === 0 ? 'Drop PDFs here or click to browse' : '+ Add more PDFs'}
              </span>
              <span className="nxtl-drop-hint nxtl-is-formats">
                MAX {10 - mergeFiles.length} MORE · PDF ONLY
              </span>
              <input ref={mergeRef} type="file" accept=".pdf,application/pdf" multiple style={{ display: 'none' }}
                onChange={e => { if (e.target.files) acceptMergeFiles(e.target.files); e.target.value = ''; }} />
            </div>

            {mergeError && <ErrCard msg={mergeError} />}

            {mergeFiles.length > 0 && (
              <div className="nxtl-pdf-list">
                <ol className="nxtl-pdf-files">
                  {mergeFiles.map((m, i) => (
                    <li key={m.id} className="nxtl-pdf-file">
                      <div className="nxtl-pdf-move">
                        <button
                          type="button"
                          aria-label={`Move ${m.file.name} up`}
                          onClick={() => { const a = [...mergeFiles]; [a[i-1], a[i]] = [a[i], a[i-1]]; setMergeFiles(a); }}
                          disabled={i === 0}
                        >▲</button>
                        <button
                          type="button"
                          aria-label={`Move ${m.file.name} down`}
                          onClick={() => { const a = [...mergeFiles]; [a[i], a[i+1]] = [a[i+1], a[i]]; setMergeFiles(a); }}
                          disabled={i === mergeFiles.length - 1}
                        >▼</button>
                      </div>
                      <span className="nxtl-pdf-icon" aria-hidden="true">📄</span>
                      <div className="nxtl-pdf-file-text">
                        <p className="nxtl-is-file-name">{m.file.name}</p>
                        <p className="nxtl-mono">
                          {formatBytes(m.file.size)}{m.pageCount != null ? ` · ${m.pageCount} page${m.pageCount !== 1 ? 's' : ''}` : ' · loading…'}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${m.file.name}`}
                        onClick={() => setMergeFiles(prev => prev.filter(x => x.id !== m.id))}
                        className="nxtl-pdf-remove"
                      >✕</button>
                    </li>
                  ))}
                </ol>
                <p className="nxtl-mono">
                  {mergeFiles.length} file{mergeFiles.length !== 1 ? 's' : ''}{totalMergePages > 0 ? ` · ${totalMergePages} pages total` : ''}
                </p>
              </div>
            )}

            {mergeResult && <ResultRow url={mergeResult.url} filename="merged.pdf" label="Download Merged PDF" />}

            <div className="nxtl-actions">
              <ClayButton variant={mergeResult ? 'ghost' : 'primary'} onClick={processMerge} disabled={mergeFiles.length < 2 || mergeLoading} aria-busy={mergeLoading}>
                {mergeLoading && <Spinner />}
                {mergeLoading ? 'Merging…' : 'Merge PDFs'}
              </ClayButton>
            </div>
          </div>
        )}

        {/* ── SPLIT ── */}
        {activeTab === 'split' && (
          <div className="nxtl-is-tab">
            <PdfZone file={splitFile} pageCount={splitPageCount} onFile={acceptSplit}
              onClear={() => { setSplitFile(null); setSplitPageCount(null); setSplitError(null); setSplitResult(null); }} inputRef={splitRef} />
            {splitError && <ErrCard msg={splitError} />}

            <div>
              <span className="nxtl-label">Split Mode</span>
              <div className="nxtl-is-opts">
                {([
                  { key: 'extract' as SplitMode, label: 'Extract Pages' },
                  { key: 'split-all' as SplitMode, label: 'Split All Pages' },
                  { key: 'split-at' as SplitMode, label: 'Split At Page' },
                ]).map(m => <ToggleBtn key={m.key} active={splitMode === m.key} onClick={() => setSplitMode(m.key)}>{m.label}</ToggleBtn>)}
              </div>
            </div>

            {splitMode === 'extract' && (
              <div className="nx-field">
                <label htmlFor="pdf-extract">Pages to Extract</label>
                <input id="pdf-extract" type="text" value={splitPages} onChange={e => setSplitPages(e.target.value)}
                  placeholder="e.g. 1, 3, 5-8" aria-invalid={!!splitRangeErr} className="nx-input nxtl-is-num" />
                {splitRangeErr && <p className="nxtl-pdf-err" role="alert">{splitRangeErr}</p>}
                {splitPageCount && !splitRangeErr && (
                  <p className="nxtl-hint">Document has {splitPageCount} pages</p>
                )}
              </div>
            )}

            {splitMode === 'split-all' && (
              <p className="nxtl-pdf-note">
                Each page saved as a separate PDF, packaged into a ZIP archive.
                {splitPageCount != null && <span className="nxtl-pdf-accent"> ({splitPageCount} files)</span>}
              </p>
            )}

            {splitMode === 'split-at' && (
              <div className="nx-field">
                <label htmlFor="pdf-split-at">Split After Page</label>
                <input id="pdf-split-at" type="number" value={splitAt} min={1} max={splitPageCount ? splitPageCount - 1 : undefined}
                  onChange={e => setSplitAt(Number(e.target.value))} className="nx-input nxtl-is-num nxtl-pdf-num" />
                {splitPageCount != null && (
                  <p className="nxtl-hint">
                    Produces: pages 1–{splitAt} + pages {splitAt + 1}–{splitPageCount}. Downloads as ZIP.
                  </p>
                )}
              </div>
            )}

            {splitResult && <ResultRow url={splitResult.url} filename={splitResult.isZip ? 'split.zip' : 'extracted.pdf'} label={splitResult.isZip ? 'Download ZIP' : 'Download PDF'} />}

            <div className="nxtl-actions">
              <ClayButton variant={splitResult ? 'ghost' : 'primary'} onClick={processSplit} disabled={!splitFile || splitLoading || !!splitRangeErr} aria-busy={splitLoading}>
                {splitLoading && <Spinner />}
                {splitLoading ? 'Splitting…' : 'Split PDF'}
              </ClayButton>
            </div>
          </div>
        )}

        {/* ── ROTATE ── */}
        {activeTab === 'rotate' && (
          <div className="nxtl-is-tab">
            <PdfZone file={rotFile} pageCount={rotPageCount} onFile={acceptRot}
              onClear={() => { setRotFile(null); setRotPageCount(null); setRotError(null); setRotResult(null); }} inputRef={rotRef} />
            {rotError && <ErrCard msg={rotError} />}

            <div>
              <span className="nxtl-label">Pages to Rotate</span>
              <div className="nxtl-is-opts">
                <ToggleBtn active={rotAllPages} onClick={() => setRotAllPages(true)}>All Pages</ToggleBtn>
                <ToggleBtn active={!rotAllPages} onClick={() => setRotAllPages(false)}>Specific Pages</ToggleBtn>
              </div>
            </div>
            {!rotAllPages && (
              <div className="nx-field">
                <input type="text" value={rotPages} onChange={e => setRotPages(e.target.value)}
                  placeholder="e.g. 1, 3, 5-8" aria-label="Pages to rotate" aria-invalid={!!rotRangeErr} className="nx-input nxtl-is-num" />
                {rotRangeErr && <p className="nxtl-pdf-err" role="alert">{rotRangeErr}</p>}
                {rotPageCount && !rotRangeErr && (
                  <p className="nxtl-hint">Document has {rotPageCount} pages</p>
                )}
              </div>
            )}

            <div>
              <span className="nxtl-label">Rotation</span>
              <div className="nxtl-is-opts">
                {([
                  { val: 90 as const,  label: '90° Clockwise' },
                  { val: 180 as const, label: '180°' },
                  { val: 270 as const, label: '90° Counter-clockwise' },
                ]).map(r => <ToggleBtn key={r.val} active={rotDegrees === r.val} onClick={() => setRotDegrees(r.val)}>{r.label}</ToggleBtn>)}
              </div>
            </div>

            {rotResult && <ResultRow url={rotResult.url} filename="rotated.pdf" label="Download Rotated PDF" />}

            <div className="nxtl-actions">
              <ClayButton variant={rotResult ? 'ghost' : 'primary'} onClick={processRotate} disabled={!rotFile || rotLoading || !!rotRangeErr} aria-busy={rotLoading}>
                {rotLoading && <Spinner />}
                {rotLoading ? 'Rotating…' : 'Rotate PDF'}
              </ClayButton>
            </div>
          </div>
        )}

        {/* ── PROTECT ── */}
        {activeTab === 'protect' && (
          <div className="nxtl-is-tab">
            <PdfZone file={protFile} onFile={acceptProt}
              onClear={() => { setProtFile(null); setProtError(null); setProtResult(null); }} inputRef={protRef} />
            {protError && <ErrCard msg={protError} />}

            <div className="nx-field">
              <label htmlFor="pdf-pwd">Open Password — required to open the PDF</label>
              <div className="nxtl-pdf-pwd">
                <input id="pdf-pwd" type={protShowUser ? 'text' : 'password'} value={protUserPwd}
                  onChange={e => setProtUserPwd(e.target.value)} placeholder="Enter password…"
                  autoComplete="new-password" className="nx-input" />
                <button type="button" onClick={() => setProtShowUser(v => !v)} aria-pressed={protShowUser} className="nxtl-chip-btn">
                  {protShowUser ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="nx-field">
              <label htmlFor="pdf-owner">Owner Password — controls editing & printing permissions (optional)</label>
              <div className="nxtl-pdf-pwd">
                <input id="pdf-owner" type={protShowOwner ? 'text' : 'password'} value={protOwnerPwd}
                  onChange={e => setProtOwnerPwd(e.target.value)} placeholder="Optional…"
                  autoComplete="new-password" className="nx-input" />
                <button type="button" onClick={() => setProtShowOwner(v => !v)} aria-pressed={protShowOwner} className="nxtl-chip-btn">
                  {protShowOwner ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div>
              <span className="nxtl-label">Encryption Level</span>
              <div className="nxtl-is-opts">
                <ToggleBtn active={protEncLevel === 128} onClick={() => setProtEncLevel(128)}>128-bit</ToggleBtn>
                <ToggleBtn active={protEncLevel === 256} onClick={() => setProtEncLevel(256)}>256-bit</ToggleBtn>
              </div>
            </div>

            <p className="nxtl-pdf-warn">
              Once protected, you will need the password to open this file. Store it safely — there is no recovery option.
            </p>

            {protResult && <ResultRow url={protResult.url} filename="protected.pdf" label="Download Protected PDF" />}

            <div className="nxtl-actions">
              <ClayButton variant={protResult ? 'ghost' : 'primary'} onClick={processProtect} disabled={!protFile || !protUserPwd.trim() || protLoading} aria-busy={protLoading}>
                {protLoading && <Spinner />}
                {protLoading ? 'Encrypting…' : 'Protect PDF'}
              </ClayButton>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
