import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us: Creative Technology Agency in Nairobi',
  description:
    'Meet Nesture-X, a Nairobi creative technology agency founded in 2024, combining design and full-stack development to build products that grow businesses.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
