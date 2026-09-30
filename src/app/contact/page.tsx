import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us: Web Design Agency in Nairobi',
  description:
    'Get in touch with Nesture-X in Nairobi for websites, apps, M-Pesa integration, branding, and printing. Chat on WhatsApp, email, or send a message.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
