'use client';

import { useState, useEffect, useRef } from 'react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';

type QrSize  = 'sm' | 'md' | 'lg';
type EcLevel = 'L' | 'M' | 'Q' | 'H';

const SIZE_MAP:    Record<QrSize, number>  = { sm: 200, md: 400, lg: 600 };
const SIZE_LABELS: Record<QrSize, string>  = { sm: 'Small', md: 'Medium', lg: 'Large' };
const EC_LABELS:   Record<EcLevel, string> = { L: 'L (7%)', M: 'M (15%)', Q: 'Q (25%)', H: 'H (30%)' };

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
  marginBottom: '0.6rem',
};

const INPUT_BASE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(10, 10, 10, 0.6)',
  border: '1px solid rgba(255,255,255,0.12)',
  padding: '0.75rem 1rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.92rem',
  color: 'var(--color-text)',
  outline: 'none',
};

export default function QrGeneratorPage() {
  const [text, setText]           = useState('');
  const [fgColor, setFgColor]     = useState('#0a0a0a');
  const [bgColor, setBgColor]     = useState('#f5f5f5');
  const [size, setSize]           = useState<QrSize>('md');
  const [ecLevel, setEcLevel]     = useState<EcLevel>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Logo overlay
  const [logoFile, setLogoFile]     = useState<File | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoToast, setLogoToast]   = useState<string | null>(null);
  const [logoError, setLogoError]   = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!text.trim()) { setQrDataUrl(null); setError(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setGenerating(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const QRCode = (await import('qrcode')).default;
        const dataUrl = await QRCode.toDataURL(text, {
          width: SIZE_MAP[size],
          margin: 2,
          color: { dark: fgColor, light: bgColor },
          errorCorrectionLevel: ecLevel,
        });
        setQrDataUrl(dataUrl);
        setError(null);
      } catch {
        setError('Failed to generate QR code. Check your input and try again.');
        setQrDataUrl(null);
      } finally {
        setGenerating(false);
      }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [text, size, fgColor, bgColor, ecLevel]);

  // ── Logo handler ────────────────────────────────────────────────────────────

  function handleLogoUpload(file: File) {
    setLogoError(null);
    if (file.size > 500 * 1024) {
      setLogoError('Logo exceeds 500 KB — please use a smaller image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      setLogoFile(file);
      setLogoDataUrl(e.target?.result as string);
      if (ecLevel !== 'H') {
        setEcLevel('H');
        setLogoToast('Error correction set to H — recommended when using a logo overlay');
        setTimeout(() => setLogoToast(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoDataUrl(null);
    setLogoError(null);
    setLogoToast(null);
  }

  // ── Download handlers ───────────────────────────────────────────────────────

  async function handleDownloadPng() {
    if (!qrDataUrl) return;
    if (!logoDataUrl) {
      const a = document.createElement('a');
      a.href = qrDataUrl; a.download = 'qrcode.png'; a.click();
      return;
    }
    // Compose QR + logo on canvas
    const canvasSize = SIZE_MAP[size];
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize; canvas.height = canvasSize;
    const ctx = canvas.getContext('2d')!;

    await new Promise<void>(resolve => {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0, canvasSize, canvasSize); resolve(); };
      img.src = qrDataUrl;
    });

    const logoSize = Math.round(canvasSize * 0.2);
    const logoX = Math.round((canvasSize - logoSize) / 2);
    const logoY = Math.round((canvasSize - logoSize) / 2);
    const pad = 4;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(logoX - pad, logoY - pad, logoSize + pad * 2, logoSize + pad * 2);

    await new Promise<void>(resolve => {
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, logoX, logoY, logoSize, logoSize); resolve(); };
      img.src = logoDataUrl;
    });

    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qrcode.png'; a.click();
  }

  async function handleDownloadSvg() {
    if (!text.trim()) return;
    try {
      const QRCode = (await import('qrcode')).default;
      const svgString = await QRCode.toString(text, {
        type: 'svg',
        width: SIZE_MAP[size],
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: ecLevel,
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'qrcode.svg'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } catch { /* silent */ }
  }

  return (
    <main style={{ padding: 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem) clamp(4rem, 6vw, 6rem)', background: 'var(--color-bg)' }}>
      <BackLink />

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem, 8vw, 8rem)', lineHeight: 0.9, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
        QR CODE GENERATOR
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)', color: 'rgba(245,245,245,0.5)', marginBottom: '2.5rem', maxWidth: '40rem' }}>
        Generate QR codes with custom colours, logo overlay, and SVG/PNG export.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '900px', alignItems: 'start' }}>

        {/* Controls card */}
        <div style={GLASS}>

          {/* Text input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="qr-text" style={LABEL}>URL or Text</label>
            <input
              id="qr-text" type="text" value={text} onChange={e => setText(e.target.value)}
              placeholder="https://nesture-x.com" style={INPUT_BASE}
              onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>

          {/* Colour options */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <label htmlFor="qr-fg" style={LABEL}>Foreground</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input id="qr-fg" type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
                  style={{ width: '36px', height: '36px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', padding: '2px' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.06em' }}>{fgColor}</span>
              </div>
            </div>
            <div>
              <label htmlFor="qr-bg" style={LABEL}>Background</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input id="qr-bg" type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                  style={{ width: '36px', height: '36px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', padding: '2px' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.4)', letterSpacing: '0.06em' }}>{bgColor}</span>
              </div>
            </div>
          </div>

          {/* Error Correction Level */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={LABEL}>Error Correction</span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(['L', 'M', 'Q', 'H'] as EcLevel[]).map(l => (
                <button
                  key={l}
                  data-hover
                  onClick={() => setEcLevel(l)}
                  title="Higher correction = QR still works even if partially damaged or covered"
                  style={{
                    padding: '0.4rem 0.75rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                    border: `2px solid ${ecLevel === l ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
                    background: ecLevel === l ? 'var(--color-primary)' : 'transparent',
                    color: ecLevel === l ? 'var(--color-bg)' : 'rgba(245,245,245,0.5)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {EC_LABELS[l]}
                </button>
              ))}
            </div>
          </div>

          {/* Size toggle */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={LABEL}>Size</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['sm', 'md', 'lg'] as QrSize[]).map(s => (
                <button
                  key={s} data-hover onClick={() => setSize(s)}
                  style={{
                    padding: '0.45rem 1.1rem', fontFamily: 'var(--font-body)', fontSize: '0.78rem',
                    fontWeight: 600, letterSpacing: '0.05em', cursor: 'pointer',
                    border: `2px solid ${size === s ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
                    background: size === s ? 'var(--color-primary)' : 'transparent',
                    color: size === s ? 'var(--color-bg)' : 'rgba(245,245,245,0.5)',
                    transition: 'all 150ms ease',
                  }}
                >
                  {SIZE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ border: '1px solid rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.07)', padding: '0.8rem 1rem', marginBottom: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)' }}>{error}</p>
            </div>
          )}

          {!text.trim() && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'rgba(245,245,245,0.2)', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Enter text above to generate a QR code.
            </p>
          )}

          {/* Download buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <NxButton variant="primary" size="sm" onClick={handleDownloadPng} disabled={!qrDataUrl || generating}>
              Download PNG
            </NxButton>
            <NxButton variant="ghost" size="sm" onClick={handleDownloadSvg} disabled={!qrDataUrl || generating}>
              Download SVG
            </NxButton>
          </div>

          {/* Logo overlay */}
          <div>
            <span style={LABEL}>Center Logo (optional)</span>
            {logoDataUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: 'rgba(26,111,212,0.05)', border: '1px solid rgba(26,111,212,0.15)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoDataUrl} alt="Logo preview" style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#fff', padding: '2px', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(245,245,245,0.5)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {logoFile?.name}
                </span>
                <button onClick={removeLogo} style={{ background: 'none', border: 'none', color: 'rgba(245,245,245,0.4)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.72rem', textDecoration: 'underline', flexShrink: 0 }}>
                  Remove
                </button>
              </div>
            ) : (
              <label style={{ display: 'block', border: '1px dashed rgba(255,255,255,0.12)', padding: '0.85rem 1rem', cursor: 'pointer', textAlign: 'center', transition: 'border-color 150ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.3)' }}>
                  Upload logo — PNG with transparency recommended · max 500 KB
                </span>
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = ''; }} />
              </label>
            )}
            {logoError && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgb(239,68,68)', marginTop: '0.4rem' }}>{logoError}</p>
            )}
            {logoToast && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(26,111,212,0.07)', border: '1px solid rgba(26,111,212,0.2)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-primary)', margin: 0 }}>{logoToast}</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview card */}
        <div style={{ ...GLASS, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
          {generating && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(245,245,245,0.3)', letterSpacing: '0.1em' }}>Generating…</p>
          )}
          {!generating && qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR Code" style={{ maxWidth: '100%', maxHeight: '320px', imageRendering: 'pixelated' }} />
          )}
          {!generating && !qrDataUrl && !error && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', border: '2px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(245,245,245,0.15)', letterSpacing: '0.1em' }}>QR CODE</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.2)' }}>Preview appears here</p>
            </div>
          )}
        </div>
      </div>

      <ToolCTA />
    </main>
  );
}
