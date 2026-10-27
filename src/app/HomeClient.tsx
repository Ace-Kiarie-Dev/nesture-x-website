'use client';

import HomeHero from '@/components/redesign/home/HomeHero';
import HomeWhoWeAre from '@/components/redesign/home/HomeWhoWeAre';
import HomeMarquee from '@/components/redesign/home/HomeMarquee';
import HomeSolve from '@/components/redesign/home/HomeSolve';
import HomeReveal from '@/components/redesign/home/HomeReveal';
import HomeServices from '@/components/redesign/home/HomeServices';
import Portfolio from '@/components/sections/Portfolio';
import About from '@/components/sections/About';
import Partners from '@/components/sections/Partners';
import Process from '@/components/sections/Process';
import TechStack from '@/components/sections/TechStack';
import CTA from '@/components/sections/CTA';
import Contact from '@/components/sections/Contact';
import '@/components/redesign/home/home.css';

export default function HomeClient() {
  return (
    <main className="nxhp">
      <HomeReveal />
      <div className="nxhp-wrap">
        <HomeHero />
      </div>
      <HomeMarquee />
      <div className="nxhp-wrap">
        <HomeSolve />
        <HomeServices />
        <HomeWhoWeAre />
      </div>

      <Portfolio featuredOnly />
      <About />
      <Partners />
      <Process />
      <TechStack />
      <Contact />
      <CTA />
    </main>
  );
}
