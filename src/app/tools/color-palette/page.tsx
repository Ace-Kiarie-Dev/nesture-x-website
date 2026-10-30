'use client';

import { useState } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { ClayButton } from '@/components/redesign';

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
    <ToolShell
      title="Color Palette Generator"
      outline="Generator"
      description="Generate beautiful colour palettes from any base colour."
      cta
    >
      <div className="nxtl-stack">
        {/* Controls */}
        <div className="nxtl-panel nx-clay nxtl-cp-controls">
          <label htmlFor="cp-hex" className="nxtl-label" style={{ marginBottom: 0 }}>Base Colour</label>
          <div className="nxtl-cp-row">
            <span className="nxtl-color">
              <input
                type="color"
                aria-label="Pick base colour"
                value={baseHex}
                onChange={e => { setBaseHex(e.target.value); setHexInput(e.target.value); setPalette(generatePalette(e.target.value)); }}
              />
            </span>
            <input
              id="cp-hex"
              type="text"
              value={hexInput}
              maxLength={7}
              onChange={e => applyHex(e.target.value)}
              placeholder="#1a6fd4"
              aria-invalid={!hexValid}
              aria-describedby={!hexValid && hexInput.length > 1 ? 'cp-hex-err' : undefined}
              spellCheck={false}
              autoComplete="off"
              className="nx-input nxtl-cp-hex"
            />
            <ClayButton onClick={handleGenerate} disabled={!hexValid} className="nx-clay-btn--sm">
              Generate Palette
            </ClayButton>
          </div>
          {!hexValid && hexInput.length > 1 && (
            <span id="cp-hex-err" className="nxtl-cp-err">
              Invalid hex
            </span>
          )}
        </div>

        {/* Swatches */}
        {palette.length > 0 && (
          <div className="nxtl-panel nx-clay">
            <span className="nxtl-label" style={{ marginBottom: 0 }}>Palette · click a swatch to copy</span>
            <div className="nxtl-cp-swatches" aria-live="polite">
              {palette.map(sw => {
                const textCol = contrastColor(sw.hex);
                const isCopied = copiedHex === sw.hex;
                return (
                  <button
                    key={sw.hex + sw.label}
                    type="button"
                    data-hover
                    onClick={() => copyHex(sw.hex)}
                    title={`Click to copy ${sw.hex}`}
                    className="nxtl-cp-swatch"
                    style={{ background: sw.hex, color: textCol }}
                  >
                    {isCopied && (
                      <span className="nxtl-cp-copied">
                        Copied!
                      </span>
                    )}
                    <span className="nxtl-cp-sw-label">
                      {sw.label}
                    </span>
                    <span className="nxtl-cp-sw-hex">
                      {sw.hex}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Export actions: 2x2 on phones, one row from 640px */}
            <div className="nxtl-cp-export">
              <ClayButton variant="ghost" className="nx-clay-btn--sm" onClick={copyAllCSS}>
                {copiedAll ? 'Copied!' : 'Copy CSS Variables'}
              </ClayButton>
              <ClayButton variant="ghost" className="nx-clay-btn--sm" onClick={copyTailwind}>
                {copiedTailwind ? 'Copied!' : 'Copy Tailwind Config'}
              </ClayButton>
              <ClayButton variant="ghost" className="nx-clay-btn--sm" onClick={copyJson}>
                {copiedJson ? 'Copied!' : 'Copy JSON'}
              </ClayButton>
              <ClayButton className="nx-clay-btn--sm" onClick={() => exportPNG(palette)}>
                Export as PNG
              </ClayButton>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
