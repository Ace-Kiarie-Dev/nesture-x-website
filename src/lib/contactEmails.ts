// Every email address the site uses, in one place. Pages, legal copy, structured data
// and the Resend senders all import from here; nothing else hardcodes an address.

/** Public general contact: contact page, homepage, footer, structured data. */
export const HELLO = 'hello@nesturex.com';

/** Peter, for founder pages. Not shown anywhere yet. */
export const PETER = 'peterkiarie@nesturex.com';

/** Privacy policies and data requests (access, correction, deletion). */
export const PRIVACY = 'privacy@nesturex.com';

/** App support: BetLedger, Solo Standoff and future apps. */
export const SUPPORT = 'support@nesturex.com';

/** Where owner notifications (new enquiries, new bookings) are delivered. */
export const OWNER_INBOX = 'nesturex@gmail.com';

// Resend senders. Customer emails come from and reply to HELLO. Owner
// notifications keep their own senders so existing inbox filters still match.
export const FROM = {
  customer:     `Nesture-X <${HELLO}>`,
  contactReply: `Peter at Nesture-X <${HELLO}>`,
  ownerInquiry: 'Nesture-X Inquiries <inquiries@nesturex.com>',
  ownerBooking: 'Nesture-X Bookings <bookings@nesturex.com>',
} as const;

/** Reply-to on customer emails. */
export const REPLY_TO = HELLO;
