'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';
import HeroArc from './HeroArc';
import HeroRibbons from '@/components/redesign/HeroRibbons';

const TYPED_PHRASES = [
  'for tourism brands',
  'for fitness coaches',
  'for logistics companies',
  'end-to-end, M-Pesa included',
  'for the Nairobi hustle',
];

const STATS = [
  { number: '33+', label: 'Clients Served' },
  { number: '5', label: 'Equity Partners' },
  { number: '100%', label: 'Full-Stack Capable' },
];

const HEADLINE = [
  { text: 'CREATE.', outline: false },
  { text: 'DISCOVER.', outline: true },
  { text: 'EXPLORE.', outline: false },
];

const AVATAR = ASSETS_3D['avatar-cutout'];

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

export default function HomeHero() {
  return (
    <>
      {/* Ribbon glow behind the top of the page (shared HeroRibbons, loaded after idle). */}
      <HeroRibbons className="nxhp-ribbons" />

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
          <HeroArc />
          <ul className="nxhp-stats-pill nx-clay" aria-label="Nesture-X at a glance">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="nxhp-stats-pill-num">{stat.number}</span>
                <span className="nxhp-stats-pill-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
