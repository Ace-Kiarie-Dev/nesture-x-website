import Ticker from '@/components/redesign/Ticker';

// Infinite ticker between the hero and the first section (shared Ticker, hybrid.css).
const ITEMS = [
  'Web Development',
  'Brand Identity',
  'M-Pesa Integration',
  'Digital Marketing',
  'Full-Stack Applications',
  'Graphic Design',
  'Nairobi Made',
  'World Class',
];

export default function HomeMarquee() {
  return <Ticker items={ITEMS} />;
}
