'use client';

import { useState, useEffect, useRef } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented, Spinner, Status } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';

type QrSize  = 'sm' | 'md' | 'lg';
type EcLevel = 'L' | 'M' | 'Q' | 'H';

const SIZE_MAP:    Record<QrSize, number>  = { sm: 200, md: 400, lg: 600 };
const SIZE_LABELS: Record<QrSize, string>  = { sm: 'Small', md: 'Medium', lg: 'Large' };
const EC_LABELS:   Record<EcLevel, string> = { L: 'L (7%)', M: 'M (15%)', Q: 'Q (25%)', H: 'H (30%)' };

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
    <ToolShell
      title="QR Code Generator"
      outline="Generator"
      description="Generate QR codes with custom colours, logo overlay, and SVG/PNG export."
      cta
    >
      <div className="nxtl-panes">

        {/* Controls */}
        <div className="nxtl-panel nx-clay">
          <div className="nx-field">
            <label htmlFor="qr-text">URL or Text</label>
            <input
              id="qr-text" type="text" value={text} onChange={e => setText(e.target.value)}
              placeholder="https://nesturex.com" className="nx-input"
            />
          </div>

          <div className="nxtl-row">
            <div>
              <label htmlFor="qr-fg" className="nxtl-label">Foreground</label>
              <span className="nxtl-color">
                <input id="qr-fg" type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} />
                <span className="nxtl-mono">{fgColor}</span>
              </span>
            </div>
            <div>
              <label htmlFor="qr-bg" className="nxtl-label">Background</label>
              <span className="nxtl-color">
                <input id="qr-bg" type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                <span className="nxtl-mono">{bgColor}</span>
              </span>
            </div>
          </div>

          <div>
            <span className="nxtl-label" id="qr-ec-label">Error Correction</span>
            <Segmented
              label="Error correction"
              size="sm"
              options={(['L', 'M', 'Q', 'H'] as EcLevel[]).map(l => ({ value: l, label: EC_LABELS[l] }))}
              value={ecLevel}
              onChange={setEcLevel}
            />
            <p className="nxtl-hint" style={{ marginTop: 8 }}>
              Higher correction = QR still works even if partially damaged or covered
            </p>
          </div>

          <div>
            <span className="nxtl-label">Size</span>
            <Segmented
              label="Size"
              options={(['sm', 'md', 'lg'] as QrSize[]).map(s => ({ value: s, label: SIZE_LABELS[s] }))}
              value={size}
              onChange={setSize}
            />
          </div>

          {error && <Status tone="error">{error}</Status>}

          {!text.trim() && <p className="nxtl-hint">Enter text above to generate a QR code.</p>}

          <div className="nxtl-actions">
            <ClayButton onClick={handleDownloadPng} disabled={!qrDataUrl || generating}>
              Download PNG
            </ClayButton>
            <ClayButton variant="ghost" onClick={handleDownloadSvg} disabled={!qrDataUrl || generating}>
              Download SVG
            </ClayButton>
          </div>

          {/* Logo overlay */}
          <div>
            <span className="nxtl-label">Center Logo (optional)</span>
            {logoDataUrl ? (
              <div className="nxtl-drop nxtl-drop--sm" style={{ cursor: 'default', justifyContent: 'flex-start' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoDataUrl} alt="Logo preview" style={{ width: 40, height: 40, objectFit: 'contain', background: '#fff', padding: 2, borderRadius: 8, flexShrink: 0 }} />
                <span className="nxtl-mono" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                  {logoFile?.name}
                </span>
                <button type="button" onClick={removeLogo} className="nxtl-link-btn">
                  Remove
                </button>
              </div>
            ) : (
              <label className="nxtl-drop nxtl-drop--sm nxtl-drop--input">
                <span className="nxtl-drop-hint">
                  Upload logo — PNG with transparency recommended · max 500 KB
                </span>
                <input type="file" accept="image/*" className="nx-sr-only"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = ''; }} />
              </label>
            )}
            {logoError && <div style={{ marginTop: 8 }}><Status tone="error">{logoError}</Status></div>}
            {logoToast && <div style={{ marginTop: 8 }}><Status tone="info">{logoToast}</Status></div>}
          </div>
        </div>

        {/* Preview: QR on a neutral stage; the spinner overlays it, so nothing jumps. */}
        <div className="nxtl-stage nxtl-stage--light nxtl-qr-stage" aria-live="polite">
          {qrDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR Code" style={{ maxWidth: '100%', maxHeight: '320px', imageRendering: 'pixelated', opacity: generating ? 0.35 : 1 }} />
          )}
          {generating && (
            <span className="nxtl-stage-busy"><Spinner /> Generating…</span>
          )}
          {!generating && !qrDataUrl && !error && (
            <div className="nxtl-stage-empty">
              <span className="nxtl-qr-ph">QR CODE</span>
              Preview appears here
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
