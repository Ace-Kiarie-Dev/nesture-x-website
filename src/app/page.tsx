import Hero from '@/components/sections/Hero';
import MarqueeStrip from '@/components/sections/Marquee';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import Partners from '@/components/sections/Partners';
import Process from '@/components/sections/Process';
import TechStack from '@/components/sections/TechStack';
import CTA from '@/components/sections/CTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <MarqueeStrip />
      <Services />
      <Portfolio />
      <Partners />
      <Process />
      <TechStack />
      <CTA />
    </main>
  );
}
