import {
  button, detailTable, divider, esc, headline, kicker, layout, link, mailtoHref, para, quoteBox,
  telHref, textLayout, textRows, whatsappHref, type EmailParts,
} from './layout';

// Owner notification for a contact-form lead (api/contact). Same fields and the same
// "Not provided" / "Not specified" fallbacks as the old plain-text version.
export function buildContactOwner(data: {
  name: string; email: string; phone: string;
  service: string; brief: string; budget: string; timeline: string;
}): EmailParts {
  const phone = data.phone || '';
  const tel = phone ? telHref(phone) : '';
  const wa = phone ? whatsappHref(phone) : '';
  const reason = 'Owner copy: someone filled in the contact form on nesturex.com.';

  const html = layout({
    title: 'New project inquiry | Nesture-X',
    preheader: `${data.name} sent a brief${data.service ? ` about ${data.service}` : ''}. Reply straight from this email.`,
    reason,
    body: [
      headline('New', 'inquiry.'),
      para(`<strong>${esc(data.name)}</strong> just sent a project brief through the site.`),
      detailTable([
        { label: 'Name',     value: data.name },
        { label: 'Email',    html: link(mailtoHref(data.email), data.email) },
        { label: 'Phone',    html: phone ? (tel ? link(tel, phone) : esc(phone)) : 'Not provided' },
        { label: 'Service',  value: data.service || 'Not specified' },
        { label: 'Budget',   value: data.budget || 'Not specified' },
        { label: 'Timeline', value: data.timeline || 'Not specified' },
      ]),
      kicker("What they're building"),
      quoteBox(data.brief),
      button(mailtoHref(data.email, 'Your Nesture-X inquiry'), `Reply to ${data.name}`),
      (tel || wa) ? para([tel && link(tel, `Call ${phone}`), wa && link(wa, 'Open in WhatsApp')].filter(Boolean).join('&nbsp;&nbsp;·&nbsp;&nbsp;'), { muted: true }) : '',
      divider(),
      para(`Or just hit reply: this email's reply-to is ${esc(data.name)}.`, { muted: true, last: true }),
    ].join('\n'),
  });

  const text = textLayout([
    'NEW INQUIRY.',
    '',
    ...textRows([
      { label: 'Name',     value: data.name },
      { label: 'Email',    value: data.email },
      { label: 'Phone',    value: data.phone || 'Not provided' },
      { label: 'Service',  value: data.service || 'Not specified' },
      { label: 'Budget',   value: data.budget || 'Not specified' },
      { label: 'Timeline', value: data.timeline || 'Not specified' },
    ]),
    '',
    "WHAT THEY'RE BUILDING",
    data.brief,
    '',
    ...(wa ? [`WhatsApp: ${wa}`, ''] : []),
    `Reply directly to this email to respond to ${data.name}.`,
  ], reason);

  return { html, text };
}
