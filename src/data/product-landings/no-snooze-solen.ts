import { AlarmClock, Flame, Ghost, KeyRound, Sun } from 'lucide-react';
import type { ProductLandingConfig } from '@/components/product-landing/types';

// No Snooze Solen landing page (/no-snooze-solen). Copy uses only what the app's docs
// state (no-snooze-solen/docs: VISUAL_GUIDE.md, PROJECT_BREAKDOWN.md); nothing here makes
// a claim about platforms, price or release date until those are decided.
//
// Colours are the locked VISUAL_GUIDE tokens. Blue (action) is only for things you can
// press; amber (highlight) only for status and data. The page's own skin (clay cards,
// the band, neutral chips) is in app/no-snooze-solen/solen.css.
//
// No screenshots yet: the hero shows the portfolio key art, and the screens section is
// left out. To add real screens later, set hero.screens (and drop hero.image) and add a
// screens section; the template draws phone frames around them.

const IMG = '/images/solen';

export const NO_SNOOZE_SOLEN: ProductLandingConfig = {
  slug: 'no-snooze-solen',
  name: 'No Snooze Solen',
  platform: 'mobile',
  themeClass: 'theme-solen',
  theme: {
    colors: {
      bg: '#080B14',        // bg.base
      surface: '#121A2B',   // bg.elevated (cards)
      tint: '#0C1220',      // bg.elevatedAlt (recessed)
      text: '#F2F5FA',      // text.primary
      muted: '#A8B2C4',     // text.secondary
      primary: '#F2F5FA',   // headings: text.primary
      onPrimary: '#080B14', // text on the blue button
      action: '#4D9FFF',    // accent.blue, interactive only
      accent: '#2B4A7A',    // selection
      highlight: '#E8A045', // accent.amber, status and data only
      border: '#1C2536',    // divider
      danger: '#FF9B9B',
    },
    fontHeading: '"Clash Display", "Clash Display Fallback", system-ui, sans-serif',
    fontBody: 'var(--font-outfit), "Outfit Fallback", system-ui, sans-serif',
    radius: '16px',
    radiusLg: '24px',
  },

  brand: {
    // In-app expressions (assets/images/solen, @2x 400x400, transparent).
    logo: { src: `${IMG}/solen-peaceful.webp`, width: 400, height: 400, alt: '' },
    icon: { src: `${IMG}/solen-celebratory.webp`, width: 400, height: 400, alt: '' },
  },

  seo: {
    title: "No Snooze Solen: The Alarm That Won't Let You Quit",
    description:
      'No Snooze Solen is an alarm clock with a personality. One 7 minute snooze, a Ghost Button that moves, and a 6 digit PIN between you and your pillow. Coming soon.',
    keywords: ['No Snooze Solen', 'alarm clock app', 'no snooze alarm', 'wake up challenge alarm', 'PIN alarm', 'Solen'],
    ogImage: {
      src: '/images/originals/Solen-Card.webp',
      width: 1672,
      height: 940,
      alt: "No Snooze Solen. The alarm that won't let you quit.",
    },
    applicationCategory: 'UtilitiesApplication',
  },

  hero: {
    status: 'COMING SOON',
    eyebrow: 'MEET SOLEN',
    headline: "The alarm that won't let you quit.",
    subline: "Warm when you show up. Merciless when you don't.",
    intro:
      'No Snooze Solen is an alarm clock with a personality. Every step after your one snooze makes it harder to stay in bed, until you are properly awake.',
    formNote: "We'll only email you when No Snooze Solen launches.",
    // Key art until there are real screenshots (see the note at the top).
    image: {
      src: '/images/originals/Solen-Card.webp',
      width: 1672,
      height: 940,
      alt: 'Solen, a galaxy sphere with a sun corona, pressing a big Snooze button beside a PIN keypad',
    },
  },

  promise: {
    kind: 'statement',
    eyebrow: 'The rule',
    title: 'One snooze is a grace.',
    body: 'Everything after that is a negotiation you will lose.',
  },

  features: {
    eyebrow: 'How Solen wakes you',
    title: 'Built so you cannot sleep through it',
    items: [
      { Icon: AlarmClock, title: 'One snooze, 7 minutes', body: 'You get exactly one snooze, and it lasts 7 minutes. There is no second one.' },
      { Icon: Ghost, title: 'The Ghost Button', body: 'The dismiss button moves around the screen. It goes disabled and vanishes at random, so you have to chase it.' },
      { Icon: KeyRound, title: 'Wake Challenge', body: 'To finish, you enter a 6 digit PIN. A wrong entry starts the challenge again.' },
      { Icon: Flame, title: 'Streaks', body: 'Every morning you make it counts towards your streak, and Solen reacts to it.' },
      { Icon: Sun, title: 'Meet Solen', body: "A cosmic companion: a galaxy sphere wrapped in a sun corona, warm when you show up and merciless when you don't." },
    ],
  },

  steps: {
    eyebrow: 'The journey',
    title: 'From alarm to awake',
    items: [
      { title: 'Set your alarm', body: 'Name it, pick the time, and Solen keeps watch.' },
      { title: 'Alarm fires', body: 'You get one snooze. It lasts 7 minutes.' },
      { title: 'Ghost Button', body: 'The dismiss button moves, flickers off and vanishes. Catch it.' },
      { title: 'Wake Challenge', body: 'Enter the 6 digit PIN to prove you are up.' },
      { title: 'Wake Confirmed', body: 'You made it. Solen celebrates with you.' },
    ],
  },

  values: {
    eyebrow: 'Why it works',
    title: 'No easy way out',
    items: [
      'Exactly one snooze, exactly 7 minutes.',
      'A dismiss button that will not sit still.',
      'A 6 digit PIN between you and your pillow.',
      'A friend who is glad when you show up.',
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'What is No Snooze Solen?',
        a: 'An alarm clock with a personality. After your one snooze, it adds a Ghost Button and a Wake Challenge, so you cannot sleep through it.',
      },
      {
        q: 'How does snoozing work?',
        a: 'You get exactly one snooze, and it lasts 7 minutes. After that, there are no more snoozes.',
      },
      {
        q: 'What is the Ghost Button?',
        a: 'After your snooze, the dismiss button moves around the screen. At random it goes disabled or vanishes for a moment, so you have to be awake to catch it.',
      },
      {
        q: 'How do I turn the alarm off?',
        a: 'Complete the Wake Challenge by entering a 6 digit PIN. A wrong entry starts the challenge again. Get it right and your wake up is confirmed.',
      },
      {
        q: 'Who is Solen?',
        a: "Solen is the character at the centre of the app: a cosmic galaxy sphere wrapped in a sun corona, warm when you show up and merciless when you don't.",
      },
      {
        q: 'Is No Snooze Solen available yet?',
        a: "Not yet. No Snooze Solen is coming soon. Join the launch list and we'll email you when it opens.",
      },
    ],
  },

  final: {
    title: 'Be first to meet Solen.',
    body: "Join the launch list and we'll send you one email, the day No Snooze Solen launches.",
  },

  builtBy: 'No Snooze Solen is an NX Original, designed and built by Nesture-X.',
};
