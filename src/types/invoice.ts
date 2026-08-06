import type { QuoteLine, DiscountType } from './quote';

export type { QuoteLine as InvoiceLine, DiscountType };
export { subtotal, discountAmount, grandTotal, fmt, fmtDate } from './quote';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface Invoice {
  documentNumber: string; // NX-INV-YYYY-NNN, assigned server-side on create
  issueDate:      string; // ISO date string YYYY-MM-DD
  dueDate:        string; // ISO date string YYYY-MM-DD
  // Client
  clientName:    string;
  clientCompany: string;
  clientEmail:   string;
  clientPhone:   string;
  // Items — same shape as Quote, no VAT: lines sum straight to the grand total
  lines:         QuoteLine[];
  // Discount
  discountType:  DiscountType;
  discountValue: number;
  // Extra
  notes:         string;
  paymentTerms:  string;
  // Invoice-only
  paymentStatus: PaymentStatus;
  amountPaid:    number;
  yourKraPin:    string;
  buyerKraPin:   string;
}
