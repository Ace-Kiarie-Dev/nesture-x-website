import {
  button, detailTable, esc, headline, layout, link, mailtoHref, para,
  telHref, textLayout, textRows, whatsappHref, whenBlock, type EmailParts,
} from './layout';

// Owner notification for a new consultation booking (api/booking). Same fields as
// the old plain-text version; date and time arrive already formatted.
export function buildBookingOwner(b: {
  name: string; email: string; phone: string; service: string; date: string; time: string;
}): EmailParts {
  const tel = b.phone ? telHref(b.phone) : '';
  const wa = b.phone ? whatsappHref(b.phone) : '';
  const reason = 'Owner copy: someone booked a consultation on nesturex.com.';

  const html = layout({
    title: 'New consultation booking | Nesture-X',
    preheader: `${b.name} booked ${b.date} at ${b.time}.`,
    reason,
    body: [
      headline('New', 'booking.'),
      para(`<strong>${esc(b.name)}</strong> just booked a consultation.`),
      whenBlock(b.date, b.time),
      detailTable([
        { label: 'Name',    value: b.name },
        { label: 'Email',   html: link(mailtoHref(b.email), b.email) },
        { label: 'Phone',   html: tel ? link(tel, b.phone) : esc(b.phone) },
        { label: 'Service', value: b.service },
      ]),
      button(mailtoHref(b.email, 'Your Nesture-X consultation'), `Reply to ${b.name}`),
      (tel || wa) ? para([tel && link(tel, `Call ${b.phone}`), wa && link(wa, 'Open in WhatsApp')].filter(Boolean).join('&nbsp;&nbsp;·&nbsp;&nbsp;'), { muted: true, last: true }) : '',
    ].join('\n'),
  });

  const text = textLayout([
    'NEW BOOKING.',
    '',
    ...textRows([
      { label: 'Name',    value: b.name },
      { label: 'Email',   value: b.email },
      { label: 'Phone',   value: b.phone },
      { label: 'Service', value: b.service },
      { label: 'Date',    value: b.date },
      { label: 'Time',    value: b.time },
    ]),
    ...(wa ? ['', `WhatsApp: ${wa}`] : []),
  ], reason);

  return { html, text };
}
