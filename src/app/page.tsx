'use client';

import { motion } from 'framer-motion';
import Hero from '@/components/sections/Hero';
import NxButton from '@/components/ui/NxButton';
import MarqueeStrip from '@/components/sections/Marquee';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import About from '@/components/sections/About';
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

      {/* ── About teaser ── */}
      <motion.section
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[var(--color-black)] py-[clamp(3rem,6vw,5rem)] px-[clamp(1rem,3vw,2rem)]"
      >
        <h2
          className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-[var(--color-text)] max-w-4xl mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          WE BUILD DIGITAL EXPERIENCES THAT HIT DIFFERENT.
        </h2>
        <p
          className="text-[clamp(0.9rem,1.5vw,1.1rem)] max-w-2xl leading-relaxed mb-10"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,245,245,0.60)' }}
        >
          Strategy, design, and code — all under one roof, all built with intention.
          Born in Nairobi, built for the world.
        </p>
        <NxButton variant="primary" size="md" href="/about">
          OUR STORY
        </NxButton>
      </motion.section>

      <Portfolio featuredOnly />
      <About />
      <Partners />
      <Process />
      <TechStack />
      <CTA />
    </main>
  );
}
