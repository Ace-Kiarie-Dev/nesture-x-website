import SharedFaq, { type FaqClasses, type FaqItem } from '@/components/product-landing/Faq';

const FAQS: FaqItem[] = [
  {
    q: 'Is Matatu Dash free to play?',
    a: 'Yes. Matatu Dash is free to download and play. The game will include ads, and you can unlock new characters and skins by playing.',
  },
  {
    q: 'Which phones will it work on?',
    a: 'Matatu Dash is launching first on Android through Google Play. Device requirements will be shared closer to launch.',
  },
  {
    q: 'When is it launching?',
    a: "Matatu Dash is currently in development. Join the list and we'll let you know as soon as it's on Google Play.",
  },
  {
    q: 'Is it available on iPhone?',
    a: 'Not at launch. Matatu Dash is coming to Android first, and an iPhone version may follow later.',
  },
];

// .md-faq-list is a single column on mobile and a two-column grid from 1024px.
const CLASSES: FaqClasses = {
  list:        'md-faq-list',
  item:        'md-faq-item',
  question:    'md-faq-q',
  chevron:     'md-faq-chevron',
  answer:      'md-faq-a',
  answerInner: 'md-faq-a-inner',
};

export default function Faq() {
  return <SharedFaq items={FAQS} classes={CLASSES} />;
}
