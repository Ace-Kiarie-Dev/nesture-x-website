import { Resend } from 'resend';
import { buildContactReply } from './contact-reply';
import { buildBookingConfirmation } from './booking-confirmation';
import { buildLaunchSignup } from './launch-signup';
import { FROM, REPLY_TO } from '@/lib/contactEmails';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    from: FROM.customer,
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
    from: FROM.contactReply,
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
  const { html, text } = buildLaunchSignup(params);
  return resend.emails.send({
    from: FROM.customer,
    to: params.to,
    replyTo: REPLY_TO,
    subject: `You're on the list for ${params.productName}`,
    html,
    text,
  });
}
