'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/sections/Hero';
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
          className="text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] text-[var(--color-white)] max-w-4xl mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          WE BUILD DIGITAL EXPERIENCES THAT HIT DIFFERENT.
        </h2>
        <p
          className="text-[var(--color-blue-grey)] text-[clamp(0.9rem,1.5vw,1.1rem)] max-w-2xl leading-relaxed mb-10"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Strategy, design, and code — all under one roof, all built with intention.
          Born in Nairobi, built for the world.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center px-8 py-3 rounded-full bg-[var(--color-blue)] text-[var(--color-white)] text-sm tracking-[0.14em] uppercase transition-opacity duration-200 hover:opacity-85"
          style={{ fontFamily: 'var(--font-mono)' }}
          data-hover
        >
          OUR STORY
        </Link>
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
