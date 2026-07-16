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
import Contact from '@/components/sections/Contact';

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
        style={{
          background: 'var(--color-bg)',
          padding: 'clamp(8rem, 12vw, 14rem) clamp(2rem, 7vw, 8rem)',
        }}
      >
        <p className="section-label" style={{ marginBottom: '3.5rem' }}>
          Who We Are
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
            lineHeight: 0.92,
            color: 'var(--color-text)',
            maxWidth: '72rem',
            marginBottom: '3.5rem',
          }}
        >
          WE BUILD DIGITAL EXPERIENCES THAT HIT DIFFERENT.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            maxWidth: '36rem',
            lineHeight: 1.9,
            color: 'rgba(245,245,245,0.60)',
            marginBottom: '5rem',
          }}
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
      <Contact />
      <CTA />
    </main>
  );
}
