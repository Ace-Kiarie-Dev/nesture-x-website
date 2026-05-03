'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Download, Save, ArrowLeft, Send } from 'lucide-react';
import {
  type Quote,
  type QuoteLine,
  type DiscountType,
  subtotal,
  discountAmount,
  grandTotal,
  fmt,
  fmtDate,
} from '@/types/quote';
import type { QuoteStatus, SavedQuote } from '@/services/quoteService';

// ── Helpers ───────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function plusDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function nextQuoteNumber(): string {
  const year = new Date().getFullYear();
  const key  = `nx-quote-counter-${year}`;
  const n    = (parseInt(localStorage.getItem(key) ?? '0', 10)) + 1;
  localStorage.setItem(key, String(n));
  return `NX-${year}-${String(n).padStart(3, '0')}`;
}

function newLine(): QuoteLine {
  return { id: crypto.randomUUID(), description: '', qty: 1, unitPrice: 0 };
}

export function blankQuote(): Quote {
  const dateVal = today();
  return {
    quoteNumber:   '',
    date:          dateVal,
    expiryDate:    plusDays(dateVal, 14),
    clientName:    '',
    clientCompany: '',
    clientEmail:   '',
    clientPhone:   '',
    lines:         [newLine()],
    discountType:  'percent',
    discountValue: 0,
    notes:         '50% deposit required to commence work. Balance due on delivery.',
    paymentTerms:  '',
  };
}

// ── Shared input styles ───────────────────────────────────────────────────────

export const inp: React.CSSProperties = {
  background:   'rgba(255,255,255,0.04)',
  border:       '1px solid rgba(255,255,255,0.1)',
  color:        '#f5f5f5',
  fontFamily:   'inherit',
  fontSize:     '0.88rem',
  padding:      '0.55rem 0.75rem',
  outline:      'none',
  width:        '100%',
  boxSizing:    'border-box',
  transition:   'border-color 0.18s',
};

export const lbl: React.CSSProperties = {
  display:       'block',
  fontSize:      '0.56rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color:         'rgba(255,255,255,0.35)',
  marginBottom:  '0.35rem',
  fontFamily:    'var(--font-mono)',
} as React.CSSProperties;

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = 'text', placeholder = '',
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={inp}
        onFocus={e  => (e.target.style.borderColor = 'rgba(26,111,212,0.6)')}
        onBlur={e   => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <p style={{
      fontFamily:    'var(--font-mono)',
      fontSize:      '0.58rem',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color:         'rgba(26,111,212,0.75)',
      borderBottom:  '1px solid rgba(26,111,212,0.15)',
      paddingBottom: '0.5rem',
      marginBottom:  '1rem',
    }}>
      {title}
    </p>
  );
}

// ── Quote HTML preview ────────────────────────────────────────────────────────

function QuotePreview({ q }: { q: Quote }) {
  const sub   = subtotal(q.lines);
  const disc  = discountAmount(sub, q.discountType, q.discountValue);
  const total = grandTotal(q.lines, q.discountType, q.discountValue);

  const cell: React.CSSProperties = {
    padding: '7px 10px', fontSize: '0.78rem', borderBottom: '1px solid #e8ecf5',
  };

  return (
    <div style={{
      background:   '#ffffff',
      color:        '#111318',
      fontFamily:   'var(--font-body), Helvetica, sans-serif',
      fontSize:     '0.82rem',
      minHeight:    '297mm',
      width:        '100%',
      maxWidth:     '620px',
      margin:       '0 auto',
      boxShadow:    '0 4px 40px rgba(0,0,0,0.35)',
    }}>
      <div style={{ background: '#0d1b3e', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.1em' }}>NESTURE-X</div>
          <div style={{ color: 'rgba(184,206,240,0.65)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>Creative Technology Agency · Nairobi</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'rgba(184,206,240,0.55)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Document</div>
          <div style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.15em' }}>QUOTATION</div>
          <div style={{ color: 'rgba(184,206,240,0.7)', fontSize: '0.72rem', marginTop: 3 }}>{q.quoteNumber || 'NX-XXXX-000'}</div>
        </div>
      </div>
      <div style={{ height: 3, background: '#1a6fd4' }} />
      <div style={{ display: 'flex', padding: '18px 32px', borderBottom: '1px solid #dde3ef' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 6 }}>Prepared For</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{q.clientName || '—'}</div>
          {q.clientCompany && <div style={{ color: '#555e72', fontSize: '0.8rem' }}>{q.clientCompany}</div>}
          {q.clientEmail   && <div style={{ color: '#555e72', fontSize: '0.8rem' }}>{q.clientEmail}</div>}
          {q.clientPhone   && <div style={{ color: '#555e72', fontSize: '0.8rem' }}>{q.clientPhone}</div>}
        </div>
        <div style={{ width: 180 }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 6 }}>Quote Details</div>
          {[
            { label: 'Quote No.',   value: q.quoteNumber || '—' },
            { label: 'Date',        value: fmtDate(q.date) || '—' },
            { label: 'Valid Until', value: fmtDate(q.expiryDate) || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eef0f5', fontSize: '0.78rem' }}>
              <span style={{ color: '#888' }}>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 32px 16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#0d1b3e' }}>
              {['Description', 'Qty', 'Unit Price', 'Total'].map(h => (
                <th key={h} style={{ padding: '7px 10px', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', fontWeight: 600, textAlign: h === 'Description' ? 'left' : 'right' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.lines.map((line, i) => (
              <tr key={line.id} style={{ background: i % 2 === 1 ? '#f7f9fd' : '#fff' }}>
                <td style={cell}>{line.description || <span style={{ color: '#bbb' }}>—</span>}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#666' }}>{line.qty}</td>
                <td style={{ ...cell, textAlign: 'right', color: '#666' }}>{line.unitPrice.toLocaleString('en-KE')}</td>
                <td style={{ ...cell, textAlign: 'right', fontWeight: 600 }}>{(line.qty * line.unitPrice).toLocaleString('en-KE')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '0 32px 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 230, borderTop: '2px solid #1a6fd4', paddingTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.82rem' }}>
            <span style={{ color: '#888' }}>Subtotal</span>
            <span>{fmt(sub)}</span>
          </div>
          {disc > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.82rem' }}>
              <span style={{ color: '#888' }}>Discount{q.discountType === 'percent' ? ` (${q.discountValue}%)` : ''}</span>
              <span style={{ color: '#e05c6b' }}>− {fmt(disc)}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid #dde3ef', marginTop: 6, marginBottom: 8 }} />
          <div style={{ background: '#0d1b3e', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}>TOTAL DUE</span>
            <span style={{ color: '#1a6fd4', fontWeight: 700, fontSize: '1rem' }}>{fmt(total)}</span>
          </div>
        </div>
      </div>
      {(q.notes || q.paymentTerms) && (
        <div style={{ padding: '12px 32px 16px', borderTop: '1px solid #dde3ef' }}>
          {q.notes && (
            <>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 5 }}>Notes</div>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.7, margin: 0 }}>{q.notes}</p>
            </>
          )}
          {q.paymentTerms && (
            <div style={{ marginTop: q.notes ? 10 : 0 }}>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 5 }}>Payment Terms</div>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.7, margin: 0 }}>{q.paymentTerms}</p>
            </div>
          )}
        </div>
      )}
      <div style={{ background: '#0d1b3e', padding: '10px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div>
          <div style={{ color: '#1a6fd4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Nesture-X</div>
          <div style={{ color: 'rgba(184,206,240,0.6)', fontSize: '0.65rem', marginTop: 2 }}>Nairobi, Kenya · +254 717 164 951 · Nesture-x@gmail.com</div>
        </div>
        <div style={{ color: 'rgba(184,206,240,0.55)', fontSize: '0.65rem' }}>Valid until {fmtDate(q.expiryDate) || '—'}</div>
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<QuoteStatus, { bg: string; color: string }> = {
  draft:    { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)' },
  sent:     { bg: 'rgba(26,111,212,0.15)',  color: '#5ba8f5' },
  approved: { bg: 'rgba(34,197,94,0.12)',   color: '#4ade80' },
  declined: { bg: 'rgba(239,68,68,0.12)',   color: '#f87171' },
  expired:  { bg: 'rgba(234,179,8,0.1)',    color: '#fbbf24' },
};

function StatusBadge({ status, onChange }: { status: QuoteStatus; onChange: (s: QuoteStatus) => void }) {
  const col = STATUS_COLORS[status];
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={status}
        onChange={e => onChange(e.target.value as QuoteStatus)}
        style={{
          background:    col.bg,
          color:         col.color,
          border:        `1px solid ${col.color}30`,
          fontFamily:    'var(--font-mono)',
          fontSize:      '0.6rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding:       '0.3rem 1.6rem 0.3rem 0.65rem',
          cursor:        'pointer',
          appearance:    'none',
          WebkitAppearance: 'none',
          outline:       'none',
        }}
      >
        {(Object.keys(STATUS_COLORS) as QuoteStatus[]).map(s => (
          <option key={s} value={s} style={{ background: '#0d1b3e', color: '#f5f5f5' }}>{s}</option>
        ))}
      </select>
      <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: col.color, fontSize: '0.5rem' }}>▼</span>
    </div>
  );
}

// ── Main QuoteForm component ──────────────────────────────────────────────────

export interface QuoteFormProps {
  mode:        'create' | 'edit';
  initial?:    SavedQuote;
}

export default function QuoteForm({ mode, initial }: QuoteFormProps) {
  const router = useRouter();
  const [quote,       setQuote]       = useState<Quote | null>(null);
  const [status,      setStatus]      = useState<QuoteStatus>('draft');
  const [saving,      setSaving]      = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [dlError,     setDlError]     = useState('');
  const [activeTab,   setActiveTab]   = useState<'form' | 'preview'>('form');

  // ── Auth guard + initialise ───────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        if (initial) {
          const { _id: _ignored, status: s, createdAt: _c, updatedAt: _u, ...q } = initial;
          setQuote(q as Quote);
          setStatus(s);
        } else {
          const q = blankQuote();
          q.quoteNumber = nextQuoteNumber();
          setQuote(q);
        }
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(<K extends keyof Quote>(key: K, value: Quote[K]) => {
    setQuote(prev => prev ? { ...prev, [key]: value } : prev);
  }, []);

  function updateLine(id: string, field: keyof QuoteLine, value: string | number) {
    setQuote(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        lines: prev.lines.map(l =>
          l.id === id ? { ...l, [field]: field === 'description' ? value : Number(value) } : l
        ),
      };
    });
  }

  function addLine() { setQuote(prev => prev ? { ...prev, lines: [...prev.lines, newLine()] } : prev); }
  function removeLine(id: string) {
    setQuote(prev => {
      if (!prev || prev.lines.length <= 1) return prev;
      return { ...prev, lines: prev.lines.filter(l => l.id !== id) };
    });
  }

  async function saveQuote() {
    if (!quote) return;
    setSaving(true);
    setSaveError('');
    try {
      if (mode === 'create') {
        const res  = await fetch('/api/admin/quotes', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ quote, status }),
        });
        if (!res.ok) throw new Error('Save failed.');
        const saved = await res.json() as SavedQuote;
        router.replace(`/admin/quotes/${saved._id}`);
      } else {
        const res = await fetch(`/api/admin/quotes/${initial!._id}`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ ...quote, status }),
        });
        if (!res.ok) throw new Error('Save failed.');
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function downloadPDF() {
    if (!quote) return;
    setDownloading(true);
    setDlError('');
    try {
      const res = await fetch('/api/admin/quote/pdf', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(quote),
      });
      if (!res.ok) throw new Error('PDF generation failed.');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${quote.quoteNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDlError(err instanceof Error ? err.message : 'Download failed.');
    } finally {
      setDownloading(false);
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!quote) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.6)' }}>
          Loading…
        </p>
      </div>
    );
  }

  const isValid = quote.clientName.trim() && quote.lines.some(l => l.description.trim() && l.unitPrice > 0);
  const panelBg: React.CSSProperties = {
    background:   'rgba(13,27,62,0.45)',
    border:       '1px solid rgba(26,111,212,0.12)',
    padding:      '1.5rem',
    marginBottom: '1rem',
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'var(--font-body), sans-serif', color: '#f5f5f5' }}>

      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26,111,212,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2rem', height: '60px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button
            onClick={() => router.push('/admin/quotes')}
            style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.4rem 0.6rem', transition: 'color 0.18s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
          >
            <ArrowLeft size={12} /> Quotes
          </button>
          <span style={{ width: '1px', height: '18px', background: 'rgba(26,111,212,0.3)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
            {mode === 'create' ? 'New Quote' : `Edit · ${quote.quoteNumber}`}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusBadge status={status} onChange={setStatus} />
          <button
            onClick={saveQuote}
            disabled={!isValid || saving}
            style={{
              background: isValid && !saving ? 'var(--color-primary)' : 'rgba(26,111,212,0.2)',
              border: 'none', color: '#fff',
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.4rem 1rem', cursor: isValid && !saving ? 'pointer' : 'not-allowed',
              opacity: saving ? 0.7 : 1, transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
          >
            <Save size={11} /> {saving ? 'Saving…' : mode === 'create' ? 'Save' : 'Update'}
          </button>
          <button
            onClick={downloadPDF}
            disabled={!isValid || downloading}
            style={{
              background: 'transparent',
              border: '1px solid rgba(26,111,212,0.3)',
              color: 'rgba(26,111,212,0.8)',
              fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.4rem 0.85rem', cursor: !isValid || downloading ? 'not-allowed' : 'pointer',
              opacity: !isValid || downloading ? 0.5 : 1, transition: 'all 0.18s',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}
            onMouseEnter={e => { if (isValid) { (e.currentTarget as HTMLElement).style.background = 'rgba(26,111,212,0.1)'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <Download size={11} /> {downloading ? 'Generating…' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Error banners */}
      {(saveError || dlError) && (
        <div style={{ background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem 2rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#f87171', letterSpacing: '0.04em' }}>
          {saveError || dlError}
        </div>
      )}

      {/* Mobile tab switcher */}
      <div className="flex md:hidden" style={{ borderBottom: '1px solid rgba(26,111,212,0.15)', background: '#0a0a0a' }}>
        {(['form', 'preview'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '0.75rem', background: 'transparent', border: 'none',
            borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === tab ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all 0.18s',
          }}>
            {tab === 'form' ? 'Quote Form' : 'Preview'}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))', gap: 0, minHeight: 'calc(100vh - 60px)' }}>

        {/* LEFT: Form */}
        <div className={activeTab === 'preview' ? 'hidden md:block' : ''} style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', overflowY: 'auto', borderRight: '1px solid rgba(26,111,212,0.1)' }}>

          {/* Client details */}
          <div style={panelBg}>
            <SectionHead title="Client Details" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <Field label="Client Name *"  value={quote.clientName}    onChange={v => update('clientName', v)}    placeholder="John Doe" />
              <Field label="Company"        value={quote.clientCompany} onChange={v => update('clientCompany', v)} placeholder="ABC Ltd" />
              <Field label="Email"          value={quote.clientEmail}   onChange={v => update('clientEmail', v)}   placeholder="john@company.com" type="email" />
              <Field label="Phone"          value={quote.clientPhone}   onChange={v => update('clientPhone', v)}   placeholder="+254 7XX XXX XXX" />
            </div>
          </div>

          {/* Quote meta */}
          <div style={panelBg}>
            <SectionHead title="Quote Details" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
              <Field label="Quote Number" value={quote.quoteNumber} onChange={v => update('quoteNumber', v)} />
              <Field label="Date"         value={quote.date}        onChange={v => update('date', v)}        type="date" />
              <Field label="Valid Until"  value={quote.expiryDate}  onChange={v => update('expiryDate', v)}  type="date" />
            </div>
          </div>

          {/* Line items */}
          <div style={panelBg}>
            <SectionHead title="Line Items" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 90px 36px', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {['Description', 'Qty', 'Unit Price (KES)', ''].map(h => (
                <span key={h} style={{ ...lbl, marginBottom: 0 }}>{h}</span>
              ))}
            </div>
            {quote.lines.map(line => (
              <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '1fr 56px 90px 36px', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input value={line.description} onChange={e => updateLine(line.id, 'description', e.target.value)} placeholder="Service description…" style={inp} onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <input type="number" min={1} value={line.qty} onChange={e => updateLine(line.id, 'qty', e.target.value)} style={{ ...inp, textAlign: 'center' }} onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <input type="number" min={0} value={line.unitPrice} onChange={e => updateLine(line.id, 'unitPrice', e.target.value)} style={{ ...inp, textAlign: 'right' }} onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <button onClick={() => removeLine(line.id)} disabled={quote.lines.length <= 1} style={{ background: 'transparent', border: 'none', color: quote.lines.length <= 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,80,80,0.5)', cursor: quote.lines.length <= 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', transition: 'color 0.15s' }} onMouseEnter={e => { if (quote.lines.length > 1) (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,0.9)'; }} onMouseLeave={e => { if (quote.lines.length > 1) (e.currentTarget as HTMLElement).style.color = 'rgba(255,80,80,0.5)'; }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            <button onClick={addLine} style={{ background: 'transparent', border: '1px dashed rgba(26,111,212,0.3)', color: 'rgba(26,111,212,0.65)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.5rem 0', cursor: 'pointer', width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.18s' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,111,212,0.6)'; (e.currentTarget as HTMLElement).style.color = 'rgba(26,111,212,0.9)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(26,111,212,0.3)'; (e.currentTarget as HTMLElement).style.color = 'rgba(26,111,212,0.65)'; }}>
              <Plus size={12} /> Add Line Item
            </button>
          </div>

          {/* Discount */}
          <div style={panelBg}>
            <SectionHead title="Discount (optional)" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={lbl}>Type</label>
                <div style={{ position: 'relative' }}>
                  <select value={quote.discountType} onChange={e => update('discountType', e.target.value as DiscountType)} style={{ ...inp, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' } as React.CSSProperties} onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}>
                    <option value="percent" style={{ background: '#0d1b3e' }}>Percentage (%)</option>
                    <option value="flat"    style={{ background: '#0d1b3e' }}>Flat Amount (KES)</option>
                  </select>
                  <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,111,212,0.5)', pointerEvents: 'none', fontSize: '0.6rem' }}>▼</span>
                </div>
              </div>
              <Field label={quote.discountType === 'percent' ? 'Percentage (%)' : 'Amount (KES)'} value={quote.discountValue} onChange={v => update('discountValue', Number(v))} type="number" placeholder="0" />
            </div>
          </div>

          {/* Notes & Terms */}
          <div style={panelBg}>
            <SectionHead title="Notes & Terms" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={lbl}>Notes</label>
                <textarea value={quote.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any additional notes…" style={{ ...inp, resize: 'vertical', minHeight: '72px', lineHeight: 1.65 }} onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <div>
                <label style={lbl}>Payment Terms</label>
                <textarea value={quote.paymentTerms} onChange={e => update('paymentTerms', e.target.value)} rows={2} placeholder="e.g. M-Pesa Paybill 123456, Account: Client Name" style={{ ...inp, resize: 'vertical', minHeight: '56px', lineHeight: 1.65 }} onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.6)')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
            </div>
          </div>

          {/* Totals summary */}
          <div style={{ ...panelBg, background: 'rgba(26,111,212,0.06)' }}>
            {[
              { label: 'Subtotal', value: fmt(subtotal(quote.lines)), dim: true },
              ...(quote.discountValue > 0 ? [{
                label: `Discount (${quote.discountType === 'percent' ? quote.discountValue + '%' : 'flat'})`,
                value: `− ${fmt(discountAmount(subtotal(quote.lines), quote.discountType, quote.discountValue))}`,
                dim: true,
              }] : []),
              { label: 'Total Due', value: fmt(grandTotal(quote.lines, quote.discountType, quote.discountValue)), dim: false },
            ].map(({ label, value, dim }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(26,111,212,0.1)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.58rem' }}>{label}</span>
                <span style={{ color: dim ? 'rgba(255,255,255,0.65)' : '#1a6fd4', fontWeight: dim ? 400 : 700 }}>{value}</span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT: Preview */}
        <div className={activeTab === 'form' ? 'hidden md:block' : ''} style={{ background: '#111318', overflowY: 'auto', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
          <QuotePreview q={quote} />
        </div>

      </div>
    </div>
  );
}
