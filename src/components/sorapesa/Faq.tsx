import SharedFaq, { type FaqClasses, type FaqItem } from '@/components/product-landing/Faq';

// The SoraPesa app policy isn't written yet; link the site-wide policy until it exists.
export const PRIVACY_HREF = '/privacy-policy';

const FAQS: FaqItem[] = [
  {
    q: 'Is SoraPesa a bank or mobile money service?',
    a: "No. SoraPesa is a personal finance app that helps you understand your money. It doesn't hold, send, or lend money.",
  },
  {
    q: 'Does SoraPesa read my SMS messages?',
    a: 'No. SoraPesa never reads your SMS inbox. You choose which M-Pesa statements to import, and only those are used.',
  },
  {
    q: 'Is my financial data safe?',
    a: "You stay in control of what goes into SoraPesa, and you'll be able to delete your data or your account at any time. We'll publish the full SoraPesa privacy policy before launch.",
  },
  {
    q: 'When is SoraPesa launching?',
    a: "SoraPesa is currently in development. Join the waitlist and we'll let you know the moment it's live on Google Play.",
  },
  {
    q: 'Is it free?',
    a: "Pricing details will be shared at launch. Join the waitlist and you'll be the first to know.",
  },
];

const CLASSES: FaqClasses = {
  list:        'sp-faq-list',
  item:        'sp-faq-item',
  question:    'sp-faq-q',
  chevron:     'sp-faq-chevron',
  answer:      'sp-faq-a',
  answerInner: 'sp-faq-a-inner',
};

export default function Faq() {
  return <SharedFaq items={FAQS} classes={CLASSES} />;
}
