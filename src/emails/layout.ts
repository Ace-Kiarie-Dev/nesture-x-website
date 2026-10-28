// Shared email kit for every transactional email (hybrid redesign).
//
// Rules this file follows so the emails survive real inboxes:
// - 600px max, table layout, inline styles only. The one <style> block holds the
//   mobile and dark-mode media queries and is safe to strip (Gmail on some apps does).
// - No web fonts, no flexbox/grid, no JS, no SVG, no base64 images. The logo is a
//   2x PNG hosted on the site (public/email/nx-logo.png) with width, height and alt.
// - Every value that came from a visitor goes through esc() before it reaches HTML.
// - Every email ships a plain-text part next to the HTML.
//
// Colours: #0a0a0a page, #0d1b3e card with a 1px #1a6fd4 hairline, #141b2b panels,
// #f5f5f5 body text, #b8cef0 secondary text, #1a6fd4 / #3d8ef0 blue accents. All
// pairs keep their contrast when a client force-inverts the email.

export const SITE_URL = 'https://nesturex.com';
const LOGO = { src: `${SITE_URL}/email/nx-logo.png`, width: 168, height: 44 };

// The hosted logo only exists on production once feat/redesign is released (until
// then the URL is a 404). While false, the header is a pure text wordmark that
// always renders. Flip to true after release to use the PNG, which then falls back
// to a matching styled alt text when images are blocked.
const USE_LOGO_IMAGE = false;

const C = {
  page:   '#0a0a0a',
  card:   '#0d1b3e',
  panel:  '#141b2b',
  line:   '#1a6fd4',
  blue:   '#1a6fd4',
  blueHi: '#3d8ef0',
  text:   '#f5f5f5',
  muted:  '#b8cef0',
  rule:   '#24345c',
};

const FONT_BODY = 'Arial, Helvetica, sans-serif';
const FONT_HEAD = "Impact, 'Arial Narrow Bold', 'Arial Black', Arial, sans-serif";
const FONT_MONO = "'Courier New', Courier, monospace";

export interface EmailParts {
  html: string;
  text: string;
}

// ── Escaping ──────────────────────────────────────────────────────────────────

/** HTML-escapes a visitor-supplied value. */
export function esc(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes, then keeps the visitor's line breaks. */
export function escMultiline(value: string | null | undefined): string {
  return esc(value).replace(/\r?\n/g, '<br />');
}

// ── Links ─────────────────────────────────────────────────────────────────────

export function mailtoHref(address: string, subject?: string): string {
  // Encoded so a crafted address can't add headers; @ stays literal for Outlook.
  const to = encodeURIComponent(address.trim()).replace(/%40/g, '@');
  return subject ? `mailto:${to}?subject=${encodeURIComponent(subject)}` : `mailto:${to}`;
}

/** Digits only, with a leading + kept. Empty when nothing dialable is left. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
  return digits.replace(/\D/g, '').length >= 7 ? `tel:${digits}` : '';
}

/** wa.me link. Kenyan local numbers (07.. / 01..) get the 254 country code. */
export function whatsappHref(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (/^0[17]\d{8}$/.test(digits)) digits = `254${digits.slice(1)}`;
  return digits.length >= 9 ? `https://wa.me/${digits}` : '';
}

export const NX_WHATSAPP = 'https://wa.me/254717164951';

// ── Blocks (each returns an HTML string for the body) ─────────────────────────

/** Uppercase condensed headline with exactly one word in blue. */
export function headline(before: string, blueWord: string, after = ''): string {
  const word = (s: string) => esc(s);
  return `<h1 class="nx-h1" style="margin:0 0 20px 0;font-family:${FONT_HEAD};font-size:40px;line-height:1.05;font-weight:900;letter-spacing:0.5px;text-transform:uppercase;color:${C.text};mso-line-height-rule:exactly;">${word(before)}${before ? ' ' : ''}<span style="color:${C.blueHi};">${word(blueWord)}</span>${after ? ' ' + word(after) : ''}</h1>`;
}

/** Small mono label above a block. */
export function kicker(label: string): string {
  return `<p style="margin:0 0 10px 0;font-family:${FONT_MONO};font-size:12px;line-height:1.4;letter-spacing:2px;text-transform:uppercase;color:${C.blueHi};">${esc(label)}</p>`;
}

/** Body paragraph. Pass already-safe HTML (use esc() on visitor values). */
export function para(html: string, opts: { muted?: boolean; last?: boolean } = {}): string {
  return `<p style="margin:0 0 ${opts.last ? 0 : 16}px 0;font-family:${FONT_BODY};font-size:16px;line-height:1.6;color:${opts.muted ? C.muted : C.text};">${html}</p>`;
}

/** Quoted visitor text (their message or brief), escaped with line breaks kept. */
export function quoteBox(raw: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">
<tr><td style="padding:16px 18px;background-color:${C.panel};border-left:3px solid ${C.blue};font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${C.text};">${escMultiline(raw)}</td></tr>
</table>`;
}

/** Big date / time block in mono for bookings. Values are escaped here. */
export function whenBlock(date: string, time: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;border:1px solid ${C.line};background-color:${C.panel};">
<tr><td style="padding:18px 20px 6px 20px;font-family:${FONT_MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Date</td></tr>
<tr><td class="nx-when" style="padding:0 20px 14px 20px;font-family:${FONT_MONO};font-size:22px;line-height:1.3;font-weight:bold;color:${C.text};">${esc(date)}</td></tr>
<tr><td style="padding:0 20px 6px 20px;font-family:${FONT_MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Time</td></tr>
<tr><td class="nx-when" style="padding:0 20px 18px 20px;font-family:${FONT_MONO};font-size:28px;line-height:1.2;font-weight:bold;color:${C.blueHi};">${esc(time)}</td></tr>
</table>`;
}

export interface Row {
  label: string;
  /** Plain value: escaped here. */
  value?: string;
  /** Pre-built safe HTML instead of value (e.g. a link). */
  html?: string;
  mono?: boolean;
}

/** Label / value table. Labels in mono caps, values in body text. */
export function detailTable(rows: Row[]): string {
  const cells = rows.map((r, i) => {
    const border = i < rows.length - 1 ? `border-bottom:1px solid ${C.rule};` : '';
    const value = r.html ?? esc(r.value ?? '');
    return `<tr>
<td class="nx-label-cell" width="34%" valign="top" style="padding:12px 16px;${border}font-family:${FONT_MONO};font-size:12px;line-height:1.5;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};">${esc(r.label)}</td>
<td valign="top" style="padding:12px 16px;${border}font-family:${r.mono ? FONT_MONO : FONT_BODY};font-size:15px;line-height:1.5;color:${C.text};word-break:break-word;">${value}</td>
</tr>`;
  }).join('\n');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;border:1px solid ${C.line};background-color:${C.panel};">
${cells}
</table>`;
}

/** Inline text link in blue. href and label are escaped here. */
export function link(href: string, label: string): string {
  return `<a href="${esc(href)}" style="color:${C.blueHi};text-decoration:underline;">${esc(label)}</a>`;
}

/**
 * Bulletproof clay button: a table cell with background, radius and padding for
 * every client, plus a VML roundrect for Outlook on Windows. 48px tall.
 */
export function button(href: string, label: string, opts: { secondary?: boolean } = {}): string {
  const h = esc(href);
  const l = esc(label);
  const bg = opts.secondary ? C.panel : C.blue;
  const border = opts.secondary ? C.blue : '#1558ad';
  const width = Math.max(200, Math.min(320, label.length * 10 + 64));
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 20px 0;">
<tr><td align="left">
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${h}" style="height:48px;v-text-anchor:middle;width:${width}px;" arcsize="50%" strokecolor="${border}" strokeweight="1px" fillcolor="${bg}">
<w:anchorlock/>
<center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;letter-spacing:1px;">${l}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td class="nx-btn" bgcolor="${bg}" style="border-radius:999px;background-color:${bg};border:1px solid ${border};border-bottom:3px solid ${border};">
<a href="${h}" target="_blank" style="display:inline-block;padding:14px 28px;min-height:20px;font-family:${FONT_BODY};font-size:15px;line-height:20px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#ffffff;text-decoration:none;border-radius:999px;">${l}</a>
</td>
</tr></table>
<!--<![endif]-->
</td></tr>
</table>`;
}

/** A thin rule between sections. */
export function divider(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 20px 0;"><tr><td style="border-top:1px solid ${C.rule};font-size:0;line-height:0;">&nbsp;</td></tr></table>`;
}

// ── Page shell ────────────────────────────────────────────────────────────────

const SOCIALS = [
  { label: 'Instagram @nesture_x', href: 'https://www.instagram.com/nesture_x' },
  { label: 'TikTok @nesture.x',    href: 'https://www.tiktok.com/@nesture.x' },
  { label: 'X @Nesturex',          href: 'https://x.com/Nesturex' },
  { label: 'YouTube @nesture-x',   href: 'https://www.youtube.com/@nesture-x' },
];

export const FOOTER_EMAIL = 'hello@nesturex.com';

export interface LayoutOptions {
  /** <title> of the document. */
  title: string;
  /** Hidden preview line shown next to the subject in the inbox. */
  preheader: string;
  /** Body HTML built from the blocks above. */
  body: string;
  /** Why the reader got this email, shown small in the footer. */
  reason: string;
}

/**
 * Header wordmark. Text mode: "NESTURE-" off-white, "X" blue, heavy condensed stack,
 * nothing to download, so it can't break. Image mode: the PNG with explicit size,
 * display:block and border:0; its alt text is styled the same way (no background
 * box), so a blocked image still reads as the wordmark.
 */
function brandHeader(): string {
  const type = `font-family:${FONT_HEAD};font-size:30px;line-height:44px;font-weight:900;letter-spacing:1px;text-transform:uppercase;mso-line-height-rule:exactly;`;
  if (!USE_LOGO_IMAGE) {
    return `<a href="${SITE_URL}" target="_blank" style="${type}color:${C.text};text-decoration:none;"><span style="color:${C.text};">NESTURE-</span><span style="color:${C.blue};">X</span></a>`;
  }
  return `<a href="${SITE_URL}" target="_blank" style="text-decoration:none;"><img src="${LOGO.src}" width="${LOGO.width}" height="${LOGO.height}" alt="NESTURE-X" style="display:block;border:0;outline:none;text-decoration:none;width:${LOGO.width}px;height:${LOGO.height}px;${type}color:${C.text};" /></a>`;
}

/** Wraps body blocks in the full email document. */
export function layout({ title, preheader, body, reason }: LayoutOptions): string {
  const socials = SOCIALS.map(s => `<a href="${s.href}" target="_blank" style="color:${C.muted};text-decoration:underline;">${esc(s.label)}</a>`).join('&nbsp;&nbsp;·&nbsp;&nbsp;');
  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${esc(title)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
  :root { color-scheme: light dark; supported-color-schemes: light dark; }
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
  @media only screen and (max-width: 480px) {
    .nx-pad { padding-left: 20px !important; padding-right: 20px !important; }
    .nx-h1 { font-size: 32px !important; }
    .nx-when { font-size: 22px !important; }
    .nx-label-cell { width: 40% !important; }
  }
  /* The design is already dark: keep it as authored in clients that honour this. */
  @media (prefers-color-scheme: dark) {
    .nx-page { background-color: ${C.page} !important; }
    .nx-card { background-color: ${C.card} !important; }
  }
</style>
</head>
<body class="nx-page" style="margin:0;padding:0;background-color:${C.page};">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(preheader)}${'&zwnj;&nbsp;'.repeat(60)}</div>
<table role="presentation" class="nx-page" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background-color:${C.page};">
<tr><td align="center" style="padding:28px 12px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

<tr><td class="nx-pad" style="padding:0 32px 18px 32px;">
${brandHeader()}
</td></tr>

<tr><td class="nx-card" bgcolor="${C.card}" style="background-color:${C.card};border:1px solid ${C.line};border-radius:20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td class="nx-pad" style="padding:36px 32px 24px 32px;">
${body}
</td></tr>
</table>
</td></tr>

<tr><td class="nx-pad" style="padding:24px 32px 8px 32px;font-family:${FONT_BODY};font-size:13px;line-height:1.7;color:${C.muted};">
<p style="margin:0 0 4px 0;font-family:${FONT_MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.text};">Nesture-X &nbsp;·&nbsp; Nairobi, Kenya</p>
<p style="margin:0 0 12px 0;font-family:${FONT_MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.blueHi};">Create. Discover. Explore.</p>
<p style="margin:0 0 12px 0;"><a href="mailto:${FOOTER_EMAIL}" style="color:${C.muted};text-decoration:underline;">${FOOTER_EMAIL}</a>&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${SITE_URL}" target="_blank" style="color:${C.muted};text-decoration:underline;">nesturex.com</a></p>
<p style="margin:0 0 16px 0;">${socials}</p>
<p style="margin:0;font-size:12px;line-height:1.6;color:${C.muted};">${esc(reason)}</p>
</td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

// ── Plain text ────────────────────────────────────────────────────────────────

/** Plain-text part with the same header and footer as the HTML. */
export function textLayout(lines: string[], reason: string): string {
  return [
    'NESTURE-X',
    '',
    ...lines,
    '',
    '--',
    'Nesture-X · Nairobi, Kenya',
    'Create. Discover. Explore.',
    `${FOOTER_EMAIL} · ${SITE_URL}`,
    SOCIALS.map(s => `${s.label}: ${s.href}`).join('\n'),
    '',
    reason,
  ].join('\n');
}

/** Label / value lines for plain text. */
export function textRows(rows: { label: string; value: string }[]): string[] {
  const w = Math.max(...rows.map(r => r.label.length)) + 2;
  return rows.map(r => `${(r.label + ':').padEnd(w)} ${r.value}`);
}
