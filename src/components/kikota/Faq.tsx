import SharedFaq, { type FaqClasses, type FaqItem } from '@/components/product-landing/Faq';

const FAQS: FaqItem[] = [
  {
    q: 'Who is Kikota for?',
    a: 'Gym owners and managers in Kenya, from independent gyms to growing fitness clubs, who want to run everything in one place and give their members more reasons to keep training.',
  },
  {
    q: 'Does Kikota work with M-Pesa?',
    a: "Yes. Kikota sends M-Pesa payment prompts straight to your members' phones for renewals, and payments show up in your dashboard automatically.",
  },
  {
    q: 'Do my members need to download an app?',
    a: 'No. For now, members use Kikota through a simple web link, with no download needed. A dedicated app is planned for later.',
  },
  {
    q: "Is my gym's data shared with other gyms?",
    a: 'Never your private information. Other gyms only see what appears on the network, like gym names and leaderboard scores. Your member lists, payments, and revenue stay private to your gym.',
  },
  {
    q: 'How much does it cost?',
    a: 'Founding gyms use Kikota free during the pilot. Pricing for other gyms will be shared at launch.',
  },
  {
    q: 'When is Kikota launching?',
    a: "Kikota is currently in development. Join the waitlist and we'll let you know as soon as it launches.",
  },
];

// .kk-faq-list is a single column on mobile and a two-column grid from 1024px.
const CLASSES: FaqClasses = {
  list:        'kk-faq-list',
  item:        'kk-faq-item',
  question:    'kk-faq-q',
  chevron:     'kk-faq-chevron',
  answer:      'kk-faq-a',
  answerInner: 'kk-faq-a-inner',
};

export default function Faq() {
  return <SharedFaq items={FAQS} classes={CLASSES} />;
}
