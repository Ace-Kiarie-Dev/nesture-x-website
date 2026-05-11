'use client';

import { useState, useEffect, useRef } from 'react';
import BackLink from '@/components/tools/BackLink';
import NxButton from '@/components/ui/NxButton';
import { Copy, Check, ChevronDown, ChevronUp, Download } from 'lucide-react';

// ── Types / Constants ─────────────────────────────────────────────────────────

type Mode = 'single' | 'bulk';
const HISTORY_KEY = 'nx-utm-history';
const MAX_HISTORY = 10;

const PRESETS = [
  { label: 'Social Media', source: 'social', medium: 'social' },
  { label: 'Email Campaign', source: 'email', medium: 'email' },
  { label: 'Google Ads', source: 'google', medium: 'cpc' },
  { label: 'WhatsApp', source: 'whatsapp', medium: 'chat' },
  { label: 'Print / QR Code', source: 'print', medium: 'qr' },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildUtmUrl(base: string, src: string, med: string, camp: string, trm: string, cnt: string): string {
  const b = base.trim();
  if (!b.match(/^https?:\/\//)) return '';
  const p = new URLSearchParams();
  if (src.trim()) p.set('utm_source', src.trim());
  if (med.trim()) p.set('utm_medium', med.trim());
  if (camp.trim()) p.set('utm_campaign', camp.trim());
  if (trm.trim()) p.set('utm_term', trm.trim());
  if (cnt.trim()) p.set('utm_content', cnt.trim());
  const qs = p.toString();
  if (!qs) return b;
  return b.includes('?') ? `${b}&${qs}` : `${b}?${qs}`;
}

function parseUtmUrl(url: string) {
  try {
    const u = new URL(url);
    const nonUtm = new URLSearchParams();
    u.searchParams.forEach((v, k) => { if (!k.startsWith('utm_')) nonUtm.set(k, v); });
    const qs = nonUtm.toString();
    return {
      base: u.origin + u.pathname + (qs ? `?${qs}` : ''),
      source: u.searchParams.get('utm_source') ?? '',
      medium: u.searchParams.get('utm_medium') ?? '',
      campaign: u.searchParams.get('utm_campaign') ?? '',
      term: u.searchParams.get('utm_term') ?? '',
      content: u.searchParams.get('utm_content') ?? '',
    };
  } catch { return null; }
}

function downloadCSV(rows: { original: string; utm: string }[]) {
  const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const csv = ['Original URL,UTM Link', ...rows.map(r => `${q(r.original)},${q(r.utm)}`)].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'utm-links.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── Styles ────────────────────────────────────────────────────────────────────

const GLASS: React.CSSProperties = { background: 'rgba(20,25,32,0.6)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', padding: 'clamp(1.5rem,3vw,2.25rem)' };
const LABEL: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,245,245,0.35)', display: 'block', marginBottom: '0.4rem' };
const INPUT: React.CSSProperties = { width: '100%', background: 'rgba(10,10,10,0.6)', border: '1px solid rgba(255,255,255,0.12)', padding: '0.6rem 0.9rem', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-text)', outline: 'none' };

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UTMBuilderPage() {
  const [mode, setMode] = useState<Mode>('single');
  const [baseUrl, setBaseUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const campaignRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')); } catch { /* ignore */ }
  }, []);

  // Derived
  const urlError = baseUrl && !baseUrl.trim().match(/^https?:\/\//) ? 'URL must start with http:// or https://' : null;
  const builtUrl = buildUtmUrl(baseUrl, source, medium, campaign, term, content);
  const bulkRows = bulkUrls.split('\n').map(l => l.trim()).filter(l => l.match(/^https?:\/\//))
    .map(orig => ({ original: orig, utm: buildUtmUrl(orig, source, medium, campaign, term, content) }));

  function applyPreset(p: typeof PRESETS[number]) {
    setSource(p.source);
    setMedium(p.medium);
    setTimeout(() => campaignRef.current?.focus(), 0);
  }

  async function handleCopy() {
    if (!builtUrl) return;
    await navigator.clipboard.writeText(builtUrl).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1800);
    const next = [builtUrl, ...history.filter(h => h !== builtUrl)].slice(0, MAX_HISTORY);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }

  async function copyItem(text: string, id: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id); setTimeout(() => setCopiedId(null), 1800);
  }

  function loadFromHistory(url: string) {
    const parsed = parseUtmUrl(url);
    if (!parsed) return;
    setBaseUrl(parsed.base); setSource(parsed.source); setMedium(parsed.medium);
    setCampaign(parsed.campaign); setTerm(parsed.term); setContent(parsed.content);
    setMode('single');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = 'var(--color-primary)'; };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; };

  // URL preview renderer — highlights utm_* params in blue
  function renderPreview() {
    if (!builtUrl) return <span style={{ color: 'rgba(245,245,245,0.25)' }}>Your UTM link will appear here</span>;
    const qi = builtUrl.indexOf('?');
    if (qi === -1) return <span style={{ wordBreak: 'break-all' }}>{builtUrl}</span>;
    const basePart = builtUrl.slice(0, qi);
    const parts = builtUrl.slice(qi + 1).split('&').map((part, i) => (
      <span key={i} style={{ color: part.startsWith('utm_') ? 'var(--color-primary)' : 'inherit' }}>
        {i === 0 ? '?' : '&'}{part}
      </span>
    ));
    return <span style={{ wordBreak: 'break-all' }}>{basePart}{parts}</span>;
  }

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em',
    background: active ? 'rgba(26,111,212,0.14)' : 'transparent',
    border: `1px solid ${active ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
    color: active ? 'var(--color-primary)' : 'rgba(245,245,245,0.45)',
    cursor: 'pointer', marginLeft: '-1px',
  });

  return (
    <main style={{ padding: 'clamp(6rem,10vw,11rem) clamp(2rem,7vw,8rem) clamp(4rem,6vw,6rem)', background: 'var(--color-bg)' }}>
      <BackLink />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem,8vw,8rem)', lineHeight: 0.9, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
        UTM LINK BUILDER
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem,1.3vw,1.05rem)', color: 'rgba(245,245,245,0.5)', marginBottom: '2.5rem', maxWidth: '44rem' }}>
        Build UTM tracking links with presets, live preview and bulk CSV export.
      </p>

      <div style={{ ...GLASS, maxWidth: '760px' }}>
        {/* Mode toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button data-hover onClick={() => setMode('single')} style={tabBtn(mode === 'single')}>Single</button>
          <button data-hover onClick={() => setMode('bulk')} style={tabBtn(mode === 'bulk')}>Bulk</button>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={LABEL}>Quick Presets</label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button key={p.label} data-hover onClick={() => applyPreset(p)} style={{
                padding: '0.35rem 0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(245,245,245,0.5)',
                cursor: 'pointer', transition: 'border-color 120ms ease', whiteSpace: 'nowrap',
              }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Base URL / Bulk URLs */}
        {mode === 'single' ? (
          <div style={{ marginBottom: '1rem' }}>
            <label style={LABEL}>Base URL</label>
            <input
              style={{ ...INPUT, borderColor: urlError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)' }}
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
              placeholder="https://yourwebsite.com/page"
              onFocus={focusBorder}
              onBlur={e => { e.target.style.borderColor = urlError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)'; }}
            />
            {urlError && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgb(239,68,68)', marginTop: '0.3rem' }}>{urlError}</p>}
          </div>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <label style={LABEL}>Base URLs (one per line)</label>
            <textarea
              style={{ ...INPUT, minHeight: '100px', resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}
              value={bulkUrls}
              onChange={e => setBulkUrls(e.target.value)}
              placeholder={'https://example.com/page1\nhttps://example.com/page2'}
              onFocus={focusBorder} onBlur={blurBorder}
            />
          </div>
        )}

        {/* UTM fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={LABEL}>UTM Source</label>
            <input style={INPUT} value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. google, facebook, newsletter" onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={LABEL}>UTM Medium</label>
            <input style={INPUT} value={medium} onChange={e => setMedium(e.target.value)} placeholder="e.g. cpc, email, social" onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={LABEL}>UTM Campaign</label>
            <input ref={campaignRef} style={INPUT} value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="e.g. launch_2025, black_friday" onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={LABEL}>UTM Term (optional)</label>
            <input style={INPUT} value={term} onChange={e => setTerm(e.target.value)} placeholder="e.g. running+shoes" onFocus={focusBorder} onBlur={blurBorder} />
          </div>
          <div>
            <label style={LABEL}>UTM Content (optional)</label>
            <input style={INPUT} value={content} onChange={e => setContent(e.target.value)} placeholder="e.g. banner_ad_v1" onFocus={focusBorder} onBlur={blurBorder} />
          </div>
        </div>

        {/* Single mode preview + history */}
        {mode === 'single' && (
          <>
            <div style={{ background: 'rgba(10,10,10,0.5)', border: '1px solid rgba(255,255,255,0.08)', padding: '0.85rem 1rem', marginBottom: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', lineHeight: 1.65, flex: 1, minWidth: 0 }}>
                {renderPreview()}
              </div>
              <button data-hover onClick={handleCopy} disabled={!builtUrl} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem',
                background: 'transparent', border: `1px solid ${builtUrl ? 'rgba(26,111,212,0.5)' : 'rgba(255,255,255,0.1)'}`,
                color: builtUrl ? 'var(--color-primary)' : 'rgba(245,245,245,0.2)',
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em',
                cursor: builtUrl ? 'pointer' : 'not-allowed', flexShrink: 0,
              }}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>

            {history.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.85rem' }}>
                <button data-hover onClick={() => setHistoryOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em',
                  color: 'rgba(245,245,245,0.45)', cursor: 'pointer', padding: '0 0 0.5rem',
                }}>
                  {historyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  Recent Links ({history.length})
                </button>
                {historyOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {history.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.4rem 0.7rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.4)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{h}</span>
                        <button data-hover onClick={() => copyItem(h, `h${i}`)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copiedId === `h${i}` ? 'rgb(34,197,94)' : 'rgba(245,245,245,0.3)', padding: '0.1rem', flexShrink: 0 }}>
                          {copiedId === `h${i}` ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                        <button data-hover onClick={() => loadFromHistory(h)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', padding: '0.15rem 0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.06em', color: 'rgba(245,245,245,0.45)', cursor: 'pointer', flexShrink: 0 }}>
                          Load
                        </button>
                      </div>
                    ))}
                    <button data-hover onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }} style={{ background: 'transparent', border: 'none', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', textAlign: 'left', padding: '0.25rem 0', marginTop: '0.1rem' }}>
                      Clear History
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Bulk output */}
        {mode === 'bulk' && bulkRows.length > 0 && (
          <div>
            <div style={{ overflowX: 'auto', marginBottom: '0.85rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['Original URL', 'UTM Link'].map(h => (
                      <th key={h} style={{ ...LABEL, padding: '0.5rem 0.75rem', textAlign: 'left', fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.02)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bulkRows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(245,245,245,0.4)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.original}</td>
                      <td style={{ padding: '0.4rem 0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-primary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.utm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <NxButton variant="primary" size="sm" onClick={() => downloadCSV(bulkRows)}>
                <Download size={13} style={{ marginRight: '0.35rem' }} />
                Download CSV
              </NxButton>
              <NxButton variant="ghost" size="sm" onClick={async () => {
                await navigator.clipboard.writeText(bulkRows.map(r => r.utm).join('\n')).catch(() => {});
                setCopied(true); setTimeout(() => setCopied(false), 1800);
              }}>
                {copied ? 'Copied!' : 'Copy All'}
              </NxButton>
            </div>
          </div>
        )}
      </div>

      {/* Standard CTA */}
      <div style={{ marginTop: '3rem', maxWidth: '760px', background: 'rgba(20,25,32,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '4px solid var(--color-primary)', padding: 'clamp(1.5rem,3vw,2rem)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem,2vw,1.25rem)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Need a custom tool like this built for your business?
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(245,245,245,0.5)', margin: 0, lineHeight: 1.6 }}>
          We build internal tools, automation workflows, and custom software for Kenyan businesses.
        </p>
        <div><NxButton variant="ghost" size="sm" onClick={() => { window.location.href = '/contact'; }}>Let&apos;s Talk →</NxButton></div>
      </div>
    </main>
  );
}
