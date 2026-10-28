'use client';

import { useState, useEffect, useRef } from 'react';
import ToolShell from '@/components/redesign/tools/ToolShell';
import { Spinner, Status } from '@/components/redesign/tools/blocks';
import { ClayButton } from '@/components/redesign';
import { Plus, Trash2, Upload, X } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

type Currency = 'KES' | 'USD' | 'GBP' | 'EUR';
type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
type DiscountType = 'pct' | 'flat';

// ── Constants ────────────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  KES: 'KES ', USD: '$', GBP: '£', EUR: '€',
};

function fmt(n: number, cur: Currency) {
  return `${CURRENCY_SYMBOLS[cur]}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

// ── PDF generation ────────────────────────────────────────────────────────────

async function generateInvoicePDF(data: {
  businessName: string; email: string; phone: string; address: string;
  logoDataUrl: string | null;
  mpesaTill: string; mpesaPaybill: string; bankName: string; bankAccount: string;
  clientName: string; clientEmail: string; clientAddress: string;
  invoiceNumber: string; date: string; dueDate: string; currency: Currency;
  status: InvoiceStatus;
  items: LineItem[];
  vatPct: number;
  globalDiscount: number;
  globalDiscountType: DiscountType;
  notes: string;
}) {
  const { PDFDocument, StandardFonts, rgb, degrees } = await import('pdf-lib');

  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const M = 50;
  let y = height - M;

  const black = rgb(0, 0, 0);
  const grey = rgb(0.4, 0.4, 0.4);
  const lightGrey = rgb(0.85, 0.85, 0.85);

  function line(x1: number, y1: number, x2: number, y2: number, thickness = 0.5) {
    page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y2 }, thickness, color: lightGrey });
  }

  function text(
    str: string,
    x: number,
    yPos: number,
    opts: {
      font?: typeof bold;
      size?: number;
      color?: ReturnType<typeof rgb>;
      opacity?: number;
      rotate?: ReturnType<typeof degrees>;
    } = {}
  ) {
    page.drawText(str, {
      x, y: yPos,
      font: opts.font ?? regular,
      size: opts.size ?? 9,
      color: opts.color ?? black,
      opacity: opts.opacity,
      rotate: opts.rotate,
    });
  }

  // ── Logo ──
  let logoWidth = 0;
  if (data.logoDataUrl) {
    try {
      const isJpg = data.logoDataUrl.startsWith('data:image/jpeg') || data.logoDataUrl.startsWith('data:image/jpg');
      const isPng = data.logoDataUrl.startsWith('data:image/png');
      if (isJpg || isPng) {
        const base64 = data.logoDataUrl.split(',')[1];
        const imgBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const img = isJpg ? await doc.embedJpg(imgBytes) : await doc.embedPng(imgBytes);
        const maxH = 45, maxW = 130;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        page.drawImage(img, { x: M, y: height - M - drawH, width: drawW, height: drawH });
        logoWidth = drawW + 14;
      }
    } catch { /* skip logo on embed failure */ }
  }

  // ── Diagonal status watermark ──
  const STAMP_RGB: Record<InvoiceStatus, ReturnType<typeof rgb>> = {
    DRAFT: rgb(0.55, 0.55, 0.55),
    SENT: rgb(0.1, 0.44, 0.83),
    PAID: rgb(0.13, 0.77, 0.37),
    OVERDUE: rgb(0.94, 0.27, 0.27),
  };
  text(data.status, width / 2 - 90, height / 2 - 20, {
    font: bold,
    size: 68,
    color: STAMP_RGB[data.status],
    opacity: 0.07,
    rotate: degrees(35),
  });

  // ── Company name ──
  y -= 10;
  text(data.businessName || 'Your Business', M + logoWidth, y, { font: bold, size: 22 });
  y -= 20;

  if (data.email || data.phone) {
    const contact = [data.email, data.phone].filter(Boolean).join('  ·  ');
    text(contact, M + logoWidth, y, { size: 8, color: grey });
    y -= 14;
  }
  if (data.address) {
    const addrLines = data.address.split('\n').slice(0, 3);
    addrLines.forEach(l => { text(l.trim(), M + logoWidth, y, { size: 8, color: grey }); y -= 12; });
  }

  // ── Separator ──
  y -= 10;
  line(M, y, width - M, y, 1);
  y -= 20;

  // ── INVOICE + number ──
  text('INVOICE', M, y, { font: bold, size: 18 });
  text(`#${data.invoiceNumber}`, width - M - bold.widthOfTextAtSize(`#${data.invoiceNumber}`, 14), y, { font: bold, size: 14 });
  y -= 18;

  // ── Dates ──
  text(`Date: ${data.date || '—'}`, M, y, { size: 9, color: grey });
  text(`Due: ${data.dueDate || '—'}`, M + 160, y, { size: 9, color: grey });
  y -= 24;

  // ── Bill To / From ──
  text('BILL TO', M, y, { font: bold, size: 9, color: grey });
  text('FROM', M + 220, y, { font: bold, size: 9, color: grey });
  y -= 14;

  const clientLines = [data.clientName, data.clientEmail, ...data.clientAddress.split('\n').slice(0, 3)].filter(Boolean);
  const fromLines = [data.businessName, data.email, ...data.address.split('\n').slice(0, 2)].filter(Boolean);
  const maxAddrLines = Math.max(clientLines.length, fromLines.length);
  for (let i = 0; i < maxAddrLines; i++) {
    if (clientLines[i]) text(clientLines[i], M, y, { size: 9 });
    if (fromLines[i]) text(fromLines[i], M + 220, y, { size: 9, color: grey });
    y -= 13;
  }

  y -= 16;
  line(M, y, width - M, y, 1);
  y -= 16;

  // ── Table header ──
  const colX = { desc: M, qty: M + 250, disc: M + 306, price: M + 354, total: M + 430 };
  text('DESCRIPTION', colX.desc, y, { font: bold, size: 8, color: grey });
  text('QTY', colX.qty, y, { font: bold, size: 8, color: grey });
  text('DISC%', colX.disc, y, { font: bold, size: 8, color: grey });
  text('PRICE', colX.price, y, { font: bold, size: 8, color: grey });
  text('TOTAL', colX.total, y, { font: bold, size: 8, color: grey });
  y -= 10;
  line(M, y, width - M, y);
  y -= 14;

  // ── Line items ──
  let subtotal = 0;
  let totalLineDiscounts = 0;

  data.items.forEach(item => {
    let desc = item.description || '—';
    while (desc.length > 38 && regular.widthOfTextAtSize(desc, 9) > 235) {
      desc = desc.slice(0, -1);
    }
    const lineGross = item.quantity * item.unitPrice;
    const lineDisc = lineGross * (item.discount / 100);
    const lineNet = lineGross - lineDisc;
    subtotal += lineGross;
    totalLineDiscounts += lineDisc;

    text(desc, colX.desc, y, { size: 9 });
    text(item.quantity.toString(), colX.qty, y, { size: 9 });
    if (item.discount > 0) text(`${item.discount}%`, colX.disc, y, { size: 9, color: grey });
    text(fmt(item.unitPrice, data.currency), colX.price, y, { size: 9 });
    text(fmt(lineNet, data.currency), colX.total, y, { size: 9, font: bold });
    y -= 18;

    if (y < 200) {
      y = height - M;
      doc.addPage([612, 792]);
    }
  });

  y -= 6;
  line(M, y, width - M, y);
  y -= 18;

  // ── Totals block ──
  const subtotalAfterLine = subtotal - totalLineDiscounts;
  const globalDiscAmt = data.globalDiscountType === 'pct'
    ? subtotalAfterLine * (data.globalDiscount / 100)
    : data.globalDiscount;
  const taxable = subtotalAfterLine - globalDiscAmt;
  const vatAmt = taxable * (data.vatPct / 100);
  const grandTotal = taxable + vatAmt;

  const tLabelX = M + 280;
  const tValueX = colX.total;

  text('Subtotal', tLabelX, y, { size: 9, color: grey });
  text(fmt(subtotal, data.currency), tValueX, y, { size: 9 });
  y -= 15;

  if (totalLineDiscounts > 0) {
    text('Line discounts', tLabelX, y, { size: 9, color: grey });
    text(`- ${fmt(totalLineDiscounts, data.currency)}`, tValueX, y, { size: 9, color: grey });
    y -= 15;
  }

  if (data.globalDiscount > 0) {
    const label = data.globalDiscountType === 'pct' ? `Discount (${data.globalDiscount}%)` : 'Discount (flat)';
    text(label, tLabelX, y, { size: 9, color: grey });
    text(`- ${fmt(globalDiscAmt, data.currency)}`, tValueX, y, { size: 9, color: grey });
    y -= 15;
  }

  if (data.vatPct > 0) {
    text(`VAT (${data.vatPct}%)`, tLabelX, y, { size: 9, color: grey });
    text(fmt(vatAmt, data.currency), tValueX, y, { size: 9 });
    y -= 15;
  }

  line(tLabelX, y + 4, width - M, y + 4);
  y -= 8;
  text('TOTAL', tLabelX, y, { font: bold, size: 11 });
  text(fmt(grandTotal, data.currency), tValueX, y, { font: bold, size: 11 });
  y -= 28;

  // ── Payment Details ──
  const hasPayment = data.mpesaTill || data.mpesaPaybill || data.bankName || data.bankAccount;
  if (hasPayment) {
    line(M, y, width - M, y);
    y -= 16;
    text('PAYMENT DETAILS', M, y, { font: bold, size: 8, color: grey });
    y -= 14;
    if (data.mpesaTill) { text(`M-Pesa Till: ${data.mpesaTill}`, M, y, { size: 8 }); y -= 12; }
    if (data.mpesaPaybill) { text(`M-Pesa Paybill: ${data.mpesaPaybill}`, M, y, { size: 8 }); y -= 12; }
    if (data.bankName) { text(`Bank: ${data.bankName}`, M, y, { size: 8 }); y -= 12; }
    if (data.bankAccount) { text(`Account: ${data.bankAccount}`, M, y, { size: 8 }); y -= 12; }
    y -= 4;
  }

  // ── Notes ──
  if (data.notes.trim()) {
    line(M, y, width - M, y);
    y -= 16;
    text('NOTES', M, y, { font: bold, size: 8, color: grey });
    y -= 14;
    const noteLines = data.notes.split('\n').slice(0, 8);
    noteLines.forEach(l => {
      text(l || '', M, y, { size: 8, color: grey });
      y -= 12;
    });
  }

  const pdfBytes = await doc.save();
  const cleanBuf = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
  const blob = new Blob([cleanBuf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${data.invoiceNumber || '001'}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function InvoiceGeneratorPage() {
  // Section A
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [mpesaTill, setMpesaTill] = useState('');
  const [mpesaPaybill, setMpesaPaybill] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  // Section B
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  // Section C
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState<Currency>('KES');
  const [status, setStatus] = useState<InvoiceStatus>('DRAFT');
  // Section D
  const [items, setItems] = useState<LineItem[]>([{ id: uid(), description: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  const [vatPct, setVatPct] = useState(0);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalDiscountType, setGlobalDiscountType] = useState<DiscountType>('pct');
  // Section E
  const [notes, setNotes] = useState('');
  // UI state
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const counter = parseInt(localStorage.getItem('nx-invoice-counter') ?? '0', 10);
    setInvoiceNumber(`INV-${String(counter + 1).padStart(3, '0')}`);
  }, []);

  // ── Totals ──
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const lineDiscounts = items.reduce((s, it) => s + it.quantity * it.unitPrice * (it.discount / 100), 0);
  const subtotalAfterLine = subtotal - lineDiscounts;
  const globalDiscountAmount = globalDiscountType === 'pct'
    ? subtotalAfterLine * (globalDiscount / 100)
    : globalDiscount;
  const taxable = subtotalAfterLine - globalDiscountAmount;
  const vatAmount = taxable * (vatPct / 100);
  const grandTotal = taxable + vatAmount;

  function handleLogoUpload(file: File) {
    if (file.size > 1024 * 1024) { setError('Logo must be under 1 MB.'); return; }
    const reader = new FileReader();
    reader.onload = e => setLogoDataUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function addItem() {
    setItems(prev => [...prev, { id: uid(), description: '', quantity: 1, unitPrice: 0, discount: 0 }]);
  }

  function removeItem(id: string) {
    if (items.length === 1) return;
    setItems(prev => prev.filter(it => it.id !== id));
  }

  function updateItem(id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: value } : it));
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const counter = parseInt(localStorage.getItem('nx-invoice-counter') ?? '0', 10);
      localStorage.setItem('nx-invoice-counter', String(counter + 1));

      await generateInvoicePDF({
        businessName, email, phone, address,
        logoDataUrl,
        mpesaTill, mpesaPaybill, bankName, bankAccount,
        clientName, clientEmail, clientAddress,
        invoiceNumber, date, dueDate, currency,
        status, items, vatPct, globalDiscount, globalDiscountType, notes,
      });

      setInvoiceNumber(`INV-${String(counter + 2).padStart(3, '0')}`);
    } catch {
      setError('PDF generation failed. Please check your inputs and try again.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <ToolShell
      title="Invoice Generator"
      outline="Generator"
      description="Create and download professional PDF invoices for free."
      cta
    >
      <div className="nxtl-panes nxtl-inv">
        {/* ── Left column ── */}
        <div className="nxtl-stack">

          {/* A: Your Details */}
          <section className="nxtl-panel nx-clay" aria-labelledby="inv-you">
            <h2 id="inv-you" className="nxtl-inv-h2">Your Details</h2>

            {/* Logo */}
            <div>
              <span className="nxtl-label">Business Logo (optional)</span>
              {logoDataUrl ? (
                <div className="nxtl-inv-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoDataUrl}
                    alt="Logo preview"
                    className="nxtl-inv-logo-img"
                  />
                  <button
                    type="button"
                    data-hover
                    onClick={() => { setLogoDataUrl(null); if (logoInputRef.current) logoInputRef.current.value = ''; }}
                    className="nxtl-link-btn nxtl-inv-danger"
                  >
                    <X size={14} aria-hidden="true" /> Remove
                  </button>
                </div>
              ) : (
                <label className="nxtl-drop nxtl-drop--sm nxtl-drop--input">
                  <Upload size={18} aria-hidden="true" className="nxtl-b64-drop-icon" />
                  <span className="nxtl-drop-hint">Upload logo (PNG / JPG, max 1 MB)</span>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="nx-sr-only"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }}
                  />
                </label>
              )}
            </div>

            <div className="nx-field">
              <label htmlFor="inv-business">Business Name</label>
              <input id="inv-business" className="nx-input" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Acme Ltd." />
            </div>
            <div className="nxtl-row">
              <div className="nx-field">
                <label htmlFor="inv-email">Email</label>
                <input id="inv-email" className="nx-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
              </div>
              <div className="nx-field">
                <label htmlFor="inv-phone">Phone</label>
                <input id="inv-phone" className="nx-input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" />
              </div>
            </div>
            <div className="nx-field">
              <label htmlFor="inv-address">Address</label>
              <textarea
                id="inv-address"
                className="nx-input nx-textarea nxtl-inv-area"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 Street, Nairobi"
              />
            </div>

            {/* Payment Details */}
            <div className="nxtl-inv-sub">
              <span className="nxtl-label" style={{ marginBottom: 0 }}>Payment Details (optional)</span>
              <div className="nxtl-row">
                <div className="nx-field">
                  <label htmlFor="inv-till">M-Pesa Till</label>
                  <input id="inv-till" className="nx-input" inputMode="numeric" value={mpesaTill} onChange={e => setMpesaTill(e.target.value)} placeholder="123456" />
                </div>
                <div className="nx-field">
                  <label htmlFor="inv-paybill">M-Pesa Paybill</label>
                  <input id="inv-paybill" className="nx-input" inputMode="numeric" value={mpesaPaybill} onChange={e => setMpesaPaybill(e.target.value)} placeholder="400200" />
                </div>
                <div className="nx-field">
                  <label htmlFor="inv-bank">Bank Name</label>
                  <input id="inv-bank" className="nx-input" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Equity Bank" />
                </div>
                <div className="nx-field">
                  <label htmlFor="inv-account">Bank Account</label>
                  <input id="inv-account" className="nx-input" value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="0123456789" />
                </div>
              </div>
            </div>
          </section>

          {/* B: Client Details */}
          <section className="nxtl-panel nx-clay" aria-labelledby="inv-client">
            <h2 id="inv-client" className="nxtl-inv-h2">Client Details</h2>
            <div className="nx-field">
              <label htmlFor="inv-client-name">Client Name</label>
              <input id="inv-client-name" className="nx-input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Company" />
            </div>
            <div className="nx-field">
              <label htmlFor="inv-client-email">Client Email</label>
              <input id="inv-client-email" className="nx-input" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com" />
            </div>
            <div className="nx-field">
              <label htmlFor="inv-client-address">Client Address</label>
              <textarea
                id="inv-client-address"
                className="nx-input nx-textarea nxtl-inv-area"
                value={clientAddress}
                onChange={e => setClientAddress(e.target.value)}
                placeholder="456 Avenue, Nairobi"
              />
            </div>
          </section>

          {/* C: Invoice Details */}
          <section className="nxtl-panel nx-clay" aria-labelledby="inv-details">
            <h2 id="inv-details" className="nxtl-inv-h2">Invoice Details</h2>
            <div className="nxtl-row">
              <div className="nx-field">
                <label htmlFor="inv-number">Invoice Number</label>
                <input id="inv-number" className="nx-input" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
              </div>
              <div className="nx-field nx-select">
                <label htmlFor="inv-currency">Currency</label>
                <select
                  id="inv-currency"
                  className="nx-input"
                  value={currency}
                  onChange={e => setCurrency(e.target.value as Currency)}
                >
                  {(['KES', 'USD', 'GBP', 'EUR'] as Currency[]).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="nx-field">
                <label htmlFor="inv-date">Date</label>
                <input id="inv-date" type="date" className="nx-input nxtl-inv-date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="nx-field">
                <label htmlFor="inv-due">Due Date</label>
                <input id="inv-due" type="date" className="nx-input nxtl-inv-date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
            </div>

            {/* Status stamp */}
            <div>
              <span className="nxtl-label" id="inv-status-label">Invoice Status</span>
              <div className="nxtl-inv-statuses" role="group" aria-labelledby="inv-status-label">
                {(['DRAFT', 'SENT', 'PAID', 'OVERDUE'] as InvoiceStatus[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    data-hover
                    data-status={s}
                    onClick={() => setStatus(s)}
                    aria-pressed={status === s}
                    className="nxtl-inv-status"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* E: Notes */}
          <section className="nxtl-panel nx-clay" aria-labelledby="inv-notes">
            <h2 id="inv-notes" className="nxtl-inv-h2">Notes</h2>
            <textarea
              aria-labelledby="inv-notes"
              className="nx-input nx-textarea nxtl-inv-area"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Payment terms, thank-you message…"
            />
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="nxtl-stack">

          {/* D: Line Items */}
          <section className="nxtl-panel nx-clay" aria-labelledby="inv-items">
            <h2 id="inv-items" className="nxtl-inv-h2">Line Items</h2>

            <div className="nxtl-inv-items">
              {/* Table header (wide layout only) */}
              <div className="nxtl-inv-item nxtl-inv-head" aria-hidden="true">
                {['Description', 'Qty', 'Disc%', 'Unit Price', 'Total', ''].map(h => (
                  <span key={h} className="nxtl-label" style={{ marginBottom: 0 }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {items.map((item, idx) => (
                <div key={item.id} className="nxtl-inv-item">
                  <label className="nxtl-inv-cell nxtl-inv-cell--desc">
                    <span className="nxtl-inv-cell-label">Description</span>
                    <input
                      className="nx-input"
                      value={item.description}
                      onChange={e => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Service or product"
                      aria-label={`Item ${idx + 1} description`}
                    />
                  </label>
                  <label className="nxtl-inv-cell">
                    <span className="nxtl-inv-cell-label">Qty</span>
                    <input
                      className="nx-input nxtl-inv-num"
                      type="number"
                      min={0}
                      value={item.quantity}
                      onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      aria-label={`Item ${idx + 1} quantity`}
                    />
                  </label>
                  <label className="nxtl-inv-cell">
                    <span className="nxtl-inv-cell-label">Disc%</span>
                    <input
                      className="nx-input nxtl-inv-num"
                      type="number"
                      min={0}
                      max={100}
                      value={item.discount}
                      onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                      aria-label={`Item ${idx + 1} discount percent`}
                    />
                  </label>
                  <label className="nxtl-inv-cell">
                    <span className="nxtl-inv-cell-label">Unit Price</span>
                    <input
                      className="nx-input nxtl-inv-num"
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      aria-label={`Item ${idx + 1} unit price`}
                    />
                  </label>
                  <div className="nxtl-inv-cell nxtl-inv-cell--total">
                    <span className="nxtl-inv-cell-label">Total</span>
                    <div className="nxtl-inv-line-total">
                      {fmt(item.quantity * item.unitPrice * (1 - item.discount / 100), currency)}
                    </div>
                  </div>
                  <button
                    type="button"
                    data-hover
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="nxtl-inv-remove"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              data-hover
              onClick={addItem}
              className="nxtl-inv-add"
            >
              <Plus size={16} aria-hidden="true" /> Add Line Item
            </button>

            {/* VAT & Global Discount */}
            <div className="nxtl-inv-sub nxtl-row">
              <div className="nx-field">
                <label htmlFor="inv-vat">VAT / Tax %</label>
                <input
                  id="inv-vat"
                  className="nx-input nxtl-inv-num"
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={vatPct}
                  onChange={e => setVatPct(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="nx-field">
                <label htmlFor="inv-gdisc">Global Discount</label>
                <div className="nxtl-inv-gdisc">
                  <input
                    id="inv-gdisc"
                    className="nx-input nxtl-inv-num"
                    type="number"
                    min={0}
                    step="0.01"
                    value={globalDiscount}
                    onChange={e => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                  />
                  <button
                    type="button"
                    data-hover
                    onClick={() => setGlobalDiscountType(t => t === 'pct' ? 'flat' : 'pct')}
                    className="nxtl-chip-btn nxtl-inv-dtype"
                    aria-label={`Discount type: ${globalDiscountType === 'pct' ? 'percent' : 'flat amount'}. Switch`}
                  >
                    {globalDiscountType === 'pct' ? '%' : 'flat'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Invoice Summary */}
          <section className="nxtl-panel nx-glass nxtl-inv-summary" aria-labelledby="inv-summary">
            <p id="inv-summary" className="nxtl-label" style={{ marginBottom: 0 }}>Invoice Summary</p>

            <dl className="nxtl-inv-lines" aria-live="polite">
              <div className="nxtl-inv-line">
                <dt>
                  Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
                </dt>
                <dd>
                  {fmt(subtotal, currency)}
                </dd>
              </div>

              {lineDiscounts > 0 && (
                <div className="nxtl-inv-line nxtl-inv-line--muted">
                  <dt>Line discounts</dt>
                  <dd>- {fmt(lineDiscounts, currency)}</dd>
                </div>
              )}

              {globalDiscount > 0 && (
                <div className="nxtl-inv-line nxtl-inv-line--muted">
                  <dt>
                    Discount {globalDiscountType === 'pct' ? `(${globalDiscount}%)` : '(flat)'}
                  </dt>
                  <dd>- {fmt(globalDiscountAmount, currency)}</dd>
                </div>
              )}

              {vatPct > 0 && (
                <div className="nxtl-inv-line nxtl-inv-line--muted">
                  <dt>VAT ({vatPct}%)</dt>
                  <dd>{fmt(vatAmount, currency)}</dd>
                </div>
              )}

              <div className="nxtl-inv-line nxtl-inv-line--total">
                <dt>Total</dt>
                <dd>
                  {fmt(grandTotal, currency)}
                </dd>
              </div>
            </dl>

            {error && <Status tone="error">{error}</Status>}

            <div className="nxtl-actions">
              <ClayButton
                onClick={handleGenerate}
                disabled={generating}
                aria-busy={generating}
              >
                {generating && <Spinner />}
                {generating ? 'Generating PDF…' : 'Generate Invoice PDF'}
              </ClayButton>
            </div>
          </section>
        </div>
      </div>
    </ToolShell>
  );
}
