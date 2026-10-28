'use client';

import { useState, useRef, useEffect } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';

// ── Types ────────────────────────────────────────────────────────────────────

type FontCategory = 'sans-serif' | 'serif' | 'display' | 'script' | 'monospace';
type Layout = 'centered' | 'left' | 'icon-left' | 'stacked';

// ── Constants ────────────────────────────────────────────────────────────────

const FONTS: Record<FontCategory, string[]> = {
  'sans-serif': ['Inter', 'Poppins', 'Montserrat', 'Raleway', 'DM Sans'],
  'serif': ['Playfair Display', 'Merriweather', 'Lora', 'Cormorant Garamond', 'EB Garamond'],
  'display': ['Bebas Neue', 'Anton', 'Black Han Sans', 'Righteous', 'Bungee'],
  'script': ['Pacifico', 'Dancing Script', 'Great Vibes', 'Sacramento', 'Satisfy'],
  'monospace': ['JetBrains Mono', 'Space Mono', 'Courier Prime', 'IBM Plex Mono', 'Fira Code'],
};

const DEFAULT_FONT: Record<FontCategory, string> = {
  'sans-serif': 'Inter',
  'serif': 'Playfair Display',
  'display': 'Bebas Neue',
  'script': 'Pacifico',
  'monospace': 'JetBrains Mono',
};

const CATEGORY_TABS: { id: FontCategory; label: string }[] = [
  { id: 'sans-serif', label: 'Sans-Serif' },
  { id: 'serif', label: 'Serif' },
  { id: 'display', label: 'Display' },
  { id: 'script', label: 'Script' },
  { id: 'monospace', label: 'Monospace' },
];

const LAYOUTS: { id: Layout; label: string }[] = [
  { id: 'centered', label: 'Centered' },
  { id: 'left', label: 'Left Aligned' },
  { id: 'icon-left', label: 'Icon Left' },
  { id: 'stacked', label: 'Stacked' },
];

const CW = 800, CH = 400;

// Google Fonts — all preview fonts in one request
const GFONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@400;700' +
  '&family=Montserrat:wght@400;700&family=Raleway:wght@400;700&family=DM+Sans:opsz,wght@9..40,400;9..40,700' +
  '&family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&family=Lora:wght@400;700' +
  '&family=Cormorant+Garamond:wght@400;700&family=EB+Garamond:wght@400;700' +
  '&family=Bebas+Neue&family=Anton&family=Black+Han+Sans&family=Righteous&family=Bungee' +
  '&family=Pacifico&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Sacramento&family=Satisfy' +
  '&family=JetBrains+Mono:wght@400;700&family=Space+Mono:wght@400;700' +
  '&family=Courier+Prime:wght@400;700&family=IBM+Plex+Mono:wght@400;700&family=Fira+Code:wght@400;700' +
  '&display=swap';

// ── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function mixColor(hex1: string, hex2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return `rgb(${Math.round(r1 * t + r2 * (1 - t))},${Math.round(g1 * t + g2 * (1 - t))},${Math.round(b1 * t + b2 * (1 - t))})`;
}

function escXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── SVG generator ─────────────────────────────────────────────────────────────

function buildSVG(p: {
  brandName: string; tagline: string; font: string;
  textColor: string; bgColor: string; accentColor: string;
  layout: Layout; fontSize: number;
}): string {
  const brand = p.brandName || 'Your Brand';
  const tsz = Math.round(p.fontSize * 0.6);
  const tagCol = mixColor(p.textColor, p.bgColor, 0.65);
  const hasTag = p.tagline.trim().length > 0;
  const GAP = 16;
  const ff = `"${escXml(p.font)}", sans-serif`;
  let els = '';

  if (p.layout === 'centered') {
    const totalH = hasTag ? p.fontSize + GAP + tsz : p.fontSize;
    const nameY = Math.round((CH - totalH) / 2 + p.fontSize * 0.78);
    els = `<text x="${CW / 2}" y="${nameY}" text-anchor="middle" font-family=${ff} font-size="${p.fontSize}" font-weight="bold" fill="${p.textColor}">${escXml(brand)}</text>`;
    if (hasTag) els += `<text x="${CW / 2}" y="${nameY + Math.round(p.fontSize * 0.25 + GAP + tsz * 0.78)}" text-anchor="middle" font-family=${ff} font-size="${tsz}" fill="${tagCol}">${escXml(p.tagline)}</text>`;

  } else if (p.layout === 'left') {
    const PAD = 60;
    const totalH = hasTag ? p.fontSize + GAP + tsz : p.fontSize;
    const nameY = Math.round((CH - totalH) / 2 + p.fontSize * 0.78);
    els = `<text x="${PAD}" y="${nameY}" font-family=${ff} font-size="${p.fontSize}" font-weight="bold" fill="${p.textColor}">${escXml(brand)}</text>`;
    if (hasTag) els += `<text x="${PAD}" y="${nameY + Math.round(p.fontSize * 0.25 + GAP + tsz * 0.78)}" font-family=${ff} font-size="${tsz}" fill="${tagCol}">${escXml(p.tagline)}</text>`;

  } else if (p.layout === 'icon-left') {
    const r = Math.min(Math.round(p.fontSize * 0.9), 70);
    const cx = 60 + r;
    const tx = cx + r + 24;
    const totalH = hasTag ? p.fontSize + 10 + tsz : p.fontSize;
    const nameY = Math.round((CH - totalH) / 2 + p.fontSize * 0.78);
    els = `<circle cx="${cx}" cy="${CH / 2}" r="${r}" fill="${p.accentColor}"/>`;
    els += `<text x="${tx}" y="${nameY}" font-family=${ff} font-size="${p.fontSize}" font-weight="bold" fill="${p.textColor}">${escXml(brand)}</text>`;
    if (hasTag) els += `<text x="${tx}" y="${nameY + Math.round(p.fontSize * 0.25 + 10 + tsz * 0.78)}" font-family=${ff} font-size="${tsz}" fill="${tagCol}">${escXml(p.tagline)}</text>`;

  } else { // stacked
    const divY = CH / 2;
    const nameY = Math.round(divY - 22 - p.fontSize * 0.2);
    els = `<text x="${CW / 2}" y="${nameY}" text-anchor="middle" font-family=${ff} font-size="${p.fontSize}" font-weight="bold" fill="${p.textColor}">${escXml(brand)}</text>`;
    els += `<line x1="80" y1="${divY}" x2="${CW - 80}" y2="${divY}" stroke="${p.accentColor}" stroke-width="2"/>`;
    if (hasTag) {
      const tagY = Math.round(divY + 22 + tsz * 0.78);
      els += `<text x="${CW / 2}" y="${tagY}" text-anchor="middle" font-family=${ff} font-size="${tsz}" fill="${tagCol}">${escXml(p.tagline)}</text>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CW}" height="${CH}"><rect width="${CW}" height="${CH}" fill="${p.bgColor}"/>${els}</svg>`;
}

// ── Styles ────────────────────────────────────────────────────────────────────

export default function LogoTextPreviewerPage() {
  const [brandName, setBrandName] = useState('Your Brand');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<FontCategory>('sans-serif');
  const [activeFonts, setActiveFonts] = useState<Record<FontCategory, string>>(DEFAULT_FONT);
  const [textColor, setTextColor] = useState('#f5f5f5');
  const [bgColor, setBgColor] = useState('#0a0a0a');
  const [accentColor, setAccentColor] = useState('#1a6fd4');
  const [layout, setLayout] = useState<Layout>('centered');
  const [fontSize, setFontSize] = useState(72);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeFont = activeFonts[category];

  // Inject Google Fonts once
  useEffect(() => {
    if (document.getElementById('nx-ltp-fonts')) return;
    const link = document.createElement('link');
    link.id = 'nx-ltp-fonts';
    link.rel = 'stylesheet';
    link.href = GFONTS_HREF;
    document.head.appendChild(link);
  }, []);

  // Canvas redraw on every relevant state change
  useEffect(() => {
    let cancelled = false;

    async function draw() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      try {
        await document.fonts.load(`bold ${fontSize}px "${activeFont}"`);
      } catch { /* draw with fallback if load fails */ }

      if (cancelled) return;

      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, CW, CH);

      const brand = brandName || 'Your Brand';
      const tsz = Math.round(fontSize * 0.6);
      const tagCol = mixColor(textColor, bgColor, 0.65);
      const hasTag = tagline.trim().length > 0;
      const GAP = 16;

      ctx.textBaseline = 'middle';

      if (layout === 'centered') {
        ctx.textAlign = 'center';
        const totalH = hasTag ? fontSize + GAP + tsz : fontSize;
        const nameY = (CH - totalH) / 2 + fontSize / 2;
        ctx.font = `bold ${fontSize}px "${activeFont}", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(brand, CW / 2, nameY);
        if (hasTag) {
          ctx.font = `${tsz}px "${activeFont}", sans-serif`;
          ctx.fillStyle = tagCol;
          ctx.fillText(tagline, CW / 2, nameY + fontSize / 2 + GAP + tsz / 2);
        }

      } else if (layout === 'left') {
        const PAD = 60;
        ctx.textAlign = 'left';
        const totalH = hasTag ? fontSize + GAP + tsz : fontSize;
        const nameY = (CH - totalH) / 2 + fontSize / 2;
        ctx.font = `bold ${fontSize}px "${activeFont}", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(brand, PAD, nameY);
        if (hasTag) {
          ctx.font = `${tsz}px "${activeFont}", sans-serif`;
          ctx.fillStyle = tagCol;
          ctx.fillText(tagline, PAD, nameY + fontSize / 2 + GAP + tsz / 2);
        }

      } else if (layout === 'icon-left') {
        const r = Math.min(Math.round(fontSize * 0.9), 70);
        const cx = 60 + r;
        ctx.fillStyle = accentColor;
        ctx.beginPath();
        ctx.arc(cx, CH / 2, r, 0, Math.PI * 2);
        ctx.fill();
        const tx = cx + r + 24;
        ctx.textAlign = 'left';
        const totalH = hasTag ? fontSize + 10 + tsz : fontSize;
        const nameY = (CH - totalH) / 2 + fontSize / 2;
        ctx.font = `bold ${fontSize}px "${activeFont}", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(brand, tx, nameY);
        if (hasTag) {
          ctx.font = `${tsz}px "${activeFont}", sans-serif`;
          ctx.fillStyle = tagCol;
          ctx.fillText(tagline, tx, nameY + fontSize / 2 + 10 + tsz / 2);
        }

      } else { // stacked
        ctx.textAlign = 'center';
        const divY = CH / 2;
        ctx.font = `bold ${fontSize}px "${activeFont}", sans-serif`;
        ctx.fillStyle = textColor;
        ctx.fillText(brand, CW / 2, divY - 22 - fontSize / 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(80, divY);
        ctx.lineTo(CW - 80, divY);
        ctx.stroke();
        if (hasTag) {
          ctx.font = `${tsz}px "${activeFont}", sans-serif`;
          ctx.fillStyle = tagCol;
          ctx.fillText(tagline, CW / 2, divY + 22 + tsz / 2);
        }
      }
    }

    draw();
    return () => { cancelled = true; };
  }, [brandName, tagline, activeFont, textColor, bgColor, accentColor, layout, fontSize]);

  function selectFont(font: string) {
    setActiveFonts(prev => ({ ...prev, [category]: font }));
  }

  function handleDownloadPNG() {
    canvasRef.current?.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'logo-preview.png'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, 'image/png');
  }

  function handleDownloadSVG() {
    const svg = buildSVG({ brandName, tagline, font: activeFont, textColor, bgColor, accentColor, layout, fontSize });
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'logo-preview.svg'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  return (
    <ToolShell
      title="Logo Text Previewer"
      outline="Previewer"
      description="See your brand name in different fonts and layouts before commissioning a logo."
    >
      <div className="nxtl-panes nxtl-panes--wide-right">

        {/* ── Controls ── */}
        <div className="nxtl-panel nx-clay">

          <div className="nx-field">
            <label htmlFor="ltp-brand">Brand Name</label>
            <input
              id="ltp-brand"
              className="nx-input"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              placeholder="Your Brand Name"
            />
          </div>

          <div className="nx-field">
            <label htmlFor="ltp-tagline">Tagline (optional)</label>
            <input
              id="ltp-tagline"
              className="nx-input"
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Your tagline (optional)"
            />
          </div>

          {/* Category tabs */}
          <div>
            <span className="nxtl-label">Font Category</span>
            <Segmented
              label="Font category"
              size="sm"
              options={CATEGORY_TABS.map(t => ({ value: t.id, label: t.label }))}
              value={category}
              onChange={setCategory}
            />
          </div>

          {/* Font pills — rendered in their own font */}
          <div>
            <span className="nxtl-label">Font</span>
            <Segmented
              label="Font"
              className="nxtl-ltp-fonts"
              options={FONTS[category].map(font => ({
                value: font,
                label: <span style={{ fontFamily: `"${font}", sans-serif` }}>{font}</span>,
              }))}
              value={activeFonts[category]}
              onChange={selectFont}
            />
          </div>

          {/* Colour controls */}
          <div>
            <span className="nxtl-label">Colours</span>
            <div className="nxtl-ltp-colors">
              {([
                { label: 'Text', val: textColor, set: setTextColor },
                { label: 'Background', val: bgColor, set: setBgColor },
                { label: 'Accent', val: accentColor, set: setAccentColor },
              ] as const).map(c => (
                <label key={c.label} className="nxtl-ltp-color">
                  <span className="nxtl-hint">{c.label}</span>
                  <span className="nxtl-color">
                    <input
                      type="color"
                      value={c.val}
                      onChange={e => c.set(e.target.value)}
                    />
                  </span>
                </label>
              ))}
              <button
                type="button"
                data-hover
                onClick={() => { const t = textColor; setTextColor(bgColor); setBgColor(t); }}
                className="nxtl-chip-btn"
                aria-label="Swap text and background colours"
              >
                Swap
              </button>
            </div>
          </div>

          {/* Layout selector */}
          <div>
            <span className="nxtl-label">Layout</span>
            <Segmented
              label="Layout"
              size="sm"
              className="nxtl-ltp-layouts"
              options={LAYOUTS.map(l => ({ value: l.id, label: l.label }))}
              value={layout}
              onChange={setLayout}
            />
          </div>

          {/* Font size */}
          <div>
            <div className="nxtl-range-head">
              <label htmlFor="ltp-size" className="nxtl-label" style={{ marginBottom: 0 }}>Size: {fontSize}px</label>
            </div>
            <input
              id="ltp-size"
              type="range"
              min={24}
              max={120}
              value={fontSize}
              onChange={e => setFontSize(parseInt(e.target.value))}
              className="nxtl-range"
            />
            <div className="nxtl-range-head">
              <span className="nxtl-mono">24px</span>
              <span className="nxtl-mono">120px</span>
            </div>
          </div>
        </div>

        {/* ── Canvas + downloads ── */}
        <div className="nxtl-ltp-preview">
          <div className="nxtl-panel nx-clay">
            <span className="nxtl-label" style={{ marginBottom: 0 }}>Preview · 800 × 400</span>
            <canvas
              ref={canvasRef}
              width={CW}
              height={CH}
              className="nxtl-ltp-canvas"
              aria-label={`Logo preview: ${brandName || 'Your Brand'}`}
              role="img"
            />
            <div className="nxtl-actions">
              <ClayButton onClick={handleDownloadPNG}>
                Download PNG
              </ClayButton>
              <ClayButton variant="ghost" onClick={handleDownloadSVG}>
                Download SVG
              </ClayButton>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead gen CTA (stronger version) ── */}
      <aside className="nxtl-cta nxtl-ltp-cta nx-glass" aria-label="Brand identity">
        <div className="nxtl-cta-copy">
          <h2 className="nxtl-ltp-cta-title">
            Ready to turn this into a real logo?
          </h2>
          <p className="nxtl-cta-text">
            We design brand identities that work across print, digital, and everything in between. Let&apos;s build yours.
          </p>
        </div>
        <ClayButton href="/contact" className="nx-clay-btn--sm">
          Start Your Brand Project →
        </ClayButton>
      </aside>
    </ToolShell>
  );
}
