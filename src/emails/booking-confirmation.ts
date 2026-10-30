import { button, detailTable, esc, headline, kicker, layout, NX_WHATSAPP, para, textLayout, textRows, whenBlock, type EmailParts } from './layout';

// Confirmation to someone who booked a consultation (sendBookingConfirmation).
// date and time arrive already formatted (formatDateLabel / formatSlotLabel);
// the booking code has no time zone label, so none is shown.
export function buildBookingConfirmation(p: {
  clientName: string;
  service: string;
  date: string;
  time: string;
  bookingRef: string;
}): EmailParts {
  const reason = 'You got this because you booked a consultation on nesturex.com.';

  const html = layout({
    title: 'Booking confirmed | Nesture-X',
    preheader: `You're booked for ${p.date} at ${p.time}. Here's everything you need.`,
    reason,
    body: [
      headline("You're", 'booked.'),
      para(`Hey ${esc(p.clientName)},`),
      para('Your Nesture-X consultation booking is confirmed. Here are the details.'),
      whenBlock(p.date, p.time),
      detailTable([
        { label: 'Service',   value: p.service },
        { label: 'Reference', value: p.bookingRef, mono: true },
      ]),
      kicker('What happens next'),
      para("We'll be ready for you at that time. Bring your idea, your questions, anything you want to show us."),
      para('If anything comes up and you need to reschedule, just reach us on WhatsApp.', { muted: true }),
      button(NX_WHATSAPP, 'Message us on WhatsApp'),
      para('Peter Kiarie<br /><span style="color:#b8cef0;">Founder, Nesture-X</span>', { last: true }),
    ].join('\n'),
  });

  const text = textLayout([
    "YOU'RE BOOKED.",
    '',
    `Hey ${p.clientName},`,
    '',
    'Your Nesture-X consultation booking is confirmed. Here are the details.',
    '',
    ...textRows([
      { label: 'Date',      value: p.date },
      { label: 'Time',      value: p.time },
      { label: 'Service',   value: p.service },
      { label: 'Reference', value: p.bookingRef },
    ]),
    '',
    'WHAT HAPPENS NEXT',
    "We'll be ready for you at that time. Bring your idea, your questions, anything you want to show us.",
    '',
    `If anything comes up and you need to reschedule, just reach us on WhatsApp: ${NX_WHATSAPP}`,
    '',
    'Peter Kiarie',
    'Founder, Nesture-X',
  ], reason);

  return { html, text };
}
