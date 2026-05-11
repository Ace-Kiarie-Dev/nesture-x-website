'use client';

import { useState } from 'react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

// ── Color math (pure JS) ─────────────────────────────────────────────────────

function clamp(n: number, lo = 0, hi = 255) {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('');
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else                h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));
  const hN = h / 360, sN = s / 100, lN = l / 100;

  if (sN === 0) {
    const v = clamp(lN * 255);
    return rgbToHex(v, v, v);
  }

  const q = lN < 0.5 ? lN * (1 + sN) : lN + sN - lN * sN;
  const p = 2 * lN - q;
  const hue = (t: number) => {
    const tt = ((t % 1) + 1) % 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  return rgbToHex(
    Math.round(hue(hN + 1 / 3) * 255),
    Math.round(hue(hN) * 255),
    Math.round(hue(hN - 1 / 3) * 255),
  );
}

interface Swatch {
  label: string;
  hex: string;
}

function generatePalette(base: string): Swatch[] {
  if (!/^#[0-9a-f]{6}$/i.test(base)) return [];
  const [r, g, b] = hexToRgb(base);
  const [h, s, l] = hexToHsl(base);
  return [
    { label: 'Tint',        hex: rgbToHex(r + (255 - r) * 0.4, g + (255 - g) * 0.4, b + (255 - b) * 0.4) },
    { label: 'Base',        hex: base.toLowerCase() },
    { label: 'Shade',       hex: rgbToHex(r * 0.7, g * 0.7, b * 0.7) },
    { label: 'Complement',  hex: hslToHex(h + 180, s, l) },
    { label: 'Analogous',   hex: hslToHex(h + 30,  s, l) },
  ];
}

// ── Contrast helper for swatch text ─────────────────────────────────────────

function contrastColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  // Relative luminance (WCAG)
  const lum = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const L = 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
  return L > 0.35 ? '#000000' : '#ffffff';
}

// ── Export key names (label → CSS/Tailwind/JSON key) ────────────────────────

// Palette order is fixed: Tint, Base, Shade, Complement, Analogous
const EXPORT_KEYS = ['tint', 'base', 'shade', 'complementary', 'analogous'];

// ── PNG export ───────────────────────────────────────────────────────────────

function exportPNG(palette: Swatch[]) {
  const SW = 200, SH = 300, LABEL_H = 64;
  const canvas = document.createElement('canvas');
  canvas.width = SW * palette.length; // 1000px for 5 swatches
  canvas.height = SH;
  const ctx = canvas.getContext('2d')!;

  palette.forEach((sw, i) => {
    const x = i * SW;
    const isDark = contrastColor(sw.hex) === '#ffffff';
    ctx.fillStyle = sw.hex;
    ctx.fillRect(x, 0, SW, SH - LABEL_H);
    ctx.fillStyle = isDark ? '#1a1a1a' : '#f5f5f5';
    ctx.fillRect(x, SH - LABEL_H, SW, LABEL_H);
    ctx.fillStyle = isDark ? '#888888' : '#555555';
    ctx.font = '600 11px sans-serif';
    ctx.fillText(EXPORT_KEYS[i] ?? sw.label.toLowerCase(), x + 12, SH - LABEL_H + 22);
    ctx.fillStyle = isDark ? '#cccccc' : '#222222';
    ctx.font = '13px monospace';
    ctx.fillText(sw.hex, x + 12, SH - LABEL_H + 44);
  });

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'palette.png';
  a.click();
}

// ── Page ─────────────────────────────────────────────────────────────────────

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
  marginBottom: '0.5rem',
};

export default function ColorPalettePage() {
  const [baseHex, setBaseHex] = useState('#1a6fd4');
  const [hexInput, setHexInput] = useState('#1a6fd4');
  const [palette, setPalette] = useState<Swatch[]>(() => generatePalette('#1a6fd4'));
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  function applyHex(raw: string) {
    const hex = raw.startsWith('#') ? raw : `#${raw}`;
    setHexInput(hex);
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      setBaseHex(hex);
      setPalette(generatePalette(hex));
    }
  }

  function handleGenerate() {
    setPalette(generatePalette(baseHex));
  }

  async function copyHex(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1800);
    } catch { /* silent — clipboard may be blocked */ }
  }

  async function copyAllCSS() {
    const css = palette
      .map((sw, i) => `--color-${EXPORT_KEYS[i] ?? sw.label.toLowerCase()}: ${sw.hex};`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(css);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    } catch { /* silent */ }
  }

  async function copyTailwind() {
    const inner = palette
      .map((sw, i) => `  ${EXPORT_KEYS[i] ?? sw.label.toLowerCase()}: '${sw.hex}',`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(`colors: {\n${inner}\n}`);
      setCopiedTailwind(true);
      setTimeout(() => setCopiedTailwind(false), 1800);
    } catch { /* silent */ }
  }

  async function copyJson() {
    const obj = Object.fromEntries(
      palette.map((sw, i) => [EXPORT_KEYS[i] ?? sw.label.toLowerCase(), sw.hex])
    );
    try {
      await navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 1800);
    } catch { /* silent */ }
  }

  const hexValid = /^#[0-9a-f]{6}$/i.test(hexInput);

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
        COLOR PALETTE GENERATOR
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
        Generate beautiful colour palettes from any base colour.
      </p>

      {/* Controls */}
      <div style={{ ...GLASS, maxWidth: '540px', marginBottom: '2rem' }}>
        <label style={LABEL}>Base Colour</label>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input
            type="color"
            value={baseHex}
            onChange={e => { setBaseHex(e.target.value); setHexInput(e.target.value); setPalette(generatePalette(e.target.value)); }}
            style={{
              width: '44px',
              height: '44px',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              padding: '2px',
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            value={hexInput}
            maxLength={7}
            onChange={e => applyHex(e.target.value)}
            placeholder="#1a6fd4"
            style={{
              background: 'rgba(10, 10, 10, 0.6)',
              border: `1px solid ${hexValid ? 'rgba(255,255,255,0.12)' : 'rgba(239,68,68,0.5)'}`,
              padding: '0.6rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              color: 'var(--color-text)',
              outline: 'none',
              width: '120px',
            }}
            onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={e => (e.target.style.borderColor = hexValid ? 'rgba(255,255,255,0.12)' : 'rgba(239,68,68,0.5)')}
          />
          {!hexValid && hexInput.length > 1 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgb(239,68,68)' }}>
              Invalid hex
            </span>
          )}
        </div>

        <NxButton variant="primary" size="sm" onClick={handleGenerate} disabled={!hexValid}>
          Generate Palette
        </NxButton>
      </div>

      {/* Swatches */}
      {palette.length > 0 && (
        <>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              maxWidth: '900px',
            }}
          >
            {palette.map(sw => {
              const textCol = contrastColor(sw.hex);
              const isCopied = copiedHex === sw.hex;
              return (
                <button
                  key={sw.hex + sw.label}
                  data-hover
                  onClick={() => copyHex(sw.hex)}
                  title={`Click to copy ${sw.hex}`}
                  style={{
                    flex: '1 1 130px',
                    minWidth: '110px',
                    maxWidth: '200px',
                    height: '160px',
                    background: sw.hex,
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '0.6rem 0.75rem',
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
                    (e.currentTarget as HTMLElement).style.zIndex = '1';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.zIndex = '0';
                  }}
                >
                  {isCopied && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.45)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Copied!
                    </div>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: textCol, opacity: 0.6 }}>
                    {sw.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.04em', color: textCol }}>
                    {sw.hex}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Export actions — 2×2 on mobile, single row on desktop */}
          <style>{`.palette-export{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem;max-width:900px}@media(min-width:640px){.palette-export{grid-template-columns:repeat(4,auto)}}`}</style>
          <div className="palette-export">
            <NxButton variant="ghost" size="sm" onClick={copyAllCSS}>
              {copiedAll ? 'Copied!' : 'Copy CSS Variables'}
            </NxButton>
            <NxButton variant="ghost" size="sm" onClick={copyTailwind}>
              {copiedTailwind ? 'Copied!' : 'Copy Tailwind Config'}
            </NxButton>
            <NxButton variant="ghost" size="sm" onClick={copyJson}>
              {copiedJson ? 'Copied!' : 'Copy JSON'}
            </NxButton>
            <NxButton variant="ghost" size="sm" onClick={() => exportPNG(palette)}>
              Export as PNG
            </NxButton>
          </div>
        </>
      )}

      <ToolCTA />
    </main>
  );
}
