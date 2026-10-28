import type { Metadata } from 'next';
import HeroRibbons from '@/components/redesign/HeroRibbons';
import ContactHero from '@/components/redesign/contact/ContactHero';
import ContactDetails from '@/components/redesign/contact/ContactDetails';
import ContactForm from '@/components/redesign/contact/ContactForm';
import ContactBooking from '@/components/redesign/contact/ContactBooking';
import '@/components/redesign/contact/contact.css';

export const metadata: Metadata = {
  title: 'Contact Us: Web Design Agency in Nairobi',
  description:
    'Get in touch with Nesture-X in Nairobi for websites, apps, M-Pesa integration, branding, and printing. Chat on WhatsApp, email, or send a message.',
  alternates: {
    canonical: '/contact',
  },
};

// Server component: only the form (and the deferred hero ribbons) ship JS.
export default function ContactPage() {
  return (
    <main className="nxct">
      <div className="nxct-hero-wrap nx-hero-ribbons-host">
        <HeroRibbons className="nx-hero-ribbons" />
        <ContactHero />
      </div>
      <div className="nxct-wrap">
        <section className="nxct-sec nxct-main" aria-label="Contact details and form">
          <ContactForm />
          <ContactDetails />
        </section>
        <ContactBooking />
      </div>
    </main>
  );
}
