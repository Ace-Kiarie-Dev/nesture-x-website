'use client';

import { useState } from 'react';
import { ShoppingCart, Building2, Copy, Check, AlertTriangle } from 'lucide-react';
import BackLink from '@/components/tools/BackLink';
import NxButton from '@/components/ui/NxButton';

// ── Types ────────────────────────────────────────────────────────────────────

type Mode = 'phone' | 'till' | 'paybill';

interface PhoneResult {
  state: 'empty' | 'valid' | 'invalid';
  error?: string;
  formats?: { label: string; value: string }[];
  isSafaricom?: boolean;
}

interface SimpleResult {
  state: 'empty' | 'valid' | 'invalid';
  error?: string;
  knownName?: string;
}

// ── Validation logic ─────────────────────────────────────────────────────────

function validatePhone(raw: string): PhoneResult {
  if (!raw.trim()) return { state: 'empty' };

  const stripped = raw.trim().replace(/[\s\-\+]/g, '');

  if (!/^\d+$/.test(stripped)) {
    return { state: 'invalid', error: 'Phone number must contain digits only.' };
  }

  let norm = stripped;
  if (norm.startsWith('0')) norm = '254' + norm.slice(1);
  else if (!norm.startsWith('254')) norm = '254' + norm;

  if (norm.length !== 12) {
    return { state: 'invalid', error: 'Phone number must be 9 digits after country code.' };
  }

  const local = norm.slice(3); // 9 digits
  const p2 = local.slice(0, 2);
  const p3 = local.slice(0, 3);
  const valid7x = ['70', '71', '72', '74', '75', '76', '79'];
  const valid11x = ['110', '111', '112', '113', '114', '115'];
  const isSafaricom = valid7x.includes(p2) || valid11x.includes(p3);

  if (!isSafaricom) {
    return { state: 'invalid', error: 'This prefix is not a registered M-Pesa number.' };
  }

  const full10 = '0' + local;
  const formats = [
    { label: '07XX format', value: full10.slice(0, 4) + ' ' + full10.slice(4, 7) + ' ' + full10.slice(7) },
    { label: '254 format', value: norm },
    { label: '+254 format', value: '+' + norm },
    { label: 'International', value: '+254 ' + local.slice(0, 2) + ' ' + local.slice(2, 5) + ' ' + local.slice(5) },
  ];

  return { state: 'valid', formats, isSafaricom };
}

function validateTill(raw: string): SimpleResult {
  const trimmed = raw.trim();
  if (!trimmed) return { state: 'empty' };
  if (!/^\d+$/.test(trimmed)) return { state: 'invalid', error: 'Till number must contain digits only.' };
  if (trimmed.startsWith('0')) return { state: 'invalid', error: 'Till number must not start with 0.' };
  if (trimmed.length < 5 || trimmed.length > 7) return { state: 'invalid', error: 'Till number must be 5–7 digits.' };
  if (new Set(trimmed).size === 1) return { state: 'invalid', error: 'This appears to be a test number (all same digit).' };
  return { state: 'valid' };
}

const KNOWN_PAYBILLS: Record<string, string> = {
  '247247': 'Equity Bank',
  '200999': 'KCB Bank',
  '400200': 'NCBA Bank',
  '522533': 'Safaricom (M-Pesa)',
  '888880': 'Airtel Money',
};

function validatePaybill(raw: string): SimpleResult {
  const trimmed = raw.trim();
  if (!trimmed) return { state: 'empty' };
  if (!/^\d+$/.test(trimmed)) return { state: 'invalid', error: 'Paybill number must contain digits only.' };
  if (trimmed.startsWith('0')) return { state: 'invalid', error: 'Paybill number must not start with 0.' };
  if (trimmed.length < 5 || trimmed.length > 6) return { state: 'invalid', error: 'Paybill number must be 5–6 digits.' };
  return { state: 'valid', knownName: KNOWN_PAYBILLS[trimmed] };
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
  padding: '0.75rem 1rem',
  fontFamily: 'var(--font-mono)',
  fontSize: '1rem',
  color: 'var(--color-text)',
  outline: 'none',
  letterSpacing: '0.05em',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MpesaValidatorPage() {
  const [mode, setMode] = useState<Mode>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [tillInput, setTillInput] = useState('');
  const [paybillInput, setPaybillInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Derived — computed on every render (pure, fast)
  const phoneResult = validatePhone(phoneInput);
  const tillResult = validateTill(tillInput);
  const paybillResult = validatePaybill(paybillInput);

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch { /* silent */ }
  }

  const modeBtn = (m: Mode): React.CSSProperties => ({
    flex: 1,
    padding: '0.55rem 0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    letterSpacing: '0.08em',
    background: mode === m ? 'rgba(26,111,212,0.14)' : 'transparent',
    border: `1px solid ${mode === m ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)'}`,
    color: mode === m ? 'var(--color-primary)' : 'rgba(245,245,245,0.5)',
    cursor: 'pointer',
    transition: 'all 120ms ease',
    whiteSpace: 'nowrap' as const,
  });

  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'var(--color-primary)'; };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; };

  function ValidBadge({ children }: { children: React.ReactNode }) {
    return (
      <span style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)', color: 'rgb(34,197,94)', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em', padding: '0.2rem 0.6rem' }}>
        {children}
      </span>
    );
  }

  function InfoCard({ text }: { text: string }) {
    return (
      <div style={{ marginTop: '1.25rem', background: 'rgba(26,111,212,0.06)', border: '1px solid rgba(26,111,212,0.2)', padding: '0.85rem 1rem' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.5)', margin: 0, lineHeight: 1.6 }}>{text}</p>
      </div>
    );
  }

  return (
    <main style={{ padding: 'clamp(6rem,10vw,11rem) clamp(2rem,7vw,8rem) clamp(4rem,6vw,6rem)', background: 'var(--color-bg)' }}>
      <BackLink />

      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3.5rem,8vw,8rem)', lineHeight: 0.9, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
        M-PESA VALIDATOR
      </h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.95rem,1.3vw,1.05rem)', color: 'rgba(245,245,245,0.5)', marginBottom: '2.5rem', maxWidth: '44rem' }}>
        Validate M-Pesa Till numbers, Paybill numbers and phone numbers instantly.
      </p>

      {/* ── Main card ── */}
      <div style={{ ...GLASS, maxWidth: '600px', marginBottom: '1.5rem' }}>

        {/* Mode selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
          <button data-hover onClick={() => setMode('phone')} style={modeBtn('phone')}>Phone Number</button>
          <button data-hover onClick={() => setMode('till')} style={modeBtn('till')}>Till Number</button>
          <button data-hover onClick={() => setMode('paybill')} style={modeBtn('paybill')}>Paybill Number</button>
        </div>

        {/* ── Phone mode ── */}
        {mode === 'phone' && (
          <div>
            <label style={LABEL}>M-Pesa Phone Number</label>
            <input
              style={INPUT}
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              placeholder="07XX XXX XXX or 254XX XXX XXX"
              onFocus={focusBorder} onBlur={blurBorder}
              autoComplete="off"
            />

            {phoneResult.state === 'invalid' && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: 'rgb(239,68,68)', fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>✕</span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)', margin: 0 }}>{phoneResult.error}</p>
              </div>
            )}

            {phoneResult.state === 'valid' && phoneResult.formats && (
              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'rgb(34,197,94)', fontSize: '1rem', lineHeight: 1 }}>✓</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(34,197,94)', fontWeight: 600 }}>Valid M-Pesa number</span>
                  {phoneResult.isSafaricom && <ValidBadge>Safaricom · M-Pesa eligible</ValidBadge>}
                </div>
                {phoneResult.formats.map(f => (
                  <div
                    key={f.label}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.55rem 0.85rem', gap: '0.75rem' }}
                  >
                    <div>
                      <span style={{ ...LABEL, marginBottom: '0.15rem' }}>{f.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-text)' }}>{f.value}</span>
                    </div>
                    <button
                      data-hover
                      onClick={() => copy(f.value, f.label)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copiedId === f.label ? 'rgb(34,197,94)' : 'rgba(245,245,245,0.4)', flexShrink: 0, padding: '0.25rem' }}
                      aria-label={`Copy ${f.label}`}
                    >
                      {copiedId === f.label ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Till mode ── */}
        {mode === 'till' && (
          <div>
            <label style={LABEL}>M-Pesa Till Number (Buy Goods)</label>
            <input
              style={INPUT}
              value={tillInput}
              onChange={e => setTillInput(e.target.value)}
              placeholder="e.g. 123456"
              onFocus={focusBorder} onBlur={blurBorder}
              autoComplete="off"
              maxLength={7}
            />

            {tillResult.state === 'invalid' && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: 'rgb(239,68,68)', fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>✕</span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)', margin: 0 }}>{tillResult.error}</p>
              </div>
            )}

            {tillResult.state === 'valid' && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'rgb(34,197,94)', fontSize: '1rem', lineHeight: 1 }}>✓</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(34,197,94)', fontWeight: 600 }}>Valid Till number format</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.55rem 0.85rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--color-text)', letterSpacing: '0.1em' }}>{tillInput.trim()}</span>
                  <button
                    data-hover
                    onClick={() => copy(tillInput.trim(), 'till')}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copiedId === 'till' ? 'rgb(34,197,94)' : 'rgba(245,245,245,0.4)', padding: '0.25rem' }}
                    aria-label="Copy till number"
                  >
                    {copiedId === 'till' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.4)', marginTop: '0.6rem', margin: '0.6rem 0 0' }}>
                  This appears to be a valid M-Pesa Till (Buy Goods) number format.
                </p>
              </div>
            )}

            <InfoCard text="Till numbers are used for Buy Goods transactions. Customers pay directly to your till. Funds reflect in your M-Pesa account instantly." />
          </div>
        )}

        {/* ── Paybill mode ── */}
        {mode === 'paybill' && (
          <div>
            <label style={LABEL}>M-Pesa Paybill Number</label>
            <input
              style={INPUT}
              value={paybillInput}
              onChange={e => setPaybillInput(e.target.value)}
              placeholder="e.g. 400200"
              onFocus={focusBorder} onBlur={blurBorder}
              autoComplete="off"
              maxLength={6}
            />

            {paybillResult.state === 'invalid' && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <span style={{ color: 'rgb(239,68,68)', fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}>✕</span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(239,68,68)', margin: 0 }}>{paybillResult.error}</p>
              </div>
            )}

            {paybillResult.state === 'valid' && (
              <div style={{ marginTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span style={{ color: 'rgb(34,197,94)', fontSize: '1rem', lineHeight: 1 }}>✓</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgb(34,197,94)', fontWeight: 600 }}>Valid Paybill number format</span>
                  {paybillResult.knownName && <ValidBadge>{paybillResult.knownName}</ValidBadge>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.55rem 0.85rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--color-text)', letterSpacing: '0.1em' }}>{paybillInput.trim()}</span>
                  <button
                    data-hover
                    onClick={() => copy(paybillInput.trim(), 'paybill')}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copiedId === 'paybill' ? 'rgb(34,197,94)' : 'rgba(245,245,245,0.4)', padding: '0.25rem' }}
                    aria-label="Copy paybill number"
                  >
                    {copiedId === 'paybill' ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.4)', marginTop: '0.6rem', margin: '0.6rem 0 0' }}>
                  This appears to be a valid M-Pesa Paybill number format.
                </p>
              </div>
            )}

            <InfoCard text="Paybill numbers require customers to enter an account number when paying. Commonly used by businesses that need to reconcile payments per customer." />
          </div>
        )}
      </div>

      {/* ── Disclaimer banner ── */}
      <div
        style={{
          maxWidth: '600px',
          marginBottom: '1.5rem',
          background: 'rgba(20,25,32,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderLeftWidth: '4px',
          borderLeftColor: '#d97706',
          borderLeftStyle: 'solid',
          padding: 'clamp(1rem,2vw,1.5rem)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
            For reference only
          </h3>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.5)', margin: 0, lineHeight: 1.6 }}>
          Validation results are based on number format patterns and a limited set of known Paybill numbers. They do not confirm whether a Till or Paybill number is currently active, registered, or belongs to a specific business. Always verify payment details directly with your bank or Safaricom before using them in a live payment flow. Nesture-X accepts no liability for transactions made based on results from this tool.
        </p>
      </div>

      {/* ── Education section ── */}
      <div style={{ ...GLASS, maxWidth: '600px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Till column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShoppingCart size={16} color="var(--color-primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-text)', margin: 0 }}>
                BUY GOODS (TILL)
              </h3>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Customer pays, no account number needed',
                'Instant settlement to M-Pesa',
                'Best for: retail, food, events',
                'Limit: KES 500,000 per transaction',
              ].map(point => (
                <li key={point} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.55)', lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '0.1em' }}>—</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Paybill column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Building2 size={16} color="var(--color-primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-text)', margin: 0 }}>
                PAYBILL
              </h3>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Customer enters account number',
                'Funds go to business bank account',
                'Best for: utilities, schools, rentals',
                'Limit: KES 1,000,000 per transaction',
              ].map(point => (
                <li key={point} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(245,245,245,0.55)', lineHeight: 1.5, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '0.1em' }}>—</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Lead gen CTA ── */}
      <div
        style={{
          maxWidth: '600px',
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
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem,2vw,1.25rem)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
          Need M-Pesa integrated into your website or app?
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'rgba(245,245,245,0.5)', margin: 0, lineHeight: 1.6 }}>
          We build end-to-end M-Pesa STK Push payment flows for Kenyan businesses.
        </p>
        <div>
          <NxButton variant="ghost" size="sm" onClick={() => { window.location.href = '/contact'; }}>
            Let&apos;s Talk →
          </NxButton>
        </div>
      </div>
    </main>
  );
}
