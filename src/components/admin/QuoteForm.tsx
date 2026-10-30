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
import type { Invoice, PaymentStatus } from '@/types/invoice';
import type { SavedInvoice } from '@/services/invoiceService';
import { createInvoice, updateInvoice, downloadInvoicePDF } from '@/services/invoiceClient';
import {
  type ContactSnapshot,
  COMPANY_NAME,
  resolveContact,
  footerContactParts,
  toSnapshot,
  sameContact,
} from '@/types/contact';
import type { SavedContactProfile } from '@/services/contactProfileService';
import { fetchContactProfiles } from '@/services/contactProfileClient';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { AdminPage, Notice, Segmented, SkeletonRows, type Tone } from '@/components/admin/ui';
import { ClayButton } from '@/components/redesign';

export type DocumentType = 'quotation' | 'invoice';

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

// ── Invoice-only fields ───────────────────────────────────────────────────────
// Everything else an invoice needs is shared with Quote (client, lines,
// discount, notes, terms) and stored in the same `quote` state object below.

export interface InvoiceExtra {
  documentNumber:  string; // '' until the server allocates one on save
  issueDate:       string;
  dueDate:         string;
  paymentStatus:   PaymentStatus;
  amountPaid:      number;
  yourKraPin:      string;
  buyerKraPin:     string;
  etimsCompliant:  boolean;
}

function blankInvoiceExtra(): InvoiceExtra {
  const d = today();
  return {
    documentNumber:  '',
    issueDate:       d,
    dueDate:         plusDays(d, 14),
    paymentStatus:   'unpaid',
    amountPaid:      0,
    yourKraPin:      '',
    buyerKraPin:     '',
    etimsCompliant:  false,
  };
}

/** Combines the shared `quote` fields with invoice-only fields into an Invoice. */
function toInvoicePayload(q: Quote, extra: InvoiceExtra, contact?: ContactSnapshot): Invoice {
  return {
    documentNumber:  extra.documentNumber,
    issueDate:       extra.issueDate,
    dueDate:         extra.dueDate,
    clientName:      q.clientName,
    clientCompany:   q.clientCompany,
    clientEmail:     q.clientEmail,
    clientPhone:     q.clientPhone,
    lines:           q.lines,
    discountType:    q.discountType,
    discountValue:   q.discountValue,
    notes:           q.notes,
    paymentTerms:    q.paymentTerms,
    paymentStatus:   extra.paymentStatus,
    amountPaid:      extra.amountPaid,
    yourKraPin:      extra.yourKraPin,
    buyerKraPin:     extra.buyerKraPin,
    etimsCompliant:  extra.etimsCompliant,
    // Snapshot of the chosen contact. Undefined only while profiles are still
    // loading/unavailable — the server then snapshots the default profile.
    ...(contact ? { contact } : {}),
  };
}

const CUSTOM_CONTACT = 'custom';

function blankContact(): ContactSnapshot {
  return { contactName: '', phone: '', whatsapp: '', email: '' };
}

// ── Sub-components ────────────────────────────────────────────────────────────
// Styles: components/admin/admin.css (.nxad-*) and the shared .nx-input (hybrid.css).
// The label wraps its input, so every field is labelled without needing ids.

function Field({
  label, value, onChange, type = 'text', placeholder = '',
}: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <label className="nxad-field">
      <span className="nxad-label">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="nx-input nxad-input"
      />
    </label>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <h2 className="nxad-section-title">
      {title}
    </h2>
  );
}
// ── Quote HTML preview ────────────────────────────────────────────────────────

function QuotePreview({ q }: { q: Quote }) {
  const sub   = subtotal(q.lines);
  const disc  = discountAmount(sub, q.discountType, q.discountValue);
  const total = grandTotal(q.lines, q.discountType, q.discountValue);
  const contact = resolveContact(q.contact);

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
          <div style={{ color: '#1a6fd4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{COMPANY_NAME}</div>
          <div style={{ color: 'rgba(184,206,240,0.6)', fontSize: '0.65rem', marginTop: 2 }}>{footerContactParts(contact).join(' · ')}</div>
        </div>
        <div style={{ color: 'rgba(184,206,240,0.55)', fontSize: '0.65rem' }}>Valid until {fmtDate(q.expiryDate) || '—'}</div>
      </div>
    </div>
  );
}

// ── Invoice HTML preview ──────────────────────────────────────────────────────

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid:  'UNPAID',
  partial: 'PARTIALLY PAID',
  paid:    'PAID',
};
const PAYMENT_STATUS_HEX: Record<PaymentStatus, string> = {
  unpaid:  '#e05c6b',
  partial: '#d9a441',
  paid:    '#1e9e5a',
};

function InvoicePreview({ inv }: { inv: Invoice }) {
  const sub         = subtotal(inv.lines);
  const disc        = discountAmount(sub, inv.discountType, inv.discountValue);
  const total       = grandTotal(inv.lines, inv.discountType, inv.discountValue);
  const balanceDue  = total - (inv.amountPaid || 0);
  const statusColor = PAYMENT_STATUS_HEX[inv.paymentStatus];
  const contact     = resolveContact(inv.contact);

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
          <div style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.15em' }}>INVOICE</div>
          <div style={{ color: 'rgba(184,206,240,0.7)', fontSize: '0.72rem', marginTop: 3 }}>{inv.documentNumber || 'NX-INV-XXXX-XXX (assigned on save)'}</div>
        </div>
      </div>
      <div style={{ height: 3, background: '#1a6fd4' }} />
      {(inv.yourKraPin || inv.buyerKraPin) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#e8f0fc', padding: '6px 32px' }}>
          <span style={{ fontSize: '0.68rem', color: '#0d1b3e' }}><b>Your KRA PIN:</b> {inv.yourKraPin || '—'}</span>
          <span style={{ fontSize: '0.68rem', color: '#0d1b3e' }}><b>Buyer PIN:</b> {inv.buyerKraPin || '—'}</span>
        </div>
      )}
      <div style={{ display: 'flex', padding: '18px 32px', borderBottom: '1px solid #dde3ef' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 6 }}>Billed To</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{inv.clientName || '—'}</div>
          {inv.clientCompany && <div style={{ color: '#555e72', fontSize: '0.8rem' }}>{inv.clientCompany}</div>}
          {inv.clientEmail   && <div style={{ color: '#555e72', fontSize: '0.8rem' }}>{inv.clientEmail}</div>}
          {inv.clientPhone   && <div style={{ color: '#555e72', fontSize: '0.8rem' }}>{inv.clientPhone}</div>}
        </div>
        <div style={{ width: 190 }}>
          <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 6 }}>Invoice Details</div>
          {[
            { label: 'Invoice No.', value: inv.documentNumber || '—' },
            { label: 'Issue Date',  value: fmtDate(inv.issueDate) || '—' },
            { label: 'Due Date',    value: fmtDate(inv.dueDate) || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #eef0f5', fontSize: '0.78rem' }}>
              <span style={{ color: '#888' }}>{label}</span>
              <span style={{ fontWeight: 600 }}>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.78rem' }}>
            <span style={{ color: '#888' }}>Status</span>
            <span style={{ fontWeight: 700, color: statusColor }}>{PAYMENT_STATUS_LABEL[inv.paymentStatus]}</span>
          </div>
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
            {inv.lines.map((line, i) => (
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
              <span style={{ color: '#888' }}>Discount{inv.discountType === 'percent' ? ` (${inv.discountValue}%)` : ''}</span>
              <span style={{ color: '#e05c6b' }}>− {fmt(disc)}</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid #dde3ef', marginTop: 6, marginBottom: 8 }} />
          <div style={{ background: '#0d1b3e', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem' }}>GRAND TOTAL</span>
            <span style={{ color: '#1a6fd4', fontWeight: 700, fontSize: '1rem' }}>{fmt(total)}</span>
          </div>
          {inv.amountPaid > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8rem' }}>
              <span style={{ color: '#888' }}>Amount Paid</span>
              <span style={{ color: '#1e9e5a', fontWeight: 600 }}>{fmt(inv.amountPaid)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: '0.82rem' }}>
            <span style={{ fontWeight: 700 }}>Balance Due</span>
            <span style={{ fontWeight: 700, color: statusColor }}>{fmt(balanceDue)}</span>
          </div>
        </div>
      </div>

      {/* eTIMS placeholder — reserved for future KRA integration, left blank on purpose.
          Only shown when the invoice is marked eTIMS-compliant. */}
      {inv.etimsCompliant && (
        <div style={{ margin: '0 32px 20px', padding: '10px 14px', border: '1px dashed #dde3ef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', fontWeight: 700, marginBottom: 6 }}>eTIMS (Reserved)</div>
            <div style={{ display: 'flex', fontSize: '0.7rem', color: '#888', marginBottom: 3 }}>
              <span style={{ width: 130 }}>CU Invoice No.</span>
              <span style={{ width: 120, borderBottom: '1px solid #dde3ef' }}>&nbsp;</span>
            </div>
            <div style={{ display: 'flex', fontSize: '0.7rem', color: '#888' }}>
              <span style={{ width: 130 }}>Control Unit Serial</span>
              <span style={{ width: 120, borderBottom: '1px solid #dde3ef' }}>&nbsp;</span>
            </div>
          </div>
          <div style={{ width: 56, height: 56, border: '1px dashed #dde3ef', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
            <span style={{ fontSize: '0.5rem', color: '#bbb', letterSpacing: '0.05em', textTransform: 'uppercase' }}>QR</span>
          </div>
        </div>
      )}

      {(inv.notes || inv.paymentTerms) && (
        <div style={{ padding: '12px 32px 16px', borderTop: '1px solid #dde3ef' }}>
          {inv.notes && (
            <>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 5 }}>Notes</div>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.7, margin: 0 }}>{inv.notes}</p>
            </>
          )}
          {inv.paymentTerms && (
            <div style={{ marginTop: inv.notes ? 10 : 0 }}>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a6fd4', fontWeight: 700, marginBottom: 5 }}>Payment Terms</div>
              <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: 1.7, margin: 0 }}>{inv.paymentTerms}</p>
            </div>
          )}
        </div>
      )}
      <div style={{ background: '#0d1b3e', padding: '10px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <div>
          <div style={{ color: '#1a6fd4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{COMPANY_NAME}</div>
          <div style={{ color: 'rgba(184,206,240,0.6)', fontSize: '0.65rem', marginTop: 2 }}>{footerContactParts(contact).join(' · ')}</div>
        </div>
        <div style={{ color: 'rgba(184,206,240,0.55)', fontSize: '0.65rem' }}>Due {fmtDate(inv.dueDate) || '—'}</div>
      </div>
    </div>
  );
}

// ── Contact details picker ────────────────────────────────────────────────────

function ContactPicker({
  profiles, choice, custom, error, onChoice, onCustom,
}: {
  profiles: SavedContactProfile[];
  choice:   string;
  custom:   ContactSnapshot;
  error:    string;
  onChoice: (v: string) => void;
  onCustom: <K extends keyof ContactSnapshot>(key: K, value: ContactSnapshot[K]) => void;
}) {
  return (
    <>
      <label className="nxad-field">
        <span className="nxad-label">Contact on document</span>
        <span className="nx-select">
          <select
            value={choice}
            onChange={e => onChoice(e.target.value)}
            className="nx-input nxad-input"
          >
            {!choice && <option value="">Loading…</option>}
            {profiles.map(p => (
              <option key={p._id} value={p._id}>
                {p.label}{p.isDefault ? ' (default)' : ''} · {p.contactName} · {p.phone}
              </option>
            ))}
            <option value={CUSTOM_CONTACT}>Custom (this document only)</option>
          </select>
        </span>
      </label>
      {error && (
        <p className="nxad-hint nxad-hint--warn" role="status">{error}</p>
      )}
      {choice === CUSTOM_CONTACT && (
        <div className="nxad-grid-2">
          <Field label="Contact Name *"      value={custom.contactName} onChange={v => onCustom('contactName', v)} placeholder="Jane Doe" />
          <Field label="Phone *"             value={custom.phone}       onChange={v => onCustom('phone', v)}       placeholder="+254 7XX XXX XXX" />
          <Field label="Email *"             value={custom.email}       onChange={v => onCustom('email', v)}       placeholder="jane@nesturex.com" type="email" />
          <Field label="WhatsApp (optional)" value={custom.whatsapp}    onChange={v => onCustom('whatsapp', v)}    placeholder="Only if different from phone" />
        </div>
      )}
      <p className="nxad-hint">
        Copied onto the document when you save. Later profile edits won&apos;t change it.
      </p>
    </>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
// A native select styled as a status chip (colour + the status text).

const QUOTE_STATUSES: QuoteStatus[] = ['draft', 'sent', 'approved', 'declined', 'expired'];

const QUOTE_TONE: Record<QuoteStatus, Tone> = {
  draft:    'neutral',
  sent:     'blue',
  approved: 'green',
  declined: 'red',
  expired:  'amber',
};

function StatusBadge({ status, onChange }: { status: QuoteStatus; onChange: (s: QuoteStatus) => void }) {
  return (
    <span className={`nxad-status-select nxad-chip nxad-chip--${QUOTE_TONE[status]}`}>
      <span className="nxad-chip-mark" aria-hidden="true" />
      <select
        value={status}
        onChange={e => onChange(e.target.value as QuoteStatus)}
        aria-label="Quote status"
      >
        {QUOTE_STATUSES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </span>
  );
}

// ── Main QuoteForm component ──────────────────────────────────────────────────

export interface QuoteFormProps {
  mode:            'create' | 'edit';
  initial?:        SavedQuote;
  initialInvoice?: SavedInvoice;
  /** Only used in create mode with no `initial`/`initialInvoice` — preselects the dropdown. */
  defaultDocType?: DocumentType;
}

export default function QuoteForm({ mode, initial, initialInvoice, defaultDocType }: QuoteFormProps) {
  const router = useRouter();
  const [docType,     setDocType]     = useState<DocumentType>(
    initialInvoice ? 'invoice' : (defaultDocType ?? 'quotation'),
  );
  const [quote,       setQuote]       = useState<Quote | null>(null);
  const [invoiceExtra, setInvoiceExtra] = useState<InvoiceExtra>(blankInvoiceExtra());
  const [status,      setStatus]      = useState<QuoteStatus>('draft');
  const [saving,      setSaving]      = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saveError,   setSaveError]   = useState('');
  const [dlError,     setDlError]     = useState('');
  const [activeTab,   setActiveTab]   = useState<'form' | 'preview'>('form');
  const [profiles,      setProfiles]      = useState<SavedContactProfile[]>([]);
  const [profilesError, setProfilesError] = useState('');
  // A profile _id, CUSTOM_CONTACT, or '' while profiles load.
  const [contactChoice, setContactChoice] = useState('');
  const [customContact, setCustomContact] = useState<ContactSnapshot>(blankContact());

  // ── Auth guard + initialise ───────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => {
        if (!d.ok) { router.replace('/admin'); return; }
        if (initialInvoice) {
          setDocType('invoice');
          const {
            _id: _ignored, createdAt: _c, updatedAt: _u,
            documentNumber, issueDate, dueDate, paymentStatus, amountPaid, yourKraPin, buyerKraPin, etimsCompliant,
            contact,
            ...shared
          } = initialInvoice;
          setQuote({ quoteNumber: '', date: '', expiryDate: '', ...shared });
          setInvoiceExtra({ documentNumber, issueDate, dueDate, paymentStatus, amountPaid, yourKraPin, buyerKraPin, etimsCompliant });
          // Start from the invoice's own snapshot (or the legacy values it renders
          // with today) so re-saving never silently swaps its contact.
          const existing = resolveContact(contact);
          setCustomContact(existing);
          setContactChoice(CUSTOM_CONTACT);
          loadContactProfiles(existing);
        } else if (initial) {
          const { _id: _ignored, status: s, createdAt: _c, updatedAt: _u, contact, ...q } = initial;
          setQuote(q as Quote);
          setStatus(s);
          // Same as invoices: start from the quote's own snapshot (or legacy values).
          const existing = resolveContact(contact);
          setCustomContact(existing);
          setContactChoice(CUSTOM_CONTACT);
          loadContactProfiles(existing);
        } else {
          const q = blankQuote();
          q.quoteNumber = nextQuoteNumber();
          setQuote(q);
          loadContactProfiles(null);
        }
      })
      .catch(() => router.replace('/admin'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Loads profiles and picks the dropdown value: the profile matching the
   * document's existing snapshot (else it stays on Custom with that snapshot),
   * or the default profile for a new document.
   */
  async function loadContactProfiles(existing: ContactSnapshot | null) {
    try {
      const list = await fetchContactProfiles();
      setProfiles(list);
      if (existing) {
        const match = list.find(p => sameContact(toSnapshot(p), existing));
        if (match) setContactChoice(match._id);
      } else {
        const def = list.find(p => p.isDefault) ?? list[0];
        setContactChoice(def ? def._id : CUSTOM_CONTACT);
      }
    } catch {
      setProfilesError('Could not load contact profiles. New documents will use the default profile on save.');
    }
  }

  const chosenProfile = profiles.find(p => p._id === contactChoice);
  const chosenContact: ContactSnapshot | undefined =
    contactChoice === CUSTOM_CONTACT ? customContact
    : chosenProfile ? toSnapshot(chosenProfile)
    : undefined;

  function changeContactChoice(v: string) {
    // Switching to Custom starts from whatever is currently selected.
    if (v === CUSTOM_CONTACT && chosenContact) setCustomContact(chosenContact);
    setContactChoice(v);
  }

  const updateCustomContact = useCallback(<K extends keyof ContactSnapshot>(key: K, value: ContactSnapshot[K]) => {
    setCustomContact(prev => ({ ...prev, [key]: value }));
  }, []);

  const update = useCallback(<K extends keyof Quote>(key: K, value: Quote[K]) => {
    setQuote(prev => prev ? { ...prev, [key]: value } : prev);
  }, []);

  const updateInvoiceExtra = useCallback(<K extends keyof InvoiceExtra>(key: K, value: InvoiceExtra[K]) => {
    setInvoiceExtra(prev => ({ ...prev, [key]: value }));
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
          body:    JSON.stringify({ quote: { ...quote, contact: chosenContact }, status }),
        });
        if (!res.ok) throw new Error('Save failed.');
        const saved = await res.json() as SavedQuote;
        router.replace(`/admin/quotes/${saved._id}`);
      } else {
        const res = await fetch(`/api/admin/quotes/${initial!._id}`, {
          method:  'PUT',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ ...quote, contact: chosenContact, status }),
        });
        if (!res.ok) throw new Error('Save failed.');
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function saveInvoice() {
    if (!quote) return;
    setSaving(true);
    setSaveError('');
    try {
      const payload = toInvoicePayload(quote, invoiceExtra, chosenContact);
      if (mode === 'create') {
        const saved = await createInvoice(payload);
        router.replace(`/admin/invoices/${saved._id}`);
      } else {
        const saved = await updateInvoice(initialInvoice!._id, payload);
        setInvoiceExtra(prev => ({ ...prev, documentNumber: saved.documentNumber }));
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function saveDocument() {
    if (docType === 'quotation') await saveQuote();
    else await saveInvoice();
  }

  async function downloadPDF() {
    if (!quote) return;
    setDownloading(true);
    setDlError('');
    try {
      if (docType === 'quotation') {
        const res = await fetch('/api/admin/quote/pdf', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ ...quote, contact: chosenContact }),
        });
        if (!res.ok) throw new Error('PDF generation failed.');
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${quote.quoteNumber}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        if (!invoiceExtra.documentNumber) throw new Error('Save the invoice first to generate its number.');
        await downloadInvoicePDF(toInvoicePayload(quote, invoiceExtra, chosenContact));
      }
    } catch (err) {
      setDlError(err instanceof Error ? err.message : 'Download failed.');
    } finally {
      setDownloading(false);
    }
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (!quote) {
    return (
      <>
        <AdminTopBar active={docType === 'quotation' ? 'quotes' : 'invoices'} />
        <AdminPage className="nxad-page--doc" aria-busy="true">
          <SkeletonRows rows={6} tall label="Loading…" />
        </AdminPage>
      </>
    );
  }

  const customContactValid = !!(customContact.contactName.trim() && customContact.phone.trim() && customContact.email.trim());
  const isValid = quote.clientName.trim()
    && quote.lines.some(l => l.description.trim() && l.unitPrice > 0)
    && (contactChoice !== CUSTOM_CONTACT || customContactValid);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Shell top bar: status (quotes) everywhere; Save and PDF here from 768px,
          in the sticky bar at the bottom on phones. */}
      <AdminTopBar
        active={docType === 'quotation' ? 'quotes' : 'invoices'}
        actions={
          <>
            {docType === 'quotation' && <StatusBadge status={status} onChange={setStatus} />}
            <span className="nxad-desk-only nxad-top-actions-group">
              <ClayButton
                onClick={saveDocument}
                disabled={!isValid || saving}
                aria-busy={saving || undefined}
                className="nxad-btn"
              >
                {saving ? <span className="nxad-spinner" aria-hidden="true" /> : <Save size={16} aria-hidden />}
                {saving ? 'Saving…' : mode === 'create' ? 'Save' : 'Update'}
              </ClayButton>
              <ClayButton
                variant="ghost"
                onClick={downloadPDF}
                disabled={!isValid || downloading || (docType === 'invoice' && !invoiceExtra.documentNumber)}
                title={docType === 'invoice' && !invoiceExtra.documentNumber ? 'Save the invoice first to generate its number' : undefined}
                aria-busy={downloading || undefined}
                className="nxad-btn"
              >
                <Download size={16} aria-hidden /> {downloading ? 'Generating…' : 'PDF'}
              </ClayButton>
            </span>
          </>
        }
      />

      <AdminPage className="nxad-page--doc">

        {/* Heading with the way back */}
        <div className="nxad-doc-head">
          <ClayButton
            variant="ghost"
            onClick={() => router.push(docType === 'quotation' ? '/admin/quotes' : '/admin/invoices')}
            className="nxad-btn nxad-back"
          >
            <ArrowLeft size={16} aria-hidden /> {docType === 'quotation' ? 'Quotes' : 'Invoices'}
          </ClayButton>
          <h1 className="nxad-h1 nxad-doc-title">
            {docType === 'quotation'
              ? (mode === 'create' ? 'New Quote'   : `Edit · ${quote.quoteNumber}`)
              : (mode === 'create' ? 'New Invoice' : `Edit · ${invoiceExtra.documentNumber}`)}
          </h1>
        </div>

        {/* Error banners */}
        <div className="nxad-live" aria-live="assertive">
          {(saveError || dlError) && <Notice>{saveError || dlError}</Notice>}
        </div>

        {/* Phone: form / preview switch */}
        <Segmented
          label="View"
          className="nxad-doc-tabs"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            { value: 'form',    label: docType === 'quotation' ? 'Quote Form' : 'Invoice Form' },
            { value: 'preview', label: 'Preview' },
          ]}
        />

        {/* Main grid */}
        <div className="nxad-doc-grid">

          {/* LEFT: Form */}
          <div className={activeTab === 'preview' ? 'nxad-doc-form is-hidden-sm' : 'nxad-doc-form'}>

            {/* Billing — document type */}
            <section className="nxad-section nx-clay">
              <SectionHead title="Billing" />
              <label className="nxad-field">
                <span className="nxad-label">Document Type</span>
                <span className="nx-select">
                  <select
                    value={docType}
                    disabled={mode === 'edit'}
                    onChange={e => setDocType(e.target.value as DocumentType)}
                    className="nx-input nxad-input"
                  >
                    <option value="quotation">Quotation</option>
                    <option value="invoice">Invoice</option>
                  </select>
                </span>
              </label>
            </section>

            {/* Client details */}
            <section className="nxad-section nx-clay">
              <SectionHead title="Client Details" />
              <div className="nxad-grid-2">
                <Field label="Client Name *"  value={quote.clientName}    onChange={v => update('clientName', v)}    placeholder="John Doe" />
                <Field label="Company"        value={quote.clientCompany} onChange={v => update('clientCompany', v)} placeholder="ABC Ltd" />
                <Field label="Email"          value={quote.clientEmail}   onChange={v => update('clientEmail', v)}   placeholder="john@company.com" type="email" />
                <Field label="Phone"          value={quote.clientPhone}   onChange={v => update('clientPhone', v)}   placeholder="+254 7XX XXX XXX" />
              </div>
            </section>

            {/* Quote meta */}
            {docType === 'quotation' ? (
              <section className="nxad-section nx-clay">
                <SectionHead title="Quote Details" />
                <div className="nxad-grid-3">
                  <Field label="Quote Number" value={quote.quoteNumber} onChange={v => update('quoteNumber', v)} />
                  <Field label="Date"         value={quote.date}        onChange={v => update('date', v)}        type="date" />
                  <Field label="Valid Until"  value={quote.expiryDate}  onChange={v => update('expiryDate', v)}  type="date" />
                </div>
              </section>
            ) : (
              <>
                <section className="nxad-section nx-clay">
                  <SectionHead title="Invoice Details" />
                  <div className="nxad-grid-3">
                    <label className="nxad-field">
                      <span className="nxad-label">Invoice Number</span>
                      <input
                        value={invoiceExtra.documentNumber || '(assigned on save)'}
                        readOnly
                        disabled
                        className="nx-input nxad-input"
                      />
                    </label>
                    <Field label="Issue Date" value={invoiceExtra.issueDate} onChange={v => updateInvoiceExtra('issueDate', v)} type="date" />
                    <Field label="Due Date"   value={invoiceExtra.dueDate}   onChange={v => updateInvoiceExtra('dueDate', v)}   type="date" />
                  </div>
                  <div className="nxad-grid-2">
                    <label className="nxad-field">
                      <span className="nxad-label">Payment Status</span>
                      <span className="nx-select">
                        <select
                          value={invoiceExtra.paymentStatus}
                          onChange={e => updateInvoiceExtra('paymentStatus', e.target.value as PaymentStatus)}
                          className="nx-input nxad-input"
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="partial">Partial</option>
                          <option value="paid">Paid</option>
                        </select>
                      </span>
                    </label>
                    <Field label="Amount Paid (KES)" value={invoiceExtra.amountPaid} onChange={v => updateInvoiceExtra('amountPaid', Number(v))} type="number" placeholder="0" />
                  </div>
                </section>

                <section className="nxad-section nx-clay">
                  <SectionHead title="Tax Info (KRA)" />
                  <div className="nxad-grid-2">
                    <Field label="Your KRA PIN"         value={invoiceExtra.yourKraPin}  onChange={v => updateInvoiceExtra('yourKraPin', v)}  placeholder="P0XXXXXXXXX" />
                    <Field label="Buyer PIN (optional)" value={invoiceExtra.buyerKraPin} onChange={v => updateInvoiceExtra('buyerKraPin', v)} placeholder="A0XXXXXXXXX" />
                  </div>
                  <label className="nxad-check">
                    <input
                      type="checkbox"
                      checked={invoiceExtra.etimsCompliant}
                      onChange={e => updateInvoiceExtra('etimsCompliant', e.target.checked)}
                    />
                    <span className="nxad-label">eTIMS compliant invoice</span>
                  </label>
                </section>
              </>
            )}

            {/* Contact details — snapshotted onto the quote/invoice on save */}
            <section className="nxad-section nx-clay">
              <SectionHead title="Contact Details" />
              <ContactPicker
                profiles={profiles}
                choice={contactChoice}
                custom={customContact}
                error={profilesError}
                onChoice={changeContactChoice}
                onCustom={updateCustomContact}
              />
            </section>

            {/* Line items */}
            <section className="nxad-section nx-clay">
              <SectionHead title="Line Items" />
              <div className="nxad-lines-head" aria-hidden="true">
                {['Description', 'Qty', 'Unit Price (KES)', ''].map(h => (
                  <span key={h} className="nxad-label">{h}</span>
                ))}
              </div>
              <ul className="nxad-lines">
                {quote.lines.map((line, i) => (
                  <li key={line.id} className="nxad-line">
                    <input value={line.description} onChange={e => updateLine(line.id, 'description', e.target.value)} placeholder="Service description…" aria-label={`Line ${i + 1} description`} className="nx-input nxad-input nxad-line-desc" />
                    <input type="number" min={1} value={line.qty} onChange={e => updateLine(line.id, 'qty', e.target.value)} aria-label={`Line ${i + 1} quantity`} className="nx-input nxad-input nxad-line-qty" />
                    <input type="number" min={0} value={line.unitPrice} onChange={e => updateLine(line.id, 'unitPrice', e.target.value)} aria-label={`Line ${i + 1} unit price (KES)`} className="nx-input nxad-input nxad-line-price" />
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      disabled={quote.lines.length <= 1}
                      title="Remove line"
                      aria-label={`Remove line ${i + 1}`}
                      className="nxad-icon-btn nxad-icon-btn--danger nxad-line-remove"
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={addLine} className="nxad-add-line">
                <Plus size={16} aria-hidden /> Add Line Item
              </button>
            </section>

            {/* Discount */}
            <section className="nxad-section nx-clay">
              <SectionHead title="Discount (optional)" />
              <div className="nxad-grid-2">
                <label className="nxad-field">
                  <span className="nxad-label">Type</span>
                  <span className="nx-select">
                    <select value={quote.discountType} onChange={e => update('discountType', e.target.value as DiscountType)} className="nx-input nxad-input">
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat Amount (KES)</option>
                    </select>
                  </span>
                </label>
                <Field label={quote.discountType === 'percent' ? 'Percentage (%)' : 'Amount (KES)'} value={quote.discountValue} onChange={v => update('discountValue', Number(v))} type="number" placeholder="0" />
              </div>
            </section>

            {/* Notes & Terms */}
            <section className="nxad-section nx-clay">
              <SectionHead title="Notes & Terms" />
              <label className="nxad-field">
                <span className="nxad-label">Notes</span>
                <textarea value={quote.notes} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any additional notes…" className="nx-input nx-textarea nxad-input" />
              </label>
              <label className="nxad-field">
                <span className="nxad-label">Payment Terms</span>
                <textarea value={quote.paymentTerms} onChange={e => update('paymentTerms', e.target.value)} rows={2} placeholder="e.g. M-Pesa Paybill 123456, Account: Client Name" className="nx-input nx-textarea nxad-input" />
              </label>
            </section>

            {/* Totals summary: pinned to the bottom of the form column from 768px */}
            <section className="nxad-totals nx-clay" aria-label="Totals">
              {[
                { label: 'Subtotal', value: fmt(subtotal(quote.lines)), dim: true },
                ...(quote.discountValue > 0 ? [{
                  label: `Discount (${quote.discountType === 'percent' ? quote.discountValue + '%' : 'flat'})`,
                  value: `− ${fmt(discountAmount(subtotal(quote.lines), quote.discountType, quote.discountValue))}`,
                  dim: true,
                }] : []),
                { label: docType === 'invoice' ? 'Grand Total' : 'Total Due', value: fmt(grandTotal(quote.lines, quote.discountType, quote.discountValue)), dim: false },
                ...(docType === 'invoice' ? [
                  ...(invoiceExtra.amountPaid > 0 ? [{
                    label: 'Amount Paid',
                    value: fmt(invoiceExtra.amountPaid),
                    dim: true,
                  }] : []),
                  {
                    label: 'Balance Due',
                    value: fmt(grandTotal(quote.lines, quote.discountType, quote.discountValue) - invoiceExtra.amountPaid),
                    dim: false,
                  },
                ] : []),
              ].map(({ label, value, dim }) => (
                <div key={label} className={dim ? 'nxad-total-row' : 'nxad-total-row is-key'}>
                  <span className="nxad-label">{label}</span>
                  <span className="nxad-total-value">{value}</span>
                </div>
              ))}
            </section>

          </div>

          {/* RIGHT: Preview (the paper preview is left as it was) */}
          <div className={activeTab === 'form' ? 'nxad-doc-preview is-hidden-sm' : 'nxad-doc-preview'}>
            {docType === 'quotation'
              ? <QuotePreview q={{ ...quote, contact: chosenContact }} />
              : <InvoicePreview inv={toInvoicePayload(quote, invoiceExtra, chosenContact)} />}
          </div>

        </div>

        {/* Phone: sticky save bar with the key total */}
        <div className="nxad-savebar">
          <div className="nxad-savebar-total">
            <span className="nxad-label">{docType === 'invoice' ? 'Balance Due' : 'Total Due'}</span>
            <span className="nxad-total-value">
              {docType === 'invoice'
                ? fmt(grandTotal(quote.lines, quote.discountType, quote.discountValue) - invoiceExtra.amountPaid)
                : fmt(grandTotal(quote.lines, quote.discountType, quote.discountValue))}
            </span>
          </div>
          <ClayButton
            variant="ghost"
            onClick={downloadPDF}
            disabled={!isValid || downloading || (docType === 'invoice' && !invoiceExtra.documentNumber)}
            aria-label={downloading ? 'Generating PDF' : 'Download PDF'}
            aria-busy={downloading || undefined}
            className="nxad-btn nxad-savebar-pdf"
          >
            <Download size={16} aria-hidden /> PDF
          </ClayButton>
          <ClayButton
            onClick={saveDocument}
            disabled={!isValid || saving}
            aria-busy={saving || undefined}
            className="nxad-btn"
          >
            {saving ? <span className="nxad-spinner" aria-hidden="true" /> : <Save size={16} aria-hidden />}
            {saving ? 'Saving…' : mode === 'create' ? 'Save' : 'Update'}
          </ClayButton>
        </div>
      </AdminPage>
    </>
  );
}
