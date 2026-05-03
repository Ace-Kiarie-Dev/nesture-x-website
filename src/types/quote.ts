export interface QuoteLine {
  id:          string;
  description: string;
  qty:         number;
  unitPrice:   number;
}

export type DiscountType = 'percent' | 'flat';

export interface Quote {
  quoteNumber:  string;
  date:         string;   // ISO date string YYYY-MM-DD
  expiryDate:   string;   // ISO date string YYYY-MM-DD
  // Client
  clientName:    string;
  clientCompany: string;
  clientEmail:   string;
  clientPhone:   string;
  // Items
  lines:         QuoteLine[];
  // Discount
  discountType:  DiscountType;
  discountValue: number;
  // Extra
  notes:         string;
  paymentTerms:  string;
}

// ── Computed helpers ──────────────────────────────────────────────────────────

export function subtotal(lines: QuoteLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
}

export function discountAmount(sub: number, type: DiscountType, value: number): number {
  if (!value) return 0;
  return type === 'percent' ? (sub * value) / 100 : value;
}

export function grandTotal(lines: QuoteLine[], type: DiscountType, value: number): number {
  const sub = subtotal(lines);
  return sub - discountAmount(sub, type, value);
}

export function fmt(n: number): string {
  return `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
}

export function fmtDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  });
}
