'use client';

import { useState, useEffect, useRef } from 'react';
import BackLink from '@/components/tools/BackLink';
import ToolCTA from '@/components/tools/ToolCTA';
import NxButton from '@/components/ui/NxButton';
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

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: 'rgba(245,245,245,0.4)',
  SENT: 'rgba(26,111,212,1)',
  PAID: 'rgba(34,197,94,1)',
  OVERDUE: 'rgba(239,68,68,1)',
};

const STATUS_BG: Record<InvoiceStatus, string> = {
  DRAFT: 'rgba(245,245,245,0.07)',
  SENT: 'rgba(26,111,212,0.14)',
  PAID: 'rgba(34,197,94,0.12)',
  OVERDUE: 'rgba(239,68,68,0.12)',
};

function fmt(n: number, cur: Currency) {
  return `${CURRENCY_SYMBOLS[cur]}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function uid() {
  return Math.random().toString(36).slice(2);
}

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
  marginBottom: '0.4rem',
};

const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'rgba(10, 10, 10, 0.6)',
  border: '1px solid rgba(255,255,255,0.12)',
  padding: '0.6rem 0.9rem',
  fontFamily: 'var(--font-body)',
  fontSize: '0.88rem',
  color: 'var(--color-text)',
  outline: 'none',
};

const SECTION_TITLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
  color: 'var(--color-text)',
  marginBottom: '1.25rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid rgba(26,111,212,0.12)',
};

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

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--color-primary)';
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.12)';
  };

  return (
    <main
      style={{
        padding: 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem) clamp(4rem, 6vw, 6rem)',
        background: 'var(--color-bg)',
      }}
    >
      <BackLink />

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 8vw, 8rem)',
          lineHeight: 0.9,
          color: 'var(--color-text)',
          marginBottom: '0.75rem',
        }}
      >
        INVOICE GENERATOR
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
          color: 'rgba(245,245,245,0.5)',
          marginBottom: '2.5rem',
          maxWidth: '40rem',
        }}
      >
        Create and download professional PDF invoices for free.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1100px',
          alignItems: 'start',
        }}
      >
        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* A: Your Details */}
          <div style={GLASS}>
            <h2 style={SECTION_TITLE}>Your Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

              {/* Logo */}
              <div>
                <label style={LABEL}>Business Logo (optional)</label>
                {logoDataUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoDataUrl}
                      alt="Logo preview"
                      style={{ height: '48px', maxWidth: '140px', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.1)', padding: '4px', background: 'rgba(255,255,255,0.04)' }}
                    />
                    <button
                      data-hover
                      onClick={() => { setLogoDataUrl(null); if (logoInputRef.current) logoInputRef.current.value = ''; }}
                      style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.35)', padding: '0.3rem 0.7rem', fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(239,68,68,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <X size={12} /> Remove
                    </button>
                  </div>
                ) : (
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      border: '1px dashed rgba(255,255,255,0.2)',
                      padding: '0.65rem 1rem',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.82rem',
                      color: 'rgba(245,245,245,0.45)',
                    }}
                  >
                    <Upload size={14} />
                    Upload logo (PNG / JPG, max 1 MB)
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }}
                    />
                  </label>
                )}
              </div>

              <div>
                <label style={LABEL}>Business Name</label>
                <input style={INPUT} value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Acme Ltd." onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={LABEL}>Email</label>
                  <input style={INPUT} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" onFocus={focusBorder} onBlur={blurBorder} />
                </div>
                <div>
                  <label style={LABEL}>Phone</label>
                  <input style={INPUT} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254 700 000 000" onFocus={focusBorder} onBlur={blurBorder} />
                </div>
              </div>
              <div>
                <label style={LABEL}>Address</label>
                <textarea
                  style={{ ...INPUT, resize: 'vertical', minHeight: '70px' }}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="123 Street, Nairobi"
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>

              {/* Payment Details */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ ...LABEL, marginBottom: 0 }}>Payment Details (optional)</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={LABEL}>M-Pesa Till</label>
                    <input style={INPUT} value={mpesaTill} onChange={e => setMpesaTill(e.target.value)} placeholder="123456" onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                  <div>
                    <label style={LABEL}>M-Pesa Paybill</label>
                    <input style={INPUT} value={mpesaPaybill} onChange={e => setMpesaPaybill(e.target.value)} placeholder="400200" onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                  <div>
                    <label style={LABEL}>Bank Name</label>
                    <input style={INPUT} value={bankName} onChange={e => setBankName(e.target.value)} placeholder="Equity Bank" onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                  <div>
                    <label style={LABEL}>Bank Account</label>
                    <input style={INPUT} value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="0123456789" onFocus={focusBorder} onBlur={blurBorder} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* B: Client Details */}
          <div style={GLASS}>
            <h2 style={SECTION_TITLE}>Client Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={LABEL}>Client Name</label>
                <input style={INPUT} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Company" onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div>
                <label style={LABEL}>Client Email</label>
                <input style={INPUT} type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@email.com" onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div>
                <label style={LABEL}>Client Address</label>
                <textarea
                  style={{ ...INPUT, resize: 'vertical', minHeight: '70px' }}
                  value={clientAddress}
                  onChange={e => setClientAddress(e.target.value)}
                  placeholder="456 Avenue, Nairobi"
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
            </div>
          </div>

          {/* C: Invoice Details */}
          <div style={GLASS}>
            <h2 style={SECTION_TITLE}>Invoice Details</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={LABEL}>Invoice Number</label>
                <input style={INPUT} value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div>
                <label style={LABEL}>Currency</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as Currency)}
                  style={{ ...INPUT, cursor: 'pointer' }}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                >
                  {(['KES', 'USD', 'GBP', 'EUR'] as Currency[]).map(c => (
                    <option key={c} value={c} style={{ background: '#141920' }}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LABEL}>Date</label>
                <input type="date" style={{ ...INPUT, colorScheme: 'dark' }} value={date} onChange={e => setDate(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div>
                <label style={LABEL}>Due Date</label>
                <input type="date" style={{ ...INPUT, colorScheme: 'dark' }} value={dueDate} onChange={e => setDueDate(e.target.value)} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
            </div>

            {/* Status stamp */}
            <div style={{ marginTop: '0.9rem' }}>
              <label style={LABEL}>Invoice Status</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(['DRAFT', 'SENT', 'PAID', 'OVERDUE'] as InvoiceStatus[]).map(s => (
                  <button
                    key={s}
                    data-hover
                    onClick={() => setStatus(s)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.1em',
                      background: status === s ? STATUS_BG[s] : 'transparent',
                      border: `1px solid ${status === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.15)'}`,
                      color: status === s ? STATUS_COLORS[s] : 'rgba(245,245,245,0.38)',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* E: Notes */}
          <div style={GLASS}>
            <h2 style={SECTION_TITLE}>Notes</h2>
            <textarea
              style={{ ...INPUT, resize: 'vertical', minHeight: '80px' }}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Payment terms, thank-you message…"
              onFocus={focusBorder}
              onBlur={blurBorder}
            />
          </div>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* D: Line Items */}
          <div style={GLASS}>
            <h2 style={SECTION_TITLE}>Line Items</h2>

            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 52px 52px 82px 80px 36px',
                gap: '0.4rem',
                marginBottom: '0.5rem',
              }}
            >
              {['Description', 'Qty', 'Disc%', 'Unit Price', 'Total', ''].map(h => (
                <span key={h} style={{ ...LABEL, marginBottom: 0 }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {items.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 52px 52px 82px 80px 36px',
                    gap: '0.4rem',
                    alignItems: 'center',
                  }}
                >
                  <input
                    style={INPUT}
                    value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Service or product"
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  <input
                    style={{ ...INPUT, textAlign: 'right' }}
                    type="number"
                    min={0}
                    value={item.quantity}
                    onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  <input
                    style={{ ...INPUT, textAlign: 'right' }}
                    type="number"
                    min={0}
                    max={100}
                    value={item.discount}
                    onChange={e => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  <input
                    style={{ ...INPUT, textAlign: 'right' }}
                    type="number"
                    min={0}
                    step="0.01"
                    value={item.unitPrice}
                    onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  <div
                    style={{
                      padding: '0.6rem 0.4rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'rgba(245,245,245,0.45)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(10,10,10,0.3)',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {fmt(item.quantity * item.unitPrice * (1 - item.discount / 100), currency)}
                  </div>
                  <button
                    data-hover
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                      color: items.length === 1 ? 'rgba(245,245,245,0.15)' : 'rgba(239,68,68,0.7)',
                      flexShrink: 0,
                    }}
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              data-hover
              onClick={addItem}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'transparent',
                border: '1px dashed rgba(26,111,212,0.35)',
                padding: '0.5rem 1rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'center',
                transition: 'border-color 150ms ease',
                marginBottom: '1rem',
              }}
            >
              <Plus size={14} /> Add Line Item
            </button>

            {/* VAT & Global Discount */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '0.9rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={LABEL}>VAT / Tax %</label>
                <input
                  style={{ ...INPUT, textAlign: 'right' }}
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={vatPct}
                  onChange={e => setVatPct(parseFloat(e.target.value) || 0)}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
              </div>
              <div>
                <label style={LABEL}>Global Discount</label>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    style={{ ...INPUT, textAlign: 'right' }}
                    type="number"
                    min={0}
                    step="0.01"
                    value={globalDiscount}
                    onChange={e => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  <button
                    data-hover
                    onClick={() => setGlobalDiscountType(t => t === 'pct' ? 'flat' : 'pct')}
                    style={{
                      padding: '0.6rem 0.75rem',
                      background: 'rgba(26,111,212,0.1)',
                      border: '1px solid rgba(26,111,212,0.3)',
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {globalDiscountType === 'pct' ? '%' : 'flat'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div style={{ ...GLASS, border: '1px solid rgba(26,111,212,0.2)' }}>
            <p style={{ ...LABEL, marginBottom: '1rem' }}>Invoice Summary</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.5)' }}>
                  Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.5)' }}>
                  {fmt(subtotal, currency)}
                </span>
              </div>

              {lineDiscounts > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.38)' }}>Line discounts</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.38)' }}>- {fmt(lineDiscounts, currency)}</span>
                </div>
              )}

              {globalDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.38)' }}>
                    Discount {globalDiscountType === 'pct' ? `(${globalDiscount}%)` : '(flat)'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.38)' }}>- {fmt(globalDiscountAmount, currency)}</span>
                </div>
              )}

              {vatPct > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.38)' }}>VAT ({vatPct}%)</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'rgba(245,245,245,0.38)' }}>{fmt(vatAmount, currency)}</span>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(26,111,212,0.15)',
                  paddingTop: '0.75rem',
                  marginTop: '0.25rem',
                }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {fmt(grandTotal, currency)}
                </span>
              </div>
            </div>

            {error && (
              <div style={{ border: '1px solid rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.07)', padding: '0.75rem 0.9rem', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgb(239,68,68)' }}>{error}</p>
              </div>
            )}

            <NxButton
              variant="primary"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Generating PDF…' : 'Generate Invoice PDF'}
            </NxButton>
          </div>
        </div>
      </div>

      <ToolCTA />
    </main>
  );
}
