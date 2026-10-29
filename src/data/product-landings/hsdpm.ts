import { CalendarDays, HandHeart, LayoutGrid, Megaphone, MessageCircleHeart, Users } from 'lucide-react';
import type { ProductLandingConfig } from '@/components/product-landing/types';

// HSDPM App landing page (/hsdpm-church-app), the church app Nesture-X is building for
// Holy Spirit Dwelling Place Ministry. Copy comes from the brand board
// (design-refs/hsdpm/hsdpm-brand-board.png) and its brief; nothing here makes a claim
// about price, platforms, release date, accounts or data handling until those are decided.
//
// Every image under /images/hsdpm/ with a -temp suffix is a stand-in cropped from the
// brand board. Swap in final files by changing src/width/height here; the page sizes
// itself from these numbers.

const IMG = '/images/hsdpm';

// TEMP: all screens cropped from the brand board.
const SCREENS = {
  home: { src: `${IMG}/hsdpm-screen-home-temp.webp`, width: 222, height: 388, alt: 'HSDPM App home screen with the next service and quick-access links' },
  announcements: { src: `${IMG}/hsdpm-screen-announcements-temp.webp`, width: 220, height: 389, alt: 'HSDPM App Announcements feed with Church, Ministry and General filters' },
  events: { src: `${IMG}/hsdpm-screen-events-temp.webp`, width: 188, height: 391, alt: 'HSDPM App Events & Services list of upcoming services and fellowships' },
  prayer: { src: `${IMG}/hsdpm-screen-prayer-temp.webp`, width: 190, height: 389, alt: 'HSDPM App Prayer Requests list with Pray buttons' },
  updates: { src: `${IMG}/hsdpm-screen-updates-temp.webp`, width: 189, height: 391, alt: 'HSDPM App Member Updates feed' },
};

export const HSDPM: ProductLandingConfig = {
  slug: 'hsdpm-church-app',
  name: 'HSDPM App',
  platform: 'mobile',
  themeClass: 'theme-hsdpm',
  theme: {
    colors: {
      bg: '#FFFFFF',        // White
      surface: '#FFFFFF',
      tint: '#F5F3F1',      // Warm Grey
      text: '#111111',      // Charcoal Black
      muted: '#4B5563',
      primary: '#A90D2A',   // Burgundy
      onPrimary: '#FFFFFF',
      action: '#0877BC',    // Ministry Blue
      accent: '#CFE3F3',    // Ministry Blue, soft tint
      highlight: '#0877BC', // Ministry Blue
      border: '#E7E2DD',
      danger: '#B42318',
    },
    fontHeading: 'var(--font-playfair), "Playfair Display Fallback", Georgia, serif',
    fontBody: 'var(--font-inter), "Inter Fallback", system-ui, sans-serif',
    radius: '14px',
    radiusLg: '24px',
  },

  brand: {
    // TEMP: the ministry emblem, cropped from the brand board.
    logo: { src: `${IMG}/hsdpm-emblem-temp.webp`, width: 297, height: 297, alt: '' },
    icon: { src: `${IMG}/hsdpm-emblem-temp.webp`, width: 297, height: 297, alt: '' },
  },

  seo: {
    title: 'HSDPM App — Holy Spirit Dwelling Place Ministry',
    description:
      'The HSDPM App keeps the Holy Spirit Dwelling Place Ministry family connected: announcements, departments, events, prayer requests and member updates in one place. Coming soon.',
    keywords: ['HSDPM', 'HSDPM App', 'Holy Spirit Dwelling Place Ministry', 'church app', 'church community app', 'prayer request app'],
    ogImage: {
      src: '/images/originals/HSDPM-Card.webp',
      width: 1672,
      height: 940,
      alt: 'HSDPM Church App by Holy Spirit Dwelling Place Ministry',
    },
    applicationCategory: 'LifestyleApplication',
  },

  hero: {
    status: 'COMING SOON',
    eyebrow: 'HOLY SPIRIT DWELLING PLACE MINISTRY',
    headline: 'Stay Connected. Serve Together. Grow in Christ.',
    subline: 'One Church. One Family. Growing Together.',
    intro:
      'Your church community, in your pocket. Announcements, departments, events, prayer requests and member updates, all in one app.',
    formNote: "We'll only email you when the HSDPM App launches.",
    screens: [SCREENS.home, SCREENS.prayer],
  },

  promise: {
    kind: 'statement',
    eyebrow: 'Everything in one place',
    title: 'Your church community, in your pocket.',
    body: 'Quick access to what matters most: the latest announcements, upcoming services and events, and the church family you pray and serve alongside.',
  },

  features: {
    eyebrow: 'Inside the app',
    title: 'Everything your church family needs',
    items: [
      { Icon: LayoutGrid, title: 'Home', body: 'Quick access to what matters most: the next service, the latest announcements and key links.' },
      { Icon: Megaphone, title: 'Announcements', body: 'Get the latest news, updates and important information from your church.' },
      { Icon: Users, title: 'Departments', body: 'Explore our ministries, find your place and get involved.' },
      { Icon: CalendarDays, title: 'Events & Services', body: 'Stay informed about services, meetings and special events.' },
      { Icon: HandHeart, title: 'Prayer Requests', body: 'Share your needs, lift others in prayer, and stand together in faith.' },
      { Icon: MessageCircleHeart, title: 'Member Updates', body: 'Celebrate, encourage and stay connected with your church family.' },
    ],
  },

  steps: {
    eyebrow: 'How it works',
    title: 'Three simple steps',
    items: [
      { title: 'See what’s happening', body: 'Your home screen shows the next service, the latest announcements and quick links.' },
      { title: 'Find your place', body: 'Explore the departments, from Worship & Praise to Media & Technology, and get involved.' },
      { title: 'Pray and share together', body: 'Post a prayer request, pray for others, and share updates with your church family.' },
    ],
  },

  screens: {
    eyebrow: 'A first look',
    title: 'Inside the HSDPM App',
    items: [
      { image: SCREENS.announcements, caption: 'Announcements from your church' },
      { image: SCREENS.events, caption: 'Upcoming services and events' },
      { image: SCREENS.updates, caption: 'Updates from the church family' },
    ],
  },

  values: {
    eyebrow: 'Why it matters',
    title: 'Built for the HSDPM family',
    items: [
      'Know what’s happening at church.',
      'Find your place in a ministry.',
      'Lift one another in prayer.',
      'Celebrate and encourage one another.',
    ],
    closing: 'One Church. One Family. Growing Together.',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'What is the HSDPM App?',
        a: 'The church app for Holy Spirit Dwelling Place Ministry. It brings announcements, departments, events and services, prayer requests and member updates together in one place.',
      },
      {
        q: 'What can I do in the app?',
        a: 'Read the latest announcements, explore the departments, check upcoming services and events, share and pray for prayer requests, and celebrate and encourage one another in Member Updates.',
      },
      {
        q: 'Which departments are in the app?',
        a: 'Worship & Praise, Youth Ministry, Women’s Ministry, Men’s Ministry, Children’s Ministry, Ushering & Hospitality, and Media & Technology.',
      },
      {
        q: 'Is the HSDPM App available yet?',
        a: "Not yet. The HSDPM App is coming soon. Join the launch list and we'll email you when it opens.",
      },
    ],
  },

  final: {
    title: 'Be the first to know.',
    body: "Join the launch list and we'll send you one email, the day the HSDPM App launches.",
  },

  builtBy: 'The HSDPM App is designed and built by Nesture-X for Holy Spirit Dwelling Place Ministry.',
};
