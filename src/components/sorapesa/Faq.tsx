import Link from 'next/link';
import SharedFaq, { type FaqClasses, type FaqItem } from '@/components/product-landing/Faq';

export const PRIVACY_HREF = '/legal/sorapesa/privacy';

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
    a: (
      <>
        You stay in control of what goes into SoraPesa, and you can delete your data or your account
        at any time. Our{' '}
        <Link href={PRIVACY_HREF} className="sp-link">Privacy Policy</Link>
        {' '}explains exactly what we collect and how it&apos;s used.
      </>
    ),
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
