'use client';

import { useState, useRef, useCallback } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented, Spinner, Status } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';

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
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="nxtl-is-switch"
    >
      <span className="nxtl-toggle-track" aria-hidden="true" />
      <span className="nxtl-toggle-label">{label}</span>
    </button>
  );
}

function ToggleBtn({
  active, onClick, children, title, small,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode; title?: string; small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`nxtl-is-opt${small ? ' nxtl-is-opt--sm' : ''}`}
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
    <label className="nxtl-is-slider">
      <span className="nxtl-range-head">
        <span className="nxtl-label" style={{ marginBottom: 0 }}>{label}</span>
        <span className="nxtl-is-slider-val">
          {value}{unit}
        </span>
      </span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="nxtl-range"
      />
    </label>
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
    <ToolShell
      title="Image Studio"
      outline="Studio"
      description="Convert, compress, resize, transform and adjust images. Full power, one tool."
      cta
    >
      <div className="nxtl-panes nxtl-panes--wide-left">

        {/* ── Controls ── */}
        <div className="nxtl-panel nx-clay">

          {/* ── Upload zone / preview ── */}
          {!file ? (
            <div
              role="button" tabIndex={0} aria-label="Upload image"
              onClick={() => inputRef.current?.click()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`nxtl-drop${dragging ? ' is-drag' : ''}`}
            >
              <span className="nxtl-is-drop-icon" aria-hidden="true">↑</span>
              <p className="nxtl-drop-title">
                Drop an image here, or click to browse
              </p>
              <p className="nxtl-drop-hint nxtl-is-formats">
                JPEG · PNG · WebP · AVIF · GIF · TIFF · BMP · ICO — MAX 4 MB
              </p>
              <input
                ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f); e.target.value = ''; }}
              />
            </div>
          ) : (
            <div className="nxtl-is-file">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview!} alt="Preview" className="nxtl-is-thumb" />
              <div className="nxtl-is-file-text">
                <p className="nxtl-is-file-name">
                  {file.name}
                </p>
                <p className="nxtl-mono">
                  {formatBytes(file.size)}{origDims ? ` · ${origDims.w}×${origDims.h}px` : ''}
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className="nxtl-link-btn nxtl-is-change"
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
          {fileError && <Status tone="error">{fileError}</Status>}

          {/* ── Tab bar ── */}
          <Segmented
            label="Operation"
            size="sm"
            className="nxtl-is-tabs"
            options={TABS.map(t => ({ value: t.key, label: t.label }))}
            value={activeTab}
            onChange={setActiveTab}
          />

          {/* ── Tab: Convert ── */}
          {activeTab === 'convert' && (
            <div className="nxtl-is-tab">
              <div>
                <span className="nxtl-label">Output Format</span>
                <div className="nxtl-is-opts nxtl-is-opts--grid">
                  {FORMATS.map(f => (
                    <ToggleBtn key={f} active={convFmt === f} onClick={() => setConvFmt(f)}>
                      {f.toUpperCase()}
                    </ToggleBtn>
                  ))}
                </div>
              </div>
              {LOSSY.includes(convFmt) && (
                <SliderRow label={`Quality`} value={convQuality} min={10} max={100} unit="%" onChange={setConvQuality} />
              )}
            </div>
          )}

          {/* ── Tab: Compress ── */}
          {activeTab === 'compress' && (
            <div className="nxtl-is-tab">
              <SliderRow label="Quality" value={compQuality} min={10} max={90} unit="%" onChange={setCompQuality} />
              <p className="nxtl-hint">
                Lower quality = smaller file size. Recommended: 70–85 for most use cases.
                Output format matches the input file.
              </p>
            </div>
          )}

          {/* ── Tab: Resize ── */}
          {activeTab === 'resize' && (
            <div className="nxtl-is-tab">
              {/* W × H inputs */}
              <div className="nxtl-is-wh">
                <div className="nx-field">
                  <label htmlFor="is-w">Width (px)</label>
                  <input id="is-w" type="number" min={1} value={resizeW} onChange={e => handleWidthChange(e.target.value)} className="nx-input nxtl-is-num" />
                </div>
                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  title={lockAspect ? 'Aspect ratio locked — click to unlock' : 'Aspect ratio unlocked — click to lock'}
                  aria-label={lockAspect ? 'Aspect ratio locked — click to unlock' : 'Aspect ratio unlocked — click to lock'}
                  aria-pressed={lockAspect}
                  className="nxtl-is-lock"
                >
                  {lockAspect ? '🔒' : '🔓'}
                </button>
                <div className="nx-field">
                  <label htmlFor="is-h">Height (px)</label>
                  <input id="is-h" type="number" min={1} value={resizeH} onChange={e => handleHeightChange(e.target.value)} className="nx-input nxtl-is-num" />
                </div>
              </div>

              {/* % buttons */}
              <div>
                <span className="nxtl-label">Quick Scale</span>
                <div className="nxtl-is-opts">
                  {[25, 50, 75, 100, 150, 200].map(pct => (
                    <ToggleBtn key={pct} active={false} onClick={() => applyPct(pct)} small>
                      {pct}%
                    </ToggleBtn>
                  ))}
                </div>
              </div>

              {/* Fit mode */}
              <div>
                <span className="nxtl-label">Fit Mode</span>
                <div className="nxtl-is-opts">
                  {FIT_MODES.map(m => (
                    <ToggleBtn key={m.value} active={fitMode === m.value} onClick={() => setFitMode(m.value)} title={m.tip}>
                      {m.label}
                    </ToggleBtn>
                  ))}
                </div>
              </div>

              {/* Social presets */}
              <div>
                <span className="nxtl-label">Social Media Presets</span>
                <div className="nxtl-is-opts">
                  {SOCIAL_PRESETS.map(p => (
                    <ToggleBtn key={p.label} active={parseInt(resizeW) === p.w && parseInt(resizeH) === p.h} onClick={() => applyPreset(p.w, p.h)} small>
                      {p.label}
                    </ToggleBtn>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Transform ── */}
          {activeTab === 'transform' && (
            <div className="nxtl-is-tab">
              {/* Flip */}
              <div>
                <span className="nxtl-label">Flip</span>
                <div className="nxtl-is-opts">
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
              </div>

              {/* Rotate */}
              <div>
                <span className="nxtl-label">Rotate</span>
                <div className="nxtl-is-opts">
                  {[90, 180, 270].map(deg => (
                    <ToggleBtn key={deg} active={rotAngle === deg} onClick={() => setRotAngle(rotAngle === deg ? 0 : deg)}>
                      {deg}°
                    </ToggleBtn>
                  ))}
                </div>
              </div>
              <div className="nxtl-is-angle">
                <div className="nx-field">
                  <label htmlFor="is-angle">Custom Angle</label>
                  <input
                    id="is-angle"
                    type="number" min={-360} max={360} value={rotAngle}
                    onChange={e => setRotAngle(Math.max(-360, Math.min(360, Number(e.target.value))))}
                    className="nx-input nxtl-is-num"
                  />
                </div>
                <span className="nxtl-mono">
                  deg (–360 to 360)
                </span>
              </div>

              {/* Trim */}
              <Toggle on={trim} onChange={setTrim} label="Auto-trim whitespace borders" />

              {/* Extend canvas */}
              <div>
                <span className="nxtl-label">Extend Canvas (px)</span>
                <div className="nxtl-is-extend">
                  {([['Top', extTop, setExtTop], ['Right', extRight, setExtRight], ['Bottom', extBottom, setExtBottom], ['Left', extLeft, setExtLeft]] as [string, number, (v: number) => void][]).map(([label, val, set]) => (
                    <label key={label} className="nx-field">
                      <span>{label}</span>
                      <input type="number" min={0} max={2000} value={val}
                        onChange={e => set(Math.max(0, Math.min(2000, Number(e.target.value))))}
                        className="nx-input nxtl-is-num" />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <span className="nxtl-label">Fill Colour</span>
                <span className="nxtl-color">
                  <input type="color" value={extFill} onChange={e => setExtFill(e.target.value)} aria-label="Fill colour" />
                  <span className="nxtl-mono">{extFill}</span>
                </span>
              </div>
            </div>
          )}

          {/* ── Tab: Adjustments ── */}
          {activeTab === 'adjustments' && (
            <div className="nxtl-is-tab">
              <Toggle on={grayscale} onChange={setGrayscale} label="Grayscale" />

              {!grayscale && (
                <div>
                  <span className="nxtl-label">Tint Colour (optional)</span>
                  <span className="nxtl-color">
                    <input type="color" value={tint || '#1a6fd4'} onChange={e => setTint(e.target.value)} aria-label="Tint colour" />
                    <span className="nxtl-mono">
                      {tint || 'none'}
                    </span>
                    {tint && (
                      <button type="button" onClick={() => setTint('')} className="nxtl-link-btn">
                        Remove
                      </button>
                    )}
                  </span>
                </div>
              )}

              <SliderRow label="Brightness" value={brightness} min={-100} max={100} unit="" onChange={setBrightness} />
              <SliderRow label="Saturation" value={saturation} min={-100} max={100} unit="" onChange={setSaturation} />
              <SliderRow label="Contrast"   value={contrast}   min={-100} max={100} unit="" onChange={setContrast}   />
              <SliderRow label="Hue"        value={hue}        min={0}    max={360} unit="°" onChange={setHue}        />
              <SliderRow label="Blur"       value={blurVal}    min={0}    max={20}  unit="px" onChange={setBlurVal}   />

              <Toggle on={sharpenOn} onChange={setSharpenOn} label="Sharpen" />
              {sharpenOn && (
                <SliderRow label="Sharpen Sigma" value={sharpenSigma} min={0.5} max={3} step={0.1} unit="" onChange={setSharpenSigma} />
              )}
            </div>
          )}

          {/* ── Process button ── */}
          <div className="nxtl-actions">
            <ClayButton onClick={handleProcess} disabled={!file || loading} aria-busy={loading}>
              {loading && <Spinner />}
              {loading ? 'Processing…' : 'Process Image'}
            </ClayButton>
          </div>
        </div>

        {/* ── Result stage ── */}
        <div className="nxtl-is-out">
          <div className="nxtl-stage nxtl-stage--checker nxtl-is-stage" aria-live="polite">
            {result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={result.url} alt="Processed" className="nxtl-is-result-img" style={{ opacity: loading ? 0.35 : 1 }} />
            ) : preview && !fileError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="nxtl-is-result-img nxtl-is-original" style={{ opacity: loading ? 0.35 : 0.55 }} />
            ) : (
              <div className="nxtl-stage-empty">
                <span className="nxtl-is-ph" aria-hidden="true">IMG</span>
                Your processed image appears here
              </div>
            )}
            {loading && <span className="nxtl-stage-busy"><Spinner /> Processing…</span>}
            {!result && preview && !loading && !fileError && <span className="nxtl-is-tag">Original</span>}
          </div>

          {/* ── Process error ── */}
          {processError && <Status tone="error">{processError}</Status>}

          {/* ── Result ── */}
          {result && (
            <div className="nxtl-panel nx-clay nxtl-is-result">
              <p className="nxtl-is-diff">
                {sizeDiff(result.origSize, result.procSize)}
              </p>
              <div className="nxtl-actions">
                <ClayButton onClick={handleDownload}>
                  Download Image
                </ClayButton>
                <button
                  type="button"
                  onClick={resetAll}
                  className="nxtl-link-btn"
                >
                  Process Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
