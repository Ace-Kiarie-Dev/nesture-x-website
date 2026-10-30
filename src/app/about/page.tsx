import type { Metadata } from 'next';
import HomeReveal from '@/components/redesign/home/HomeReveal';
import HeroRibbons from '@/components/redesign/HeroRibbons';
import AboutHero from '@/components/redesign/about/AboutHero';
import AboutStory from '@/components/redesign/about/AboutStory';
import AboutValues from '@/components/redesign/about/AboutValues';
import AboutFounder from '@/components/redesign/about/AboutFounder';
import AboutNumbers from '@/components/redesign/about/AboutNumbers';
import CtaPanel from '@/components/redesign/CtaPanel';
import '@/components/redesign/about/about.css';

export const metadata: Metadata = {
  title: 'About Us: Creative Technology Agency in Nairobi',
  description:
    'Meet Nesture-X, a Nairobi creative technology agency founded in 2024, combining design and full-stack development to build products that grow businesses.',
  alternates: {
    canonical: '/about',
  },
};

// Server component: only the scroll reveal, the deferred hero ribbons and the stat
// count-ups ship JS.
export default function AboutPage() {
  return (
    <main className="nxab">
      <HomeReveal root=".nxab" item=".nxab-reveal" readyClass="nxab-reveal-ready" />
      <div className="nxab-hero-wrap nx-hero-ribbons-host">
        <HeroRibbons className="nx-hero-ribbons" />
        <AboutHero />
      </div>
      <div className="nxab-wrap">
        <AboutStory />
        <AboutValues />
        <AboutFounder />
        <AboutNumbers />
        <section className="nxab-sec" aria-labelledby="nxab-cta-title">
          <CtaPanel
            titleId="nxab-cta-title"
            title="HAVE AN IDEA?"
            text="Tell us the problem. We'll tell you how we'd build it."
            primary={{ href: '/booking', label: 'Book a consultation' }}
            secondary={{ href: '/portfolio', label: 'See our work' }}
            art="peter-arms-crossed"
            artAlt="Peter of Nesture-X as a 3D character, arms crossed"
            className="nxab-reveal"
          />
        </section>
      </div>
    </main>
  );
}
