import type { Metadata } from 'next';
import HomeReveal from '@/components/redesign/home/HomeReveal';
import HeroRibbons from '@/components/redesign/HeroRibbons';
import AboutHero from '@/components/redesign/about/AboutHero';
import AboutStory from '@/components/redesign/about/AboutStory';
import AboutValues from '@/components/redesign/about/AboutValues';
import AboutFounder from '@/components/redesign/about/AboutFounder';
import AboutNumbers from '@/components/redesign/about/AboutNumbers';
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
      </div>
    </main>
  );
}
