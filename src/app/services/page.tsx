import type { Metadata } from 'next';
import HomeReveal from '@/components/redesign/home/HomeReveal';
import HeroRibbons from '@/components/redesign/HeroRibbons';
import ServicesHero from '@/components/redesign/services/ServicesHero';
import ServicesQuickNav from '@/components/redesign/services/ServicesQuickNav';
import ServiceBlock from '@/components/redesign/services/ServiceBlock';
import ServicesProcess from '@/components/redesign/services/ServicesProcess';
import ServicesPartnership from '@/components/redesign/services/ServicesPartnership';
import ServicesCta from '@/components/redesign/services/ServicesCta';
import { SERVICES } from '@/lib/services-data';
import '@/components/redesign/services/services.css';

export const metadata: Metadata = {
  title: 'Web, App, Design & M-Pesa Services in Kenya',
  description:
    'Websites, web apps, mobile apps, M-Pesa integration, logo and brand design, large-format printing, and digital marketing for Kenyan businesses.',
  alternates: {
    canonical: '/services',
  },
};

// Server component: only the scroll reveal, the quick nav's active-chip observer and the
// deferred hero ribbons ship JS.
export default function ServicesPage() {
  return (
    <main className="nxsv">
      <HomeReveal root=".nxsv" item=".nxsv-reveal" readyClass="nxsv-reveal-ready" />
      <div className="nxsv-hero-wrap nx-hero-ribbons-host">
        <HeroRibbons className="nx-hero-ribbons" />
        <ServicesHero />
      </div>
      <div className="nxsv-wrap">
        {/* The quick nav sticks only while the six blocks scroll by. */}
        <div className="nxsv-services">
          <ServicesQuickNav />
          {SERVICES.map((service, i) => (
            <ServiceBlock key={service.id} service={service} index={i} />
          ))}
        </div>
        <ServicesProcess />
        <ServicesPartnership />
        <ServicesCta />
      </div>
    </main>
  );
}
