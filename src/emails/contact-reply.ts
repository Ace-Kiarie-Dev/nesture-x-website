import { button, headline, kicker, layout, NX_WHATSAPP, para, quoteBox, esc, textLayout, type EmailParts } from './layout';

// Auto-reply to someone who sent the contact form (sendContactReply).
export function buildContactReply(p: { clientName: string; message: string }): EmailParts {
  const reason = 'You got this because you sent us a message through nesturex.com.';

  const html = layout({
    title: "We've got your message | Nesture-X",
    preheader: 'Thanks for reaching out. Your idea is with Peter now.',
    reason,
    body: [
      headline('We got your', 'message.'),
      para(`Hey ${esc(p.clientName)},`),
      para("We've received your message. Really appreciate you taking the time to share what you're building."),
      kicker('What you sent'),
      quoteBox(p.message),
      kicker('What happens next'),
      para("I'll personally take a look and get back to you shortly. If it's something we can help with, we'll map out the next steps together."),
      para('Want to move faster? Hit reply, or catch us on WhatsApp.', { muted: true }),
      button(NX_WHATSAPP, 'Chat on WhatsApp'),
      para('Peter<br /><span style="color:#b8cef0;">Founder, Nesture-X</span>', { last: true }),
    ].join('\n'),
  });

  const text = textLayout([
    'WE GOT YOUR MESSAGE.',
    '',
    `Hey ${p.clientName},`,
    '',
    "We've received your message. Really appreciate you taking the time to share what you're building.",
    '',
    'WHAT YOU SENT',
    p.message,
    '',
    'WHAT HAPPENS NEXT',
    "I'll personally take a look and get back to you shortly. If it's something we can help with, we'll map out the next steps together.",
    '',
    `Want to move faster? Hit reply, or catch us on WhatsApp: ${NX_WHATSAPP}`,
    '',
    'Peter',
    'Founder, Nesture-X',
  ], reason);

  return { html, text };
}
