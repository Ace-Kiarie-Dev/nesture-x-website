'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import NxOriginalsCarousel from '@/components/sections/NxOriginalsCarousel';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';

const TYPED_PHRASES = [
  'for tourism brands',
  'for fitness coaches',
  'for logistics companies',
  'end-to-end, M-Pesa included',
  'for the Nairobi hustle',
];

const STATS = [
  { number: '11+', label: 'Clients Served' },
  { number: '5', label: 'Equity Partners' },
  { number: '100%', label: 'Full-Stack Capable' },
];

const HEADLINE = [
  { text: 'CREATE.', outline: false },
  { text: 'DISCOVER.', outline: true },
  { text: 'EXPLORE.', outline: false },
];

const AVATAR = ASSETS_3D['avatar-cutout'];

// Decorative ribbon glow behind the top of the page; client-only and loaded late.
// Same layer as the NX Gaming hub: nothing renders inside it, so the hero never remounts.
const HubRibbons = dynamic(() => import('@/components/nx-gaming/HubRibbons'), { ssr: false });

// Same typewriter as the original hero: type at 70ms, hold 1.8s, delete at 40ms, next phrase.
function useTypewriter(phrases: string[]) {
  const [typedText, setTypedText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (typedText.length < phrase.length) {
        timeout = setTimeout(() => setTypedText(phrase.slice(0, typedText.length + 1)), 70);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 1800);
      }
    } else if (typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(typedText.slice(0, -1)), 40);
    } else {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phraseIndex, phrases]);

  return typedText;
}

// Its own component, so each keystroke re-renders this span and not the whole hero
// (carousel and tilt card included).
function TypedPhrase() {
  const typedText = useTypewriter(TYPED_PHRASES);
  return <span>{typedText}</span>;
}

// The ribbon canvas is cheap to download but busy on the main thread, so it waits for
// the page load and an idle moment: first paint and LCP never compete with it.
function useAfterLoadIdle() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      else timer = setTimeout(() => setReady(true), 1200);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  return ready;
}

export default function HomeHero() {
  const showRibbons = useAfterLoadIdle();

  return (
    <>
      <div className="nxhp-ribbons" aria-hidden="true">
        {showRibbons && <HubRibbons />}
      </div>

      <section className="nxhp-hero" aria-label="Introduction">
        <div className="nxhp-hero-copy">
          <Eyebrow>Nairobi · Kenya · Est. 2024</Eyebrow>

          <h1 className="nxhp-hero-title">
            {HEADLINE.map((line, i) => (
              <span key={line.text} className={line.outline ? 'nxhp-hero-line nx-outline' : 'nxhp-hero-line'}>
                {/* Space between block lines: invisible, but the text reads "CREATE. DISCOVER. EXPLORE." */}
                {i > 0 && ' '}
                {line.text}
              </span>
            ))}
          </h1>

          <p className="nxhp-hero-lede">
            We don&apos;t make products. We build solutions —{' '}
            <TypedPhrase />
            <span className="nxhp-caret" aria-hidden="true" />
          </p>

          <div className="nxhp-hero-ctas">
            <ClayButton href="/booking">Book a Consultation</ClayButton>
            <ClayButton href="#portfolio" variant="ghost">
              View Our Work
            </ClayButton>
          </div>
        </div>

        <div className="nxhp-hero-avatar">
          <div className="nxhp-hero-figure">
            <span className="nxhp-hero-glow" aria-hidden="true" />
            <Image
              src={AVATAR.src}
              alt="Peter of Nesture-X as a 3D character working on a laptop"
              width={AVATAR.width}
              height={AVATAR.height}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1100px) 640px, (min-width: 768px) 400px, 296px"
              className="nxhp-hero-avatar-img"
            />
          </div>
        </div>

        <div className="nxhp-hero-mid">
          <div className="nxhp-originals nx-glass">
            <Eyebrow>NX Originals</Eyebrow>
            <NxOriginalsCarousel />
          </div>

          <ul className="nxhp-stats" aria-label="Nesture-X at a glance">
            {STATS.map((stat) => (
              <li key={stat.label} className="nxhp-stat nx-clay">
                <span className="nxhp-stat-num">{stat.number}</span>
                <span className="nxhp-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
