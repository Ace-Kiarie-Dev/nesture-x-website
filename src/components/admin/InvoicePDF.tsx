import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import fs from 'fs';
import path from 'path';
import {
  type Invoice,
  subtotal,
  discountAmount,
  grandTotal,
  fmt,
  fmtDate,
} from '@/types/invoice';

// ── Colors ────────────────────────────────────────────────────────────────────
// Same palette as QuotePDF.tsx so invoices and quotations read as one brand.

const C = {
  navy:       '#0d1b3e',
  blue:       '#1a6fd4',
  blueLight:  '#e8f0fc',
  white:      '#ffffff',
  text:       '#111318',
  muted:      '#555e72',
  border:     '#dde3ef',
  rowAlt:     '#f7f9fd',
  black:      '#0a0a0a',
  green:      '#1e9e5a',
  amber:      '#b8860b',
  red:        '#c23a4b',
};

const PAYMENT_STATUS_COLOR: Record<Invoice['paymentStatus'], string> = {
  unpaid:  C.red,
  partial: C.amber,
  paid:    C.green,
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: C.white,
    fontFamily:      'Helvetica',
    fontSize:        9,
    color:           C.text,
  },

  // ── Header ──
  header: {
    backgroundColor: C.navy,
    padding:         '28 36',
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  logo: {
    width:  280,
    height: 76,
    objectFit: 'contain',
  },
  headerTagline: {
    color:         'rgba(184,206,240,0.7)',
    fontSize:      7,
    letterSpacing: 1.5,
    marginTop:     4,
    textTransform: 'uppercase',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerLabel: {
    color:         C.blue,
    fontSize:      6.5,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom:  4,
  },
  docTitle: {
    color:       C.white,
    fontSize:    28,
    fontFamily:  'Helvetica-Bold',
    letterSpacing: 3,
  },
  docNumber: {
    color:         'rgba(184,206,240,0.8)',
    fontSize:      8,
    letterSpacing: 1,
    marginTop:     4,
  },

  // ── Blue accent bar ──
  accentBar: {
    backgroundColor: C.blue,
    height:          3,
  },

  // ── KRA PIN strip ──
  pinStrip: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    backgroundColor: C.blueLight,
    padding:         '6 36',
  },
  pinText: {
    fontSize: 7.5,
    color:    C.navy,
  },
  pinLabel: {
    fontFamily: 'Helvetica-Bold',
  },

  // ── Client + meta section ──
  infoSection: {
    flexDirection: 'row',
    padding:       '20 36',
    borderBottom:  `1 solid ${C.border}`,
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    width:       180,
    paddingLeft: 24,
  },
  infoLabel: {
    color:         C.blue,
    fontSize:      6.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom:  6,
    fontFamily:    'Helvetica-Bold',
  },
  infoName: {
    fontSize:    12,
    fontFamily:  'Helvetica-Bold',
    color:       C.text,
    marginBottom: 3,
  },
  infoText: {
    fontSize:    8.5,
    color:       C.muted,
    marginBottom: 2,
    lineHeight:  1.5,
  },
  metaRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   5,
    paddingBottom:  5,
    borderBottom:   `1 solid ${C.border}`,
  },
  metaLabel: {
    fontSize:  7.5,
    color:     C.muted,
    width:     70,
  },
  metaValue: {
    fontSize:   8,
    fontFamily: 'Helvetica-Bold',
    color:      C.text,
    textAlign:  'right',
  },

  // ── Table ──
  tableSection: {
    padding: '0 36 20',
  },
  tableHeader: {
    flexDirection:   'row',
    backgroundColor: C.navy,
    padding:         '7 10',
  },
  tableHeaderCell: {
    color:         C.white,
    fontSize:      7,
    fontFamily:    'Helvetica-Bold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding:       '8 10',
    borderBottom:  `1 solid ${C.border}`,
  },
  tableRowAlt: {
    backgroundColor: C.rowAlt,
  },
  tableCell: {
    fontSize:   8.5,
    color:      C.text,
    lineHeight: 1.4,
  },
  tableCellMuted: {
    fontSize: 8.5,
    color:    C.muted,
  },
  colDesc:  { flex: 1 },
  colQty:   { width: 36,  textAlign: 'center' },
  colPrice: { width: 72,  textAlign: 'right'  },
  colTotal: { width: 80,  textAlign: 'right'  },

  // ── Totals ──
  totalsSection: {
    padding:    '0 36 20',
    alignItems: 'flex-end',
  },
  totalsBox: {
    width:       240,
    borderTop:   `2 solid ${C.blue}`,
    paddingTop:  10,
  },
  totalsRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   5,
  },
  totalsLabel: {
    fontSize: 8.5,
    color:    C.muted,
  },
  totalsValue: {
    fontSize: 8.5,
    color:    C.text,
  },
  totalsDivider: {
    borderTop:    `1 solid ${C.border}`,
    marginTop:    4,
    marginBottom: 8,
  },
  grandTotalRow: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    backgroundColor: C.navy,
    padding:         '8 10',
  },
  grandTotalLabel: {
    fontSize:   9,
    fontFamily: 'Helvetica-Bold',
    color:      C.white,
  },
  grandTotalValue: {
    fontSize:   11,
    fontFamily: 'Helvetica-Bold',
    color:      C.blue,
  },
  balanceRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:      8,
  },
  balanceLabel: {
    fontSize:   8.5,
    fontFamily: 'Helvetica-Bold',
    color:      C.text,
  },
  balanceValue: {
    fontSize:   8.5,
    fontFamily: 'Helvetica-Bold',
  },

  // ── eTIMS placeholder ──
  // Reserved layout for future KRA electronic Tax Invoice Management System
  // (eTIMS) fields. Left empty intentionally — no fake values are rendered.
  // Once Nesture-X integrates with KRA's eTIMS API, populate:
  //   - CU Invoice No.      (Control Unit-assigned invoice number)
  //   - Control Unit Serial (the CU device serial number)
  //   - QR code             (KRA-issued verification QR, image/svg)
  etimsSection: {
    margin:       '0 36 20',
    padding:      '10 14',
    border:       `1 dashed ${C.border}`,
    flexDirection: 'row',
    alignItems:   'center',
    justifyContent: 'space-between',
  },
  etimsLeft: {
    flex: 1,
  },
  etimsTitle: {
    fontSize:      6.5,
    fontFamily:    'Helvetica-Bold',
    color:         C.muted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom:  6,
  },
  etimsFieldRow: {
    flexDirection: 'row',
    marginBottom:  3,
  },
  etimsFieldLabel: {
    fontSize: 7.5,
    color:    C.muted,
    width:    110,
  },
  etimsFieldValue: {
    fontSize:     7.5,
    color:        C.border,
    borderBottom: `1 solid ${C.border}`,
    width:        120,
  },
  etimsQrBox: {
    width:        56,
    height:       56,
    border:       `1 dashed ${C.border}`,
    alignItems:   'center',
    justifyContent: 'center',
    marginLeft:   16,
  },
  etimsQrLabel: {
    fontSize:      5.5,
    color:         C.border,
    textAlign:     'center',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  // ── Notes ──
  notesSection: {
    padding:      '0 36 16',
    borderTop:    `1 solid ${C.border}`,
    paddingTop:   16,
  },
  notesSectionTitle: {
    fontSize:      7,
    fontFamily:    'Helvetica-Bold',
    color:         C.blue,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom:  6,
  },
  notesText: {
    fontSize:   8.5,
    color:      C.muted,
    lineHeight: 1.7,
  },

  // ── Footer ──
  footer: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: C.navy,
    padding:         '10 36',
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
  },
  footerText: {
    color:     'rgba(184,206,240,0.65)',
    fontSize:  7,
    lineHeight: 1.6,
  },
  footerBrand: {
    color:         C.blue,
    fontSize:      7.5,
    fontFamily:    'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

// ── Logo (resolved at runtime on server) ─────────────────────────────────────
// Read into a Buffer rather than passing a raw path as `src` — @react-pdf/renderer
// resolves string sources via url.parse(), which misreads a Windows absolute
// path's drive letter (e.g. "D:\...") as a URL protocol and tries to fetch()
// it remotely instead of reading it from disk. A Buffer skips that entirely.

function getLogoSrc(): Buffer | undefined {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo-white.png');
    return fs.readFileSync(logoPath);
  } catch {
    return undefined;
  }
}

const PAYMENT_STATUS_LABEL: Record<Invoice['paymentStatus'], string> = {
  unpaid:  'UNPAID',
  partial: 'PARTIALLY PAID',
  paid:    'PAID',
};

// ── Component ─────────────────────────────────────────────────────────────────

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  const sub         = subtotal(invoice.lines);
  const disc        = discountAmount(sub, invoice.discountType, invoice.discountValue);
  const total       = grandTotal(invoice.lines, invoice.discountType, invoice.discountValue);
  const balanceDue  = total - (invoice.amountPaid || 0);
  const logoSrc     = getLogoSrc();

  return (
    <Document
      title={`Nesture-X Invoice — ${invoice.documentNumber}`}
      author="Nesture-X"
      subject="Invoice"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {logoSrc ? (
              <Image src={logoSrc} style={s.logo} />
            ) : (
              <Text style={{ color: C.white, fontSize: 18, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>
                NESTURE-X
              </Text>
            )}
            <Text style={s.headerTagline}>Creative Technology Agency · Nairobi</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerLabel}>Document</Text>
            <Text style={s.docTitle}>INVOICE</Text>
            <Text style={s.docNumber}>{invoice.documentNumber}</Text>
          </View>
        </View>

        <View style={s.accentBar} />

        {/* ── KRA PIN strip ── */}
        {(invoice.yourKraPin || invoice.buyerKraPin) ? (
          <View style={s.pinStrip}>
            <Text style={s.pinText}>
              <Text style={s.pinLabel}>Your KRA PIN: </Text>{invoice.yourKraPin || '—'}
            </Text>
            <Text style={s.pinText}>
              <Text style={s.pinLabel}>Buyer PIN: </Text>{invoice.buyerKraPin || '—'}
            </Text>
          </View>
        ) : null}

        {/* ── Client info + Invoice meta ── */}
        <View style={s.infoSection}>
          <View style={s.infoLeft}>
            <Text style={s.infoLabel}>Billed To</Text>
            <Text style={s.infoName}>{invoice.clientName || '—'}</Text>
            {invoice.clientCompany ? <Text style={s.infoText}>{invoice.clientCompany}</Text> : null}
            {invoice.clientEmail   ? <Text style={s.infoText}>{invoice.clientEmail}</Text>   : null}
            {invoice.clientPhone   ? <Text style={s.infoText}>{invoice.clientPhone}</Text>   : null}
          </View>
          <View style={s.infoRight}>
            <Text style={s.infoLabel}>Invoice Details</Text>
            {[
              { label: 'Invoice No.', value: invoice.documentNumber },
              { label: 'Issue Date',  value: fmtDate(invoice.issueDate) },
              { label: 'Due Date',    value: fmtDate(invoice.dueDate) },
            ].map(({ label, value }) => (
              <View key={label} style={s.metaRow}>
                <Text style={s.metaLabel}>{label}</Text>
                <Text style={s.metaValue}>{value}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
              <Text style={s.metaLabel}>Status</Text>
              <Text style={[s.metaValue, { color: PAYMENT_STATUS_COLOR[invoice.paymentStatus] }]}>
                {PAYMENT_STATUS_LABEL[invoice.paymentStatus]}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Line items — no VAT: lines sum straight to the grand total ── */}
        <View style={s.tableSection}>
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, s.colDesc]}>Description</Text>
            <Text style={[s.tableHeaderCell, s.colQty]}>Qty</Text>
            <Text style={[s.tableHeaderCell, s.colPrice]}>Unit Price</Text>
            <Text style={[s.tableHeaderCell, s.colTotal]}>Total</Text>
          </View>

          {invoice.lines.map((line, i) => (
            <View key={line.id} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={[s.tableCell, s.colDesc]}>
                {line.description || '—'}
              </Text>
              <Text style={[s.tableCellMuted, s.colQty, { textAlign: 'center' }]}>
                {line.qty}
              </Text>
              <Text style={[s.tableCellMuted, s.colPrice, { textAlign: 'right' }]}>
                {line.unitPrice.toLocaleString('en-KE')}
              </Text>
              <Text style={[s.tableCell, s.colTotal, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                {(line.qty * line.unitPrice).toLocaleString('en-KE')}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Totals ── */}
        <View style={s.totalsSection}>
          <View style={s.totalsBox}>
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Subtotal</Text>
              <Text style={s.totalsValue}>{fmt(sub)}</Text>
            </View>
            {disc > 0 && (
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>
                  Discount{invoice.discountType === 'percent' ? ` (${invoice.discountValue}%)` : ''}
                </Text>
                <Text style={[s.totalsValue, { color: '#e05c6b' }]}>− {fmt(disc)}</Text>
              </View>
            )}
            <View style={s.totalsDivider} />
            <View style={s.grandTotalRow}>
              <Text style={s.grandTotalLabel}>GRAND TOTAL</Text>
              <Text style={s.grandTotalValue}>{fmt(total)}</Text>
            </View>
            {invoice.amountPaid > 0 && (
              <View style={s.totalsRow}>
                <Text style={[s.totalsLabel, { marginTop: 8 }]}>Amount Paid</Text>
                <Text style={[s.totalsValue, { marginTop: 8, color: C.green }]}>{fmt(invoice.amountPaid)}</Text>
              </View>
            )}
            <View style={s.balanceRow}>
              <Text style={s.balanceLabel}>Balance Due</Text>
              <Text style={[s.balanceValue, { color: PAYMENT_STATUS_COLOR[invoice.paymentStatus] }]}>
                {fmt(balanceDue)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── eTIMS placeholder — reserved for future KRA integration ──
            Only rendered when the invoice is marked eTIMS-compliant.
            Intentionally blank: no fake CU Invoice No., Control Unit Serial,
            or QR code until Nesture-X is registered on KRA eTIMS. Layout is
            fixed now so wiring in real values later needs no redesign. */}
        {invoice.etimsCompliant ? (
          <View style={s.etimsSection}>
            <View style={s.etimsLeft}>
              <Text style={s.etimsTitle}>eTIMS (Reserved)</Text>
              <View style={s.etimsFieldRow}>
                <Text style={s.etimsFieldLabel}>CU Invoice No.</Text>
                <Text style={s.etimsFieldValue}> </Text>
              </View>
              <View style={s.etimsFieldRow}>
                <Text style={s.etimsFieldLabel}>Control Unit Serial</Text>
                <Text style={s.etimsFieldValue}> </Text>
              </View>
            </View>
            <View style={s.etimsQrBox}>
              <Text style={s.etimsQrLabel}>QR</Text>
            </View>
          </View>
        ) : null}

        {/* ── Notes ── */}
        {(invoice.notes || invoice.paymentTerms) ? (
          <View style={s.notesSection}>
            {invoice.notes ? (
              <>
                <Text style={s.notesSectionTitle}>Notes</Text>
                <Text style={s.notesText}>{invoice.notes}</Text>
              </>
            ) : null}
            {invoice.paymentTerms ? (
              <View style={{ marginTop: invoice.notes ? 10 : 0 }}>
                <Text style={s.notesSectionTitle}>Payment Terms</Text>
                <Text style={s.notesText}>{invoice.paymentTerms}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <View>
            <Text style={s.footerBrand}>Nesture-X</Text>
            <Text style={s.footerText}>Nairobi, Kenya  ·  +254 717 164 951  ·  nesturex@gmail.com  ·  nesturex.com</Text>
          </View>
          <Text style={s.footerText}>
            Due {fmtDate(invoice.dueDate)}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
