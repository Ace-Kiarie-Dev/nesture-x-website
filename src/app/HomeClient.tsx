// Server component despite the name (kept so page.tsx is untouched): only the hero,
// services tabs, scroll reveal, count-ups and Contact ship client JS.
import HomeHero from '@/components/redesign/home/HomeHero';
import HomeWhoWeAre from '@/components/redesign/home/HomeWhoWeAre';
import HomeMarquee from '@/components/redesign/home/HomeMarquee';
import HomeSolve from '@/components/redesign/home/HomeSolve';
import HomeReveal from '@/components/redesign/home/HomeReveal';
import HomeServices from '@/components/redesign/home/HomeServices';
import HomePortfolio from '@/components/redesign/home/HomePortfolio';
import HomeAbout from '@/components/redesign/home/HomeAbout';
import HomePartners from '@/components/redesign/home/HomePartners';
import HomeProcess from '@/components/redesign/home/HomeProcess';
import HomeStack from '@/components/redesign/home/HomeStack';
import HomeCta from '@/components/redesign/home/HomeCta';
import Contact from '@/components/sections/Contact';
import '@/components/redesign/home/home.css';

export default function HomeClient() {
  return (
    <main className="nxhp">
      <HomeReveal />
      <div className="nxhp-hero-wrap">
        <HomeHero />
      </div>
      <HomeMarquee />
      <div className="nxhp-wrap">
        <HomeSolve />
        <HomeServices />
        <HomeWhoWeAre />
        <HomePortfolio />
        <HomeAbout />
        <HomePartners />
        <HomeProcess />
        <HomeStack />
      </div>
      {/* Shared with /contact, so it keeps its own styling. */}
      <Contact />
      <div className="nxhp-wrap">
        <HomeCta />
      </div>
    </main>
  );
}
