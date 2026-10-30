import { BookOpen, HandHeart, MessageCircleHeart, MessageSquareQuote, Users } from 'lucide-react';
import type { ProductLandingConfig } from '@/components/product-landing/types';

// Hikarani landing page (/hikarani). Copy is the approved brand copy; nothing here makes
// a claim about price, platforms, release date or data handling until those are decided.
//
// Every image under /images/hikarani/ with a -temp suffix is a stand-in cropped from the
// brand board (design-refs/hikarani/brand-board.png). Swap in final files by changing
// src/width/height here; the page sizes itself from these numbers.

const IMG = '/images/hikarani';

export const HIKARANI: ProductLandingConfig = {
  slug: 'hikarani',
  name: 'Hikarani',
  platform: 'mobile',
  // The screens are mock-ups cropped from the brand board until the app is built.
  screensNote: 'Design preview',
  themeClass: 'theme-hikarani',
  theme: {
    colors: {
      bg: '#FFF9F3',        // Cream
      surface: '#FFFFFF',
      tint: '#F4EEFC',      // Lavender, very light
      text: '#1F2937',      // Charcoal
      muted: '#4B5563',
      primary: '#4B2E83',   // Royal Purple
      onPrimary: '#FFF9F3',
      accent: '#A78BFA',    // Lavender
      highlight: '#F6C667', // Gold
      border: '#E9DFF7',
      danger: '#B42318',
    },
    fontHeading: 'var(--font-playfair), "Playfair Display Fallback", Georgia, serif',
    fontBody: 'var(--font-inter), "Inter Fallback", system-ui, sans-serif',
    radius: '14px',
    radiusLg: '24px',
  },

  brand: {
    // TEMP: the app icon stands in for the mark. The board's mark sits on its own cream
    // ground, which shows as a box on the page; swap in a transparent mark here.
    logo: { src: `${IMG}/hikarani-app-icon-temp.webp`, width: 199, height: 200, alt: '' },
    // TEMP: cropped from the brand board.
    icon: { src: `${IMG}/hikarani-app-icon-temp.webp`, width: 199, height: 200, alt: '' },
  },

  seo: {
    title: 'Hikarani — Faith and Community App',
    description:
      "Hikarani is a faith and community app for Christians: Scripture-based truth, prayer requests, confessions, testimonies and community in one place. Coming soon.",
    keywords: ['Hikarani', 'Christian app', 'faith app', 'prayer request app', 'Christian community app', 'Bible encouragement app'],
    ogImage: {
      src: '/images/originals/Hikarani-Card.webp',
      width: 1672,
      height: 940,
      alt: "Hikarani — Because you're not alone.",
    },
    applicationCategory: 'LifestyleApplication',
  },

  hero: {
    status: 'COMING SOON',
    eyebrow: 'TRUTH · ENCOURAGEMENT · TOGETHER',
    headline: "Because you're not alone.",
    subline: "God's Word is true, and so are His people.",
    intro:
      'A faith and community app for Christians. Scripture-based truth, prayer, honesty and encouragement, in one place.',
    formNote: "We'll only email you when Hikarani launches.",
    screens: [
      // TEMP: cropped from the brand board.
      { src: `${IMG}/hikarani-screen-home-temp.webp`, width: 241, height: 417, alt: "Hikarani home screen with Today's Scripture" },
      { src: `${IMG}/hikarani-screen-truth-temp.webp`, width: 212, height: 417, alt: "Hikarani God's Truth response screen" },
    ],
  },

  promise: {
    kind: 'quote',
    text: 'Your word is a lamp to my feet and a light to my path.',
    cite: 'Psalm 119:105',
  },

  features: {
    eyebrow: 'Key features',
    title: 'Five ways to walk in faith, together',
    items: [
      { Icon: BookOpen, title: "God's Truth", body: 'Scripture-based answers that meet you where you are and replace lies with truth.' },
      { Icon: HandHeart, title: 'Prayer Requests', body: 'Share your prayer needs and find someone to pray with.' },
      { Icon: MessageCircleHeart, title: 'Confessions', body: 'A safe space to be honest and find support.' },
      { Icon: MessageSquareQuote, title: 'Testimonies', body: 'Share your story and encourage others.' },
      { Icon: Users, title: 'Community', body: 'Walk together in faith.' },
    ],
  },

  steps: {
    eyebrow: 'How it works',
    title: 'Three simple steps',
    items: [
      { title: "Bring what you're facing", body: "Tell Hikarani what's weighing on you, in your own words." },
      { title: "Receive God's truth", body: 'Get Scripture-based answers that meet you where you are and replace lies with truth.' },
      { title: 'Share and pray together', body: 'Post a prayer request or a testimony, and pray with others in the community.' },
    ],
  },

  screens: {
    eyebrow: 'A first look',
    title: 'Inside Hikarani',
    items: [
      // TEMP: all three cropped from the brand board.
      {
        image: { src: `${IMG}/hikarani-screen-home-temp.webp`, width: 241, height: 417, alt: "Hikarani home screen with Today's Scripture" },
        caption: "Today's Scripture on your home screen",
      },
      {
        image: { src: `${IMG}/hikarani-screen-truth-temp.webp`, width: 212, height: 417, alt: "Hikarani God's Truth response to a worry, with a Psalm" },
        caption: "God's Truth for what you're facing",
      },
      {
        image: { src: `${IMG}/hikarani-screen-prayer-temp.webp`, width: 229, height: 417, alt: 'Hikarani Prayer Requests feed with Pray buttons' },
        caption: 'Prayer requests from the community',
      },
    ],
  },

  values: {
    eyebrow: 'Our values',
    title: 'What Hikarani stands for',
    items: [
      'Real people. Real prayers.',
      'Biblical truth, always.',
      'A safe space to be honest.',
      'Encouragement for every season.',
      'Together in Christ.',
    ],
    closing: 'Faith grows stronger when we grow together.',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'What is Hikarani?',
        a: 'Hikarani is a faith and community app for Christians. It brings Scripture-based truth, prayer, honesty and encouragement together in one place.',
      },
      {
        q: 'What can I do in Hikarani?',
        a: "Find Scripture-based answers in God's Truth, share your prayer needs in Prayer Requests, be honest in Confessions, encourage others with Testimonies, and walk together in faith in the Community.",
      },
      {
        q: "What is God's Truth?",
        a: 'Scripture-based answers that meet you where you are and replace lies with truth.',
      },
      {
        q: 'Is Hikarani available yet?',
        a: "Not yet. Hikarani is coming soon. Join the launch list and we'll email you when it opens.",
      },
    ],
  },

  final: {
    title: 'Be there when it opens.',
    body: "Join the launch list and we'll send you one email, the day Hikarani launches.",
  },

  builtBy: 'Hikarani is an NX Original, designed and built by Nesture-X.',
};
