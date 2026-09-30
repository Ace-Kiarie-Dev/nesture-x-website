import type { Metadata } from 'next';
import BookingClient from './BookingClient';

export const metadata: Metadata = {
  title: 'Book a Consultation',
  description:
    "Book a consultation with Nesture-X to plan your website, app, or brand. Pick a time that suits you and we'll talk through your project.",
  alternates: {
    canonical: '/booking',
  },
};

export default function BookingPage() {
  return <BookingClient />;
}
