'use client';

import { useState, useEffect, useRef } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';
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

  // URL preview renderer — highlights utm_* params in blue
  function renderPreview() {
    if (!builtUrl) return <span className="nxtl-utm-empty">Your UTM link will appear here</span>;
    const qi = builtUrl.indexOf('?');
    if (qi === -1) return <span>{builtUrl}</span>;
    const basePart = builtUrl.slice(0, qi);
    const parts = builtUrl.slice(qi + 1).split('&').map((part, i) => (
      <span key={i} className={part.startsWith('utm_') ? 'nxtl-utm-param' : undefined}>
        {i === 0 ? '?' : '&'}{part}
      </span>
    ));
    return <span>{basePart}{parts}</span>;
  }

  return (
    <ToolShell
      title="UTM Link Builder"
      outline="Builder"
      description="Build UTM tracking links with presets, live preview and bulk CSV export."
    >
      <div className="nxtl-panes nxtl-panes--wide-left">

        {/* ── Form ── */}
        <div className="nxtl-panel nx-clay">
          {/* Mode toggle */}
          <Segmented
            label="Mode"
            size="sm"
            className="nxtl-utm-modes"
            options={[
              { value: 'single' as Mode, label: 'Single' },
              { value: 'bulk' as Mode, label: 'Bulk' },
            ]}
            value={mode}
            onChange={setMode}
          />

          {/* Presets */}
          <div>
            <span className="nxtl-label">Quick Presets</span>
            <div className="nxtl-utm-presets">
              {PRESETS.map(p => (
                <button key={p.label} type="button" data-hover onClick={() => applyPreset(p)} className="nxtl-chip-btn">
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Base URL / Bulk URLs */}
          {mode === 'single' ? (
            <div className="nx-field">
              <label htmlFor="utm-base">Base URL</label>
              <input
                id="utm-base"
                inputMode="url"
                className="nx-input"
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                placeholder="https://yourwebsite.com/page"
                aria-invalid={!!urlError}
                aria-describedby={urlError ? 'utm-base-err' : undefined}
              />
              {urlError && <p id="utm-base-err" className="nxtl-utm-err">{urlError}</p>}
            </div>
          ) : (
            <div className="nx-field">
              <label htmlFor="utm-bulk">Base URLs (one per line)</label>
              <textarea
                id="utm-bulk"
                className="nx-input nx-textarea nxtl-utm-bulk"
                value={bulkUrls}
                onChange={e => setBulkUrls(e.target.value)}
                placeholder={'https://example.com/page1\nhttps://example.com/page2'}
              />
            </div>
          )}

          {/* UTM fields */}
          <div className="nxtl-utm-fields">
            <div className="nx-field">
              <label htmlFor="utm-source">UTM Source</label>
              <input id="utm-source" className="nx-input" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. google, facebook, newsletter" />
            </div>
            <div className="nx-field">
              <label htmlFor="utm-medium">UTM Medium</label>
              <input id="utm-medium" className="nx-input" value={medium} onChange={e => setMedium(e.target.value)} placeholder="e.g. cpc, email, social" />
            </div>
            <div className="nx-field">
              <label htmlFor="utm-campaign">UTM Campaign</label>
              <input id="utm-campaign" ref={campaignRef} className="nx-input" value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="e.g. launch_2025, black_friday" />
            </div>
            <div className="nx-field">
              <label htmlFor="utm-term">UTM Term (optional)</label>
              <input id="utm-term" className="nx-input" value={term} onChange={e => setTerm(e.target.value)} placeholder="e.g. running+shoes" />
            </div>
            <div className="nx-field">
              <label htmlFor="utm-content">UTM Content (optional)</label>
              <input id="utm-content" className="nx-input" value={content} onChange={e => setContent(e.target.value)} placeholder="e.g. banner_ad_v1" />
            </div>
          </div>
        </div>

        {/* ── Output ── */}
        <div className="nxtl-panel nx-clay nxtl-utm-out">
          {/* Single mode preview + history */}
          {mode === 'single' && (
            <>
              <span className="nxtl-label" style={{ marginBottom: 0 }}>Your Link</span>
              <div className="nxtl-utm-preview" aria-live="polite">
                {renderPreview()}
              </div>
              <div className="nxtl-actions">
                <ClayButton onClick={handleCopy} disabled={!builtUrl}>
                  {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  {copied ? 'Copied!' : 'Copy URL'}
                </ClayButton>
              </div>

              {history.length > 0 && (
                <div className="nxtl-utm-history">
                  <button
                    type="button"
                    data-hover
                    onClick={() => setHistoryOpen(o => !o)}
                    aria-expanded={historyOpen}
                    className="nxtl-utm-history-toggle"
                  >
                    {historyOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
                    Recent Links ({history.length})
                  </button>
                  {historyOpen && (
                    <div className="nxtl-utm-history-list">
                      {history.map((h, i) => (
                        <div key={i} className="nxtl-utm-history-row">
                          <span className="nxtl-utm-history-url" title={h}>{h}</span>
                          <button
                            type="button"
                            data-hover
                            onClick={() => copyItem(h, `h${i}`)}
                            className={`nxtl-mp-copy${copiedId === `h${i}` ? ' is-copied' : ''}`}
                            aria-label="Copy link"
                          >
                            {copiedId === `h${i}` ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                          <button type="button" data-hover onClick={() => loadFromHistory(h)} className="nxtl-link-btn">
                            Load
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        data-hover
                        onClick={() => { setHistory([]); localStorage.removeItem(HISTORY_KEY); }}
                        className="nxtl-link-btn nxtl-utm-clear"
                      >
                        Clear History
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Bulk output */}
          {mode === 'bulk' && bulkRows.length === 0 && (
            <div className="nxtl-utm-preview nxtl-utm-empty">Bulk results appear here</div>
          )}
          {mode === 'bulk' && bulkRows.length > 0 && (
            <>
              <div className="nxtl-utm-table-wrap">
                <table className="nxtl-utm-table">
                  <thead>
                    <tr>
                      {['Original URL', 'UTM Link'].map(h => (
                        <th key={h} scope="col">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRows.map((r, i) => (
                      <tr key={i}>
                        <td title={r.original}>{r.original}</td>
                        <td title={r.utm} className="nxtl-utm-param">{r.utm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="nxtl-actions">
                <ClayButton onClick={() => downloadCSV(bulkRows)}>
                  <Download size={16} aria-hidden="true" />
                  Download CSV
                </ClayButton>
                <ClayButton variant="ghost" onClick={async () => {
                  await navigator.clipboard.writeText(bulkRows.map(r => r.utm).join('\n')).catch(() => {});
                  setCopied(true); setTimeout(() => setCopied(false), 1800);
                }}>
                  {copied ? 'Copied!' : 'Copy All'}
                </ClayButton>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Standard CTA */}
      <aside className="nxtl-cta nxtl-ltp-cta nx-glass" aria-label="Custom tools">
        <div className="nxtl-cta-copy">
          <h2 className="nxtl-ltp-cta-title">
            Need a custom tool like this built for your business?
          </h2>
          <p className="nxtl-cta-text">
            We build internal tools, automation workflows, and custom software for Kenyan businesses.
          </p>
        </div>
        <ClayButton href="/contact" variant="ghost" className="nx-clay-btn--sm">
          Let&apos;s Talk →
        </ClayButton>
      </aside>
    </ToolShell>
  );
}
