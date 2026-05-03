import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import path from 'path';
import {
  type Quote,
  subtotal,
  discountAmount,
  grandTotal,
  fmt,
  fmtDate,
} from '@/types/quote';

// ── Colors ────────────────────────────────────────────────────────────────────

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
    width:  140,
    height: 38,
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
  quoteTitle: {
    color:       C.white,
    fontSize:    28,
    fontFamily:  'Helvetica-Bold',
    letterSpacing: 3,
  },
  quoteNumber: {
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
    width:     60,
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

// ── Logo path (resolved at runtime on server) ────────────────────────────────

function getLogoPath(): string {
  try {
    return path.join(process.cwd(), 'public', 'images', 'logo-white.png');
  } catch {
    return '';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function QuotePDF({ quote }: { quote: Quote }) {
  const sub      = subtotal(quote.lines);
  const disc     = discountAmount(sub, quote.discountType, quote.discountValue);
  const total    = grandTotal(quote.lines, quote.discountType, quote.discountValue);
  const logoPath = getLogoPath();

  return (
    <Document
      title={`Nesture-X Quotation — ${quote.quoteNumber}`}
      author="Nesture-X"
      subject="Project Quotation"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {logoPath ? (
              <Image src={logoPath} style={s.logo} />
            ) : (
              <Text style={{ color: C.white, fontSize: 18, fontFamily: 'Helvetica-Bold', letterSpacing: 2 }}>
                NESTURE-X
              </Text>
            )}
            <Text style={s.headerTagline}>Creative Technology Agency · Nairobi</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerLabel}>Document</Text>
            <Text style={s.quoteTitle}>QUOTATION</Text>
            <Text style={s.quoteNumber}>{quote.quoteNumber}</Text>
          </View>
        </View>

        <View style={s.accentBar} />

        {/* ── Client info + Quote meta ── */}
        <View style={s.infoSection}>
          <View style={s.infoLeft}>
            <Text style={s.infoLabel}>Prepared For</Text>
            <Text style={s.infoName}>{quote.clientName || '—'}</Text>
            {quote.clientCompany ? <Text style={s.infoText}>{quote.clientCompany}</Text> : null}
            {quote.clientEmail   ? <Text style={s.infoText}>{quote.clientEmail}</Text>   : null}
            {quote.clientPhone   ? <Text style={s.infoText}>{quote.clientPhone}</Text>   : null}
          </View>
          <View style={s.infoRight}>
            <Text style={s.infoLabel}>Quote Details</Text>
            {[
              { label: 'Quote No.',  value: quote.quoteNumber },
              { label: 'Date',       value: fmtDate(quote.date) },
              { label: 'Valid Until',value: fmtDate(quote.expiryDate) },
            ].map(({ label, value }) => (
              <View key={label} style={s.metaRow}>
                <Text style={s.metaLabel}>{label}</Text>
                <Text style={s.metaValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Line items ── */}
        <View style={s.tableSection}>
          {/* Header row */}
          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderCell, s.colDesc]}>Description</Text>
            <Text style={[s.tableHeaderCell, s.colQty]}>Qty</Text>
            <Text style={[s.tableHeaderCell, s.colPrice]}>Unit Price</Text>
            <Text style={[s.tableHeaderCell, s.colTotal]}>Total</Text>
          </View>

          {/* Data rows */}
          {quote.lines.map((line, i) => (
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
                  Discount{quote.discountType === 'percent' ? ` (${quote.discountValue}%)` : ''}
                </Text>
                <Text style={[s.totalsValue, { color: '#e05c6b' }]}>− {fmt(disc)}</Text>
              </View>
            )}
            <View style={s.totalsDivider} />
            <View style={s.grandTotalRow}>
              <Text style={s.grandTotalLabel}>TOTAL DUE</Text>
              <Text style={s.grandTotalValue}>{fmt(total)}</Text>
            </View>
          </View>
        </View>

        {/* ── Notes ── */}
        {(quote.notes || quote.paymentTerms) ? (
          <View style={s.notesSection}>
            {quote.notes ? (
              <>
                <Text style={s.notesSectionTitle}>Notes</Text>
                <Text style={s.notesText}>{quote.notes}</Text>
              </>
            ) : null}
            {quote.paymentTerms ? (
              <View style={{ marginTop: quote.notes ? 10 : 0 }}>
                <Text style={s.notesSectionTitle}>Payment Terms</Text>
                <Text style={s.notesText}>{quote.paymentTerms}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <View>
            <Text style={s.footerBrand}>Nesture-X</Text>
            <Text style={s.footerText}>Nairobi, Kenya  ·  +254 717 164 951  ·  Nesture-x@gmail.com</Text>
          </View>
          <Text style={s.footerText}>
            This quotation is valid until {fmtDate(quote.expiryDate)}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
