'use client';

import { useState, useRef, useCallback } from 'react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'convert' | 'compress' | 'resize' | 'transform' | 'adjustments';
type OutputFormat = 'jpg' | 'png' | 'webp' | 'avif' | 'tiff' | 'bmp' | 'gif' | 'ico';
type FitMode = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_BYTES = 4 * 1024 * 1024;
const FORMATS: OutputFormat[] = ['jpg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif', 'ico'];
const LOSSY: OutputFormat[] = ['jpg', 'webp', 'avif'];
const TABS: { key: Tab; label: string }[] = [
  { key: 'convert', label: 'Convert' },
  { key: 'compress', label: 'Compress' },
  { key: 'resize', label: 'Resize' },
  { key: 'transform', label: 'Transform' },
  { key: 'adjustments', label: 'Adjustments' },
];
const FIT_MODES: { value: FitMode; label: string; tip: string }[] = [
  { value: 'cover',   label: 'Cover',   tip: 'Resize to cover the target box, cropping any overflow' },
  { value: 'contain', label: 'Contain', tip: 'Resize to fit within the target box, letterboxing if needed' },
  { value: 'fill',    label: 'Fill',    tip: 'Stretch to exactly fill the target dimensions' },
  { value: 'inside',  label: 'Inside',  tip: 'Resize so image fits inside the box, never upscaling' },
  { value: 'outside', label: 'Outside', tip: 'Resize so image covers the box, never downscaling' },
];
const SOCIAL_PRESETS = [
  { label: 'Instagram Post',  w: 1080, h: 1080 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'Twitter/X Post',  w: 1200, h: 675  },
  { label: 'LinkedIn Cover',  w: 1584, h: 396  },
  { label: 'Facebook Cover',  w: 820,  h: 312  },
  { label: 'YouTube Thumb',   w: 1280, h: 720  },
];

// ── Styles ────────────────────────────────────────────────────────────────────

const GLASS: React.CSSProperties = {
  background: 'rgba(20, 25, 32, 0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.1)',
};
const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(245,245,245,0.35)',
  display: 'block',
  marginBottom: '0.5rem',
};
const INPUT: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem',
  padding: '0.5rem 0.75rem',
  width: '100%',
  outline: 'none',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function sizeDiff(orig: number, proc: number) {
  if (!orig) return '';
  const pct = Math.abs(((orig - proc) / orig) * 100).toFixed(1);
  return proc <= orig
    ? `${formatBytes(orig)} → ${formatBytes(proc)} — ${pct}% smaller`
    : `${formatBytes(orig)} → ${formatBytes(proc)} — ${pct}% larger`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
      <div
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        style={{
          width: '40px', height: '22px', flexShrink: 0,
          background: on ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          position: 'relative', transition: 'background 150ms ease',
        }}
      >
        <div style={{
          position: 'absolute', top: '2px', left: on ? '20px' : '2px',
          width: '16px', height: '16px', background: 'var(--color-text)',
          transition: 'left 150ms ease',
        }} />
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(245,245,245,0.7)' }}>{label}</span>
    </label>
  );
}

function ToggleBtn({
  active, onClick, children, title, small,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode; title?: string; small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: small ? '0.7rem' : '0.78rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        padding: small ? '0.35rem 0.6rem' : '0.5rem 0.75rem',
        border: active ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
        background: active ? 'var(--color-primary)' : 'rgba(20,25,32,0.8)',
        color: 'var(--color-text)',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'border-color 120ms ease, background 120ms ease',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget).style.borderColor = 'var(--color-primary)'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.1)'; }}
    >
      {children}
    </button>
  );
}

function SliderRow({
  label, value, min, max, step = 1, unit = '', onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={LABEL}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-primary)' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
      />
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ImageStudioPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  // File state
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<Tab>('convert');

  // Convert
  const [convFmt, setConvFmt]         = useState<OutputFormat>('webp');
  const [convQuality, setConvQuality] = useState(85);

  // Compress
  const [compQuality, setCompQuality] = useState(80);

  // Resize
  const [resizeW, setResizeW]     = useState('');
  const [resizeH, setResizeH]     = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [fitMode, setFitMode]     = useState<FitMode>('cover');

  // Transform
  const [flipH, setFlipH]   = useState(false);
  const [flipV, setFlipV]   = useState(false);
  const [rotAngle, setRotAngle] = useState(0);
  const [trim, setTrim]     = useState(false);
  const [extTop, setExtTop]       = useState(0);
  const [extRight, setExtRight]   = useState(0);
  const [extBottom, setExtBottom] = useState(0);
  const [extLeft, setExtLeft]     = useState(0);
  const [extFill, setExtFill]     = useState('#ffffff');

  // Adjustments
  const [grayscale, setGrayscale]       = useState(false);
  const [tint, setTint]                 = useState('');
  const [brightness, setBrightness]     = useState(0);
  const [saturation, setSaturation]     = useState(0);
  const [contrast, setContrast]         = useState(0);
  const [hue, setHue]                   = useState(0);
  const [blurVal, setBlurVal]           = useState(0);
  const [sharpenOn, setSharpenOn]       = useState(false);
  const [sharpenSigma, setSharpenSigma] = useState(1);

  // Result
  const [loading, setLoading]         = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string; origSize: number; procSize: number; fmt: OutputFormat;
  } | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function acceptFile(f: File) {
    setFileError(null);
    setProcessError(null);
    setResult(null);
    if (!f.type.startsWith('image/')) { setFileError('Please upload a valid image file.'); return; }
    if (f.size > MAX_BYTES) { setFileError(`File is ${formatBytes(f.size)} — exceeds the 4 MB limit.`); return; }
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    const objUrl = URL.createObjectURL(f);
    setPreview(objUrl);
    const img = new Image();
    img.onload = () => {
      const dims = { w: img.naturalWidth, h: img.naturalHeight };
      setOrigDims(dims);
      setResizeW(String(dims.w));
      setResizeH(String(dims.h));
    };
    img.src = objUrl;
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) acceptFile(f);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  function handleWidthChange(val: string) {
    setResizeW(val);
    if (lockAspect && origDims && val) {
      const n = parseInt(val);
      if (!isNaN(n) && n > 0) setResizeH(String(Math.round(n * origDims.h / origDims.w)));
    }
  }

  function handleHeightChange(val: string) {
    setResizeH(val);
    if (lockAspect && origDims && val) {
      const n = parseInt(val);
      if (!isNaN(n) && n > 0) setResizeW(String(Math.round(n * origDims.w / origDims.h)));
    }
  }

  function applyPct(pct: number) {
    if (!origDims) return;
    setResizeW(String(Math.round(origDims.w * pct / 100)));
    setResizeH(String(Math.round(origDims.h * pct / 100)));
  }

  function applyPreset(w: number, h: number) {
    setResizeW(String(w));
    setResizeH(String(h));
    setLockAspect(false);
  }

  async function handleProcess() {
    if (!file) return;
    setLoading(true);
    setProcessError(null);
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);

    try {
      const config = {
        activeTab,
        convert:  { format: convFmt, quality: convQuality },
        compress: { quality: compQuality },
        resize: {
          width:  resizeW ? (parseInt(resizeW) || null) : null,
          height: resizeH ? (parseInt(resizeH) || null) : null,
          fit: fitMode,
          maintainAspectRatio: lockAspect,
        },
        transform: {
          flipHorizontal: flipH,
          flipVertical:   flipV,
          rotate: rotAngle,
          trim,
          extend: { top: extTop, right: extRight, bottom: extBottom, left: extLeft, fillColour: extFill },
        },
        adjustments: {
          grayscale,
          tint: tint || null,
          brightness, saturation, contrast, hue,
          blur: blurVal,
          sharpen: sharpenOn,
          sharpenSigma,
        },
      };

      const body = new FormData();
      body.append('file', file);
      body.append('config', JSON.stringify(config));

      const res = await fetch('/api/tools/image-studio', { method: 'POST', body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Processing failed.');
      }

      const origSize = parseInt(res.headers.get('X-Original-Size') ?? '0', 10);
      const procSize = parseInt(res.headers.get('X-Processed-Size') ?? '0', 10);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const fmt  = (activeTab === 'convert'
        ? convFmt
        : (FORMATS.find(f => file.type.includes(f === 'jpg' ? 'jpeg' : f)) ?? 'webp')) as OutputFormat;

      setResult({ url, origSize, procSize, fmt });
    } catch (err: unknown) {
      setProcessError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const stem = file?.name.replace(/\.[^/.]+$/, '') ?? 'image';
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${stem}-studio.${result.fmt}`;
    a.click();
  }

  function resetAll() {
    if (preview) URL.revokeObjectURL(preview);
    if (result) URL.revokeObjectURL(result.url);
    setFile(null); setPreview(null); setOrigDims(null);
    setFileError(null); setProcessError(null); setResult(null);
    setResizeW(''); setResizeH('');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main style={{ padding: 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem) clamp(4rem, 6vw, 6rem)', background: 'var(--color-bg)' }}>
      <BackLink />

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 8vw, 8rem)', lineHeight: 0.9, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
        IMAGE STUDIO
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)', color: 'rgba(245,245,245,0.5)', marginBottom: '2.5rem', maxWidth: '44rem' }}>
        Convert, compress, resize, transform and adjust images. Full power, one tool.
      </p>

      {/* ── Main card ── */}
      <div style={{ ...GLASS, padding: 'clamp(1.5rem, 3vw, 2.25rem)', maxWidth: '760px' }}>

        {/* ── Upload zone / preview ── */}
        {!file ? (
          <div
            role="button" tabIndex={0} aria-label="Upload image"
            onClick={() => inputRef.current?.click()}
            onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            style={{
              border: `2px dashed ${dragging ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
              padding: '2.5rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '1.75rem',
              transition: 'border-color 150ms ease, background 150ms ease',
              background: dragging ? 'rgba(26,111,212,0.05)' : 'transparent',
              minHeight: '160px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '2rem', color: 'rgba(26,111,212,0.5)', lineHeight: 1 }}>↑</div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(245,245,245,0.4)', lineHeight: 1.5 }}>
              Drop an image here, or click to browse
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: 'rgba(245,245,245,0.2)' }}>
              JPEG · PNG · WebP · AVIF · GIF · TIFF · BMP · ICO — MAX 4 MB
            </p>
            <input
              ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f); e.target.value = ''; }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.75rem', padding: '1rem', background: 'rgba(26,111,212,0.04)', border: '1px solid rgba(26,111,212,0.12)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview!} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(255,255,255,0.08)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
                {file.name}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(245,245,245,0.35)', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                {formatBytes(file.size)}{origDims ? ` · ${origDims.w}×${origDims.h}px` : ''}
              </p>
              <button
                onClick={resetAll}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Change image
              </button>
            </div>
            <input
              ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f); e.target.value = ''; }}
            />
          </div>
        )}

        {/* ── File error ── */}
        {fileError && (
          <div style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.07)', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)' }}>{fileError}</p>
          </div>
        )}

        {/* ── Tab bar ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.75rem', overflowX: 'auto', gap: 0 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '0.65rem 1.1rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === t.key ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === t.key ? 'var(--color-primary)' : 'rgba(245,245,245,0.4)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 120ms ease',
                marginBottom: '-1px',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Convert ── */}
        {activeTab === 'convert' && (
          <div>
            <span style={LABEL}>Output Format</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {FORMATS.map(f => (
                <ToggleBtn key={f} active={convFmt === f} onClick={() => setConvFmt(f)}>
                  {f.toUpperCase()}
                </ToggleBtn>
              ))}
            </div>
            {LOSSY.includes(convFmt) && (
              <SliderRow label={`Quality`} value={convQuality} min={10} max={100} unit="%" onChange={setConvQuality} />
            )}
          </div>
        )}

        {/* ── Tab: Compress ── */}
        {activeTab === 'compress' && (
          <div>
            <SliderRow label="Quality" value={compQuality} min={10} max={90} unit="%" onChange={setCompQuality} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.35)', lineHeight: 1.6, marginTop: '-0.5rem' }}>
              Lower quality = smaller file size. Recommended: 70–85 for most use cases.
              Output format matches the input file.
            </p>
          </div>
        )}

        {/* ── Tab: Resize ── */}
        {activeTab === 'resize' && (
          <div>
            {/* W × H inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'end', marginBottom: '1.25rem' }}>
              <div>
                <span style={LABEL}>Width (px)</span>
                <input type="number" min={1} value={resizeW} onChange={e => handleWidthChange(e.target.value)} style={INPUT} />
              </div>
              <div
                onClick={() => setLockAspect(!lockAspect)}
                title={lockAspect ? 'Aspect ratio locked — click to unlock' : 'Aspect ratio unlocked — click to lock'}
                style={{
                  padding: '0.5rem',
                  border: `1px solid ${lockAspect ? 'var(--color-primary)' : 'rgba(255,255,255,0.12)'}`,
                  cursor: 'pointer',
                  color: lockAspect ? 'var(--color-primary)' : 'rgba(245,245,245,0.3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: '1.5rem',
                  alignSelf: 'flex-end',
                  userSelect: 'none',
                  transition: 'border-color 150ms ease, color 150ms ease',
                }}
              >
                {lockAspect ? '🔒' : '🔓'}
              </div>
              <div>
                <span style={LABEL}>Height (px)</span>
                <input type="number" min={1} value={resizeH} onChange={e => handleHeightChange(e.target.value)} style={INPUT} />
              </div>
            </div>

            {/* % buttons */}
            <span style={LABEL}>Quick Scale</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {[25, 50, 75, 100, 150, 200].map(pct => (
                <ToggleBtn key={pct} active={false} onClick={() => applyPct(pct)} small>
                  {pct}%
                </ToggleBtn>
              ))}
            </div>

            {/* Fit mode */}
            <span style={LABEL}>Fit Mode</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {FIT_MODES.map(m => (
                <ToggleBtn key={m.value} active={fitMode === m.value} onClick={() => setFitMode(m.value)} title={m.tip}>
                  {m.label}
                </ToggleBtn>
              ))}
            </div>

            {/* Social presets */}
            <span style={LABEL}>Social Media Presets</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {SOCIAL_PRESETS.map(p => (
                <ToggleBtn key={p.label} active={parseInt(resizeW) === p.w && parseInt(resizeH) === p.h} onClick={() => applyPreset(p.w, p.h)} small>
                  {p.label}
                </ToggleBtn>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Transform ── */}
        {activeTab === 'transform' && (
          <div>
            {/* Flip */}
            <span style={{ ...LABEL, marginBottom: '0.75rem' }}>Flip</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
              <ToggleBtn active={flipH} onClick={() => setFlipH(!flipH)}>
                Flip Horizontal
              </ToggleBtn>
              <ToggleBtn active={flipV} onClick={() => setFlipV(!flipV)}>
                Flip Vertical
              </ToggleBtn>
              <ToggleBtn active={flipH && flipV} onClick={() => { const both = flipH && flipV; setFlipH(!both); setFlipV(!both); }}>
                Flip Both
              </ToggleBtn>
            </div>

            {/* Rotate */}
            <span style={{ ...LABEL, marginBottom: '0.75rem' }}>Rotate</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {[90, 180, 270].map(deg => (
                <ToggleBtn key={deg} active={rotAngle === deg} onClick={() => setRotAngle(rotAngle === deg ? 0 : deg)}>
                  {deg}°
                </ToggleBtn>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
              <div style={{ flex: 1 }}>
                <span style={LABEL}>Custom Angle</span>
                <input
                  type="number" min={-360} max={360} value={rotAngle}
                  onChange={e => setRotAngle(Math.max(-360, Math.min(360, Number(e.target.value))))}
                  style={INPUT}
                />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(245,245,245,0.3)', alignSelf: 'flex-end', paddingBottom: '0.55rem' }}>
                deg (–360 to 360)
              </span>
            </div>

            {/* Trim */}
            <div style={{ marginBottom: '1.75rem' }}>
              <Toggle on={trim} onChange={setTrim} label="Auto-trim whitespace borders" />
            </div>

            {/* Extend canvas */}
            <span style={{ ...LABEL, marginBottom: '0.75rem' }}>Extend Canvas (px)</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              {([['Top', extTop, setExtTop], ['Right', extRight, setExtRight], ['Bottom', extBottom, setExtBottom], ['Left', extLeft, setExtLeft]] as [string, number, (v: number) => void][]).map(([label, val, set]) => (
                <div key={label}>
                  <span style={LABEL}>{label}</span>
                  <input type="number" min={0} max={2000} value={val}
                    onChange={e => set(Math.max(0, Math.min(2000, Number(e.target.value))))}
                    style={INPUT} />
                </div>
              ))}
            </div>
            <div>
              <span style={LABEL}>Fill Colour</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input type="color" value={extFill} onChange={e => setExtFill(e.target.value)}
                  style={{ width: '40px', height: '36px', border: '1px solid rgba(255,255,255,0.12)', background: 'none', cursor: 'pointer', padding: '2px' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(245,245,245,0.5)' }}>{extFill}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Adjustments ── */}
        {activeTab === 'adjustments' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Toggle on={grayscale} onChange={setGrayscale} label="Grayscale" />
            </div>

            {!grayscale && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={LABEL}>Tint Colour (optional)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="color" value={tint || '#1a6fd4'} onChange={e => setTint(e.target.value)}
                    style={{ width: '40px', height: '36px', border: '1px solid rgba(255,255,255,0.12)', background: 'none', cursor: 'pointer', padding: '2px' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(245,245,245,0.5)' }}>
                    {tint || 'none'}
                  </span>
                  {tint && (
                    <button onClick={() => setTint('')} style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}

            <SliderRow label="Brightness" value={brightness} min={-100} max={100} unit="" onChange={setBrightness} />
            <SliderRow label="Saturation" value={saturation} min={-100} max={100} unit="" onChange={setSaturation} />
            <SliderRow label="Contrast"   value={contrast}   min={-100} max={100} unit="" onChange={setContrast}   />
            <SliderRow label="Hue"        value={hue}        min={0}    max={360} unit="°" onChange={setHue}        />
            <SliderRow label="Blur"       value={blurVal}    min={0}    max={20}  unit="px" onChange={setBlurVal}   />

            <div style={{ marginBottom: '1rem' }}>
              <Toggle on={sharpenOn} onChange={setSharpenOn} label="Sharpen" />
            </div>
            {sharpenOn && (
              <SliderRow label="Sharpen Sigma" value={sharpenSigma} min={0.5} max={3} step={0.1} unit="" onChange={setSharpenSigma} />
            )}
          </div>
        )}

        {/* ── Process error ── */}
        {processError && (
          <div style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.07)', padding: '0.75rem 1rem', marginBottom: '1.25rem', marginTop: '1rem' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)' }}>{processError}</p>
          </div>
        )}

        {/* ── Result ── */}
        {result && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(26,111,212,0.04)', border: '1px solid rgba(26,111,212,0.12)', marginBottom: '1.25rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Processed" style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.06)' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.5)', letterSpacing: '0.06em', marginBottom: '1rem' }}>
              {sizeDiff(result.origSize, result.procSize)}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <NxButton variant="ghost" size="sm" onClick={handleDownload}>
                Download Image
              </NxButton>
              <button
                onClick={resetAll}
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(245,245,245,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
              >
                Process Again
              </button>
            </div>
          </div>
        )}

        {/* ── Process button ── */}
        <div style={{ marginTop: result ? 0 : '1.5rem' }}>
          <NxButton variant="primary" size="md" onClick={handleProcess} disabled={!file || loading}>
            {loading ? 'Processing…' : 'Process Image'}
          </NxButton>
        </div>
      </div>

      <ToolCTA />
    </main>
  );
}
