'use client';

import { useState, useRef, useEffect } from 'react';
import BackLink from '@/components/tools/BackLink';
import NxButton from '@/components/ui/NxButton';

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

const GLASS: React.CSSProperties = {
  background: 'rgba(20,25,32,0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: 'clamp(1.5rem,3vw,2.25rem)',
};

const LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(245,245,245,0.35)',
  display: 'block',
  marginBottom: '0.4rem',
};

const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'rgba(10,10,10,0.6)',
  border: '1px solid rgba(255,255,255,0.12)',
  padding: '0.6rem 0.9rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.88rem',
  color: 'var(--color-text)',
  outline: 'none',
};

// ── Page ──────────────────────────────────────────────────────────────────────

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

  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'var(--color-primary)'; };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; };

  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: '0.38rem 0.8rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.68rem',
    letterSpacing: '0.08em',
    background: active ? 'rgba(26,111,212,0.14)' : 'transparent',
    border: `1px solid ${active ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
    color: active ? 'var(--color-primary)' : 'rgba(245,245,245,0.45)',
    cursor: 'pointer',
    transition: 'all 120ms ease',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <main style={{ padding: 'clamp(6rem,10vw,11rem) clamp(2rem,7vw,8rem) clamp(4rem,6vw,6rem)', background: 'var(--color-bg)' }}>
      <BackLink />

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem,8vw,8rem)', lineHeight: 0.9, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
        LOGO TEXT PREVIEWER
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem,1.3vw,1.05rem)', color: 'rgba(245,245,245,0.5)', marginBottom: '2.5rem', maxWidth: '44rem' }}>
        See your brand name in different fonts and layouts before commissioning a logo.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1200px', alignItems: 'start' }}>

        {/* ── Controls ── */}
        <div style={{ ...GLASS, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div>
            <label style={LABEL}>Brand Name</label>
            <input
              style={{ ...INPUT, fontSize: '1rem' }}
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              placeholder="Your Brand Name"
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          <div>
            <label style={LABEL}>Tagline (optional)</label>
            <input
              style={INPUT}
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder="Your tagline (optional)"
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>

          {/* Category tabs */}
          <div>
            <label style={LABEL}>Font Category</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {CATEGORY_TABS.map(t => (
                <button key={t.id} data-hover onClick={() => setCategory(t.id)} style={pillBtn(category === t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font pills — rendered in their own font */}
          <div>
            <label style={LABEL}>Font</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {FONTS[category].map(font => {
                const active = activeFonts[category] === font;
                return (
                  <button
                    key={font}
                    data-hover
                    onClick={() => selectFont(font)}
                    style={{
                      padding: '0.38rem 0.8rem',
                      fontFamily: `"${font}", sans-serif`,
                      fontSize: '0.85rem',
                      background: active ? 'rgba(26,111,212,0.14)' : 'transparent',
                      border: `1px solid ${active ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
                      color: active ? 'var(--color-primary)' : 'rgba(245,245,245,0.6)',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {font}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colour controls */}
          <div>
            <label style={LABEL}>Colours</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              {([
                { label: 'Text', val: textColor, set: setTextColor },
                { label: 'Background', val: bgColor, set: setBgColor },
                { label: 'Accent', val: accentColor, set: setAccentColor },
              ] as const).map(c => (
                <div key={c.label}>
                  <label style={{ ...LABEL, marginBottom: '0.3rem' }}>{c.label}</label>
                  <input
                    type="color"
                    value={c.val}
                    onChange={e => c.set(e.target.value)}
                    style={{ width: '44px', height: '36px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', padding: '2px', display: 'block' }}
                  />
                </div>
              ))}
              <button
                data-hover
                onClick={() => { const t = textColor; setTextColor(bgColor); setBgColor(t); }}
                style={{ padding: '0.5rem 0.9rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', color: 'rgba(245,245,245,0.5)', cursor: 'pointer', marginBottom: '1px' }}
              >
                Swap
              </button>
            </div>
          </div>

          {/* Layout selector */}
          <div>
            <label style={LABEL}>Layout</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {LAYOUTS.map(l => (
                <button key={l.id} data-hover onClick={() => setLayout(l.id)} style={pillBtn(layout === l.id)}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div>
            <label style={LABEL}>Size: {fontSize}px</label>
            <input
              type="range"
              min={24}
              max={120}
              value={fontSize}
              onChange={e => setFontSize(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' } as React.CSSProperties}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(245,245,245,0.25)' }}>24px</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'rgba(245,245,245,0.25)' }}>120px</span>
            </div>
          </div>
        </div>

        {/* ── Canvas + downloads ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <canvas
            ref={canvasRef}
            width={CW}
            height={CH}
            style={{ maxWidth: '100%', height: 'auto', display: 'block', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <NxButton variant="primary" size="sm" onClick={handleDownloadPNG}>
              Download PNG
            </NxButton>
            <NxButton variant="ghost" size="sm" onClick={handleDownloadSVG}>
              Download SVG
            </NxButton>
          </div>
        </div>
      </div>

      {/* ── Lead gen CTA (stronger version) ── */}
      <div
        style={{
          marginTop: '3rem',
          maxWidth: '900px',
          borderLeft: '4px solid var(--color-primary)',
          background: 'rgba(20,25,32,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderLeftWidth: '4px',
          borderLeftColor: 'var(--color-primary)',
          padding: 'clamp(1.5rem,3vw,2rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.1rem,2vw,1.4rem)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Ready to turn this into a real logo?
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(245,245,245,0.5)', margin: 0, maxWidth: '45rem', lineHeight: 1.6 }}>
          We design brand identities that work across print, digital, and everything in between. Let&apos;s build yours.
        </p>
        <div>
          <NxButton variant="primary" size="sm" onClick={() => { window.location.href = '/contact'; }}>
            Start Your Brand Project →
          </NxButton>
        </div>
      </div>
    </main>
  );
}
