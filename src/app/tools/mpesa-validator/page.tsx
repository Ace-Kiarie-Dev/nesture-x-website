'use client';

import { useState } from 'react';
import { ShoppingCart, Building2, Copy, Check, AlertTriangle } from 'lucide-react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Segmented } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';

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

// ── Presentational pieces ─────────────────────────────────────────────────────

function ValidBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="nxtl-mp-badge">
      {children}
    </span>
  );
}

function InfoCard({ text }: { text: string }) {
  return (
    <div className="nxtl-mp-info">
      <p>{text}</p>
    </div>
  );
}

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

  return (
    <ToolShell
      title="M-Pesa Validator"
      outline="Validator"
      description="Validate M-Pesa Till numbers, Paybill numbers and phone numbers instantly."
    >
      <div className="nxtl-panes nxtl-panes--wide-left">

        {/* ── Main card ── */}
        <div className="nxtl-panel nx-clay">

          {/* Mode selector */}
          <Segmented
            label="What to validate"
            size="sm"
            className="nxtl-mp-modes"
            options={[
              { value: 'phone' as Mode, label: 'Phone Number' },
              { value: 'till' as Mode, label: 'Till Number' },
              { value: 'paybill' as Mode, label: 'Paybill Number' },
            ]}
            value={mode}
            onChange={setMode}
          />

          {/* ── Phone mode ── */}
          {mode === 'phone' && (
            <div className="nxtl-mp-mode">
              <div className="nx-field">
                <label htmlFor="mp-phone">M-Pesa Phone Number</label>
                <input
                  id="mp-phone"
                  className="nx-input nxtl-mp-input"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  placeholder="07XX XXX XXX or 254XX XXX XXX"
                  aria-invalid={phoneResult.state === 'invalid'}
                  inputMode="tel"
                  autoComplete="off"
                />
              </div>

              <div aria-live="polite">
                {phoneResult.state === 'invalid' && (
                  <div className="nxtl-mp-msg nxtl-mp-msg--err">
                    <span aria-hidden="true">✕</span>
                    <p>{phoneResult.error}</p>
                  </div>
                )}

                {phoneResult.state === 'valid' && phoneResult.formats && (
                  <div className="nxtl-mp-result">
                    <div className="nxtl-mp-msg nxtl-mp-msg--ok">
                      <span aria-hidden="true">✓</span>
                      <span>Valid M-Pesa number</span>
                      {phoneResult.isSafaricom && <ValidBadge>Safaricom · M-Pesa eligible</ValidBadge>}
                    </div>
                    {phoneResult.formats.map(f => (
                      <div key={f.label} className="nxtl-mp-row">
                        <div className="nxtl-mp-row-text">
                          <span className="nxtl-mp-row-label">{f.label}</span>
                          <span className="nxtl-mp-row-value">{f.value}</span>
                        </div>
                        <button
                          type="button"
                          data-hover
                          onClick={() => copy(f.value, f.label)}
                          className={`nxtl-mp-copy${copiedId === f.label ? ' is-copied' : ''}`}
                          aria-label={`Copy ${f.label}`}
                        >
                          {copiedId === f.label ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Till mode ── */}
          {mode === 'till' && (
            <div className="nxtl-mp-mode">
              <div className="nx-field">
                <label htmlFor="mp-till">M-Pesa Till Number (Buy Goods)</label>
                <input
                  id="mp-till"
                  className="nx-input nxtl-mp-input"
                  value={tillInput}
                  onChange={e => setTillInput(e.target.value)}
                  placeholder="e.g. 123456"
                  aria-invalid={tillResult.state === 'invalid'}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={7}
                />
              </div>

              <div aria-live="polite">
                {tillResult.state === 'invalid' && (
                  <div className="nxtl-mp-msg nxtl-mp-msg--err">
                    <span aria-hidden="true">✕</span>
                    <p>{tillResult.error}</p>
                  </div>
                )}

                {tillResult.state === 'valid' && (
                  <div className="nxtl-mp-result">
                    <div className="nxtl-mp-msg nxtl-mp-msg--ok">
                      <span aria-hidden="true">✓</span>
                      <span>Valid Till number format</span>
                    </div>
                    <div className="nxtl-mp-row">
                      <span className="nxtl-mp-row-value nxtl-mp-row-value--lg">{tillInput.trim()}</span>
                      <button
                        type="button"
                        data-hover
                        onClick={() => copy(tillInput.trim(), 'till')}
                        className={`nxtl-mp-copy${copiedId === 'till' ? ' is-copied' : ''}`}
                        aria-label="Copy till number"
                      >
                        {copiedId === 'till' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="nxtl-hint">
                      This appears to be a valid M-Pesa Till (Buy Goods) number format.
                    </p>
                  </div>
                )}
              </div>

              <InfoCard text="Till numbers are used for Buy Goods transactions. Customers pay directly to your till. Funds reflect in your M-Pesa account instantly." />
            </div>
          )}

          {/* ── Paybill mode ── */}
          {mode === 'paybill' && (
            <div className="nxtl-mp-mode">
              <div className="nx-field">
                <label htmlFor="mp-paybill">M-Pesa Paybill Number</label>
                <input
                  id="mp-paybill"
                  className="nx-input nxtl-mp-input"
                  value={paybillInput}
                  onChange={e => setPaybillInput(e.target.value)}
                  placeholder="e.g. 400200"
                  aria-invalid={paybillResult.state === 'invalid'}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={6}
                />
              </div>

              <div aria-live="polite">
                {paybillResult.state === 'invalid' && (
                  <div className="nxtl-mp-msg nxtl-mp-msg--err">
                    <span aria-hidden="true">✕</span>
                    <p>{paybillResult.error}</p>
                  </div>
                )}

                {paybillResult.state === 'valid' && (
                  <div className="nxtl-mp-result">
                    <div className="nxtl-mp-msg nxtl-mp-msg--ok">
                      <span aria-hidden="true">✓</span>
                      <span>Valid Paybill number format</span>
                      {paybillResult.knownName && <ValidBadge>{paybillResult.knownName}</ValidBadge>}
                    </div>
                    <div className="nxtl-mp-row">
                      <span className="nxtl-mp-row-value nxtl-mp-row-value--lg">{paybillInput.trim()}</span>
                      <button
                        type="button"
                        data-hover
                        onClick={() => copy(paybillInput.trim(), 'paybill')}
                        className={`nxtl-mp-copy${copiedId === 'paybill' ? ' is-copied' : ''}`}
                        aria-label="Copy paybill number"
                      >
                        {copiedId === 'paybill' ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="nxtl-hint">
                      This appears to be a valid M-Pesa Paybill number format.
                    </p>
                  </div>
                )}
              </div>

              <InfoCard text="Paybill numbers require customers to enter an account number when paying. Commonly used by businesses that need to reconcile payments per customer." />
            </div>
          )}
        </div>

        <div className="nxtl-stack">
          {/* ── Disclaimer banner ── */}
          <div className="nxtl-panel nx-glass nxtl-mp-warn">
            <div className="nxtl-mp-warn-head">
              <AlertTriangle size={18} aria-hidden="true" />
              <h3>For reference only</h3>
            </div>
            <p className="nxtl-hint">
              Validation results are based on number format patterns and a limited set of known Paybill numbers. They do not confirm whether a Till or Paybill number is currently active, registered, or belongs to a specific business. Always verify payment details directly with your bank or Safaricom before using them in a live payment flow. Nesture-X accepts no liability for transactions made based on results from this tool.
            </p>
          </div>

          {/* ── Education section ── */}
          <div className="nxtl-panel nx-clay nxtl-mp-edu">

            {/* Till column */}
            <div>
              <div className="nxtl-mp-edu-head">
                <ShoppingCart size={18} aria-hidden="true" />
                <h3>BUY GOODS (TILL)</h3>
              </div>
              <ul className="nxtl-mp-list">
                {[
                  'Customer pays, no account number needed',
                  'Instant settlement to M-Pesa',
                  'Best for: retail, food, events',
                  'Limit: KES 500,000 per transaction',
                ].map(point => (
                  <li key={point}>
                    <span aria-hidden="true">—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Paybill column */}
            <div>
              <div className="nxtl-mp-edu-head">
                <Building2 size={18} aria-hidden="true" />
                <h3>PAYBILL</h3>
              </div>
              <ul className="nxtl-mp-list">
                {[
                  'Customer enters account number',
                  'Funds go to business bank account',
                  'Best for: utilities, schools, rentals',
                  'Limit: KES 1,000,000 per transaction',
                ].map(point => (
                  <li key={point}>
                    <span aria-hidden="true">—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Lead gen CTA ── */}
      <aside className="nxtl-cta nxtl-ltp-cta nx-glass" aria-label="M-Pesa integration">
        <div className="nxtl-cta-copy">
          <h2 className="nxtl-ltp-cta-title">
            Need M-Pesa integrated into your website or app?
          </h2>
          <p className="nxtl-cta-text">
            We build end-to-end M-Pesa STK Push payment flows for Kenyan businesses.
          </p>
        </div>
        <ClayButton href="/contact" variant="ghost" className="nx-clay-btn--sm">
          Let&apos;s Talk →
        </ClayButton>
      </aside>
    </ToolShell>
  );
}
