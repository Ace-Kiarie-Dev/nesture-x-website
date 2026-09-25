import Link from 'next/link';
import SharedFaq, { type FaqClasses, type FaqItem } from '@/components/product-landing/Faq';

const PRIVACY_HREF = '/legal/betledger/privacy';

const FAQS: FaqItem[] = [
  {
    q: 'Is BetLedger a betting app?',
    a: "No. BetLedger is a tracking tool. You record bets you've placed elsewhere so you can see your real results. We don't take bets or handle money.",
  },
  {
    q: 'Who is BetLedger for?',
    a: 'Anyone aged 18 or over who wants an honest record of their sports betting and a clear view of where their money goes.',
  },
  {
    q: 'Is it free?',
    a: "Pricing details will be shared at launch. Join the waitlist and you'll be the first to know.",
  },
  {
    q: 'When is it launching?',
    a: "BetLedger is currently in testing. Join the waitlist and we'll let you know the moment it's live on Google Play.",
  },
  {
    q: 'Is my data private?',
    a: (
      <>
        Your bet records are yours. Our{' '}
        <Link href={PRIVACY_HREF} className="bl-link">Privacy Policy</Link>
        {' '}explains exactly what we collect and how it&apos;s used.
      </>
    ),
  },
];

const CLASSES: FaqClasses = {
  list:        'bl-faq-list',
  item:        'bl-faq-item bl-glass bl-lift',
  question:    'bl-faq-q',
  chevron:     'bl-faq-chevron',
  answer:      'bl-faq-a',
  answerInner: 'bl-faq-a-inner',
};

export default function Faq() {
  return <SharedFaq items={FAQS} classes={CLASSES} />;
}
