import { Resend } from 'resend';
import { renderTemplate } from './render';
import { buildContactReply } from './contact-reply';
import { buildBookingConfirmation } from './booking-confirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

const REPLY_TO = 'nesturex@gmail.com';

export function sendBookingConfirmation(params: {
  to: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  bookingRef: string;
}) {
  const { html, text } = buildBookingConfirmation(params);
  return resend.emails.send({
    from: 'Nesture-X <bookings@nesturex.com>',
    to: params.to,
    replyTo: REPLY_TO,
    subject: 'Your Nesture-X Consultation is Confirmed ✓',
    html,
    text,
  });
}

export function sendContactReply(params: {
  to: string;
  clientName: string;
  message: string;
}) {
  const { html, text } = buildContactReply(params);
  return resend.emails.send({
    from: 'Peter at Nesture-X <inquiries@nesturex.com>',
    to: params.to,
    replyTo: REPLY_TO,
    subject: "Got it — we're looking at your idea 👀",
    html,
    text,
  });
}

export function sendLaunchSignup(params: {
  to: string;
  productName: string;
}) {
  return resend.emails.send({
    from: 'Nesture-X <launch@nesturex.com>',
    to: params.to,
    replyTo: REPLY_TO,
    subject: `You're on the list for ${params.productName}`,
    html: renderTemplate('launch-signup', params),
  });
}
