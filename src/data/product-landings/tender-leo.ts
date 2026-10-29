import { FolderCheck, ShieldCheck, Target, TrendingUp, Zap } from 'lucide-react';
import type { ProductLandingConfig } from '@/components/product-landing/types';

// Tender Leo landing page (/tender-leo). Copy comes from the brand board
// (design-refs/tender-leo/brand-board.png) and the dashboard mock on the portfolio card;
// nothing here makes a claim about price, release date, portals, data handling or
// accounts until those are decided.
//
// Every image under /images/tender-leo/ with a -temp suffix is a stand-in cropped from
// the brand board or the card's source image. Swap in final files by changing
// src/width/height here; the page sizes itself from these numbers.

const IMG = '/images/tender-leo';

const DASHBOARD = {
  src: `${IMG}/tender-leo-screen-dashboard-temp.webp`,
  width: 810,
  height: 527,
  alt: 'Tender Leo dashboard: Build a Compliant Bid in four steps, Extract, Verify, Generate and Assemble',
};

export const TENDER_LEO: ProductLandingConfig = {
  slug: 'tender-leo',
  name: 'Tender Leo',
  platform: 'web',
  // The screens are mock-ups cropped from the brand board until the app is built.
  screensNote: 'Design preview',
  themeClass: 'theme-tender-leo',
  theme: {
    colors: {
      bg: '#F8FAFC',        // Warm White
      surface: '#FFFFFF',
      tint: '#EDF2FA',      // Light Blue Grey, very light
      text: '#1E293B',
      muted: '#475569',
      primary: '#0D1B3E',   // Deep Navy
      onPrimary: '#F8FAFC',
      accent: '#B8CEF0',    // Light Blue Grey
      highlight: '#F6B21A', // Gold
      border: '#DCE5F3',
      danger: '#B42318',
    },
    fontHeading: 'var(--font-montserrat), "Montserrat Fallback", system-ui, sans-serif',
    fontBody: 'var(--font-inter), "Inter Fallback", system-ui, sans-serif',
    radius: '12px',
    radiusLg: '20px',
  },

  brand: {
    // TEMP: the app icon stands in for the mark until a transparent one exists.
    logo: { src: `${IMG}/tender-leo-app-icon-temp.webp`, width: 244, height: 244, alt: '' },
    // TEMP: cropped from the brand board.
    icon: { src: `${IMG}/tender-leo-app-icon-temp.webp`, width: 244, height: 244, alt: '' },
  },

  seo: {
    title: 'Tender Leo — Tender Bid Preparation for Kenyan Businesses',
    description:
      'Tender Leo helps Kenyan businesses prepare complete, compliant and accurate tender bids, so you can focus on winning, not paperwork. Coming soon.',
    keywords: ['Tender Leo', 'tender bid preparation', 'Kenya tenders', 'tender compliance', 'bid package', 'tender documents Kenya'],
    ogImage: {
      src: '/images/originals/TenderLeo-Card.webp',
      width: 1672,
      height: 940,
      alt: 'Tender Leo — Compliant Bids. Greater Chances.',
    },
    applicationCategory: 'BusinessApplication',
  },

  hero: {
    status: 'COMING SOON',
    eyebrow: 'ACCURACY · COMPLIANCE · EFFICIENCY',
    headline: 'Compliant bids. Greater chances.',
    subline: 'Smarter preparation. Stronger bids.',
    intro:
      'Tender Leo helps Kenyan businesses prepare complete, compliant and accurate tender bids, so you can focus on winning, not paperwork.',
    formNote: "We'll only email you when Tender Leo launches.",
    // TEMP: cropped from the portfolio card's source image.
    screens: [DASHBOARD],
  },

  promise: {
    kind: 'statement',
    eyebrow: 'Why Tender Leo',
    title: 'Focus on winning, not paperwork.',
    body: 'Go from the tender document to a ready-to-upload bid package, with every requirement checked and every document in place.',
  },

  features: {
    eyebrow: 'Key features',
    title: 'Built for stronger bids',
    items: [
      { Icon: Target, title: 'Accuracy', body: 'Key requirements are pulled from the tender documents, so none get missed.' },
      { Icon: ShieldCheck, title: 'Compliance', body: 'Check your bid against the criteria and make sure you meet them all.' },
      { Icon: Zap, title: 'Efficiency', body: 'Less manual work. Create your bid content using AI and templates.' },
      { Icon: FolderCheck, title: 'Complete packages', body: 'Documents assembled and ready for signature, in one package.' },
      { Icon: TrendingUp, title: 'More wins', body: 'Complete, compliant bids give your business a greater chance.' },
    ],
  },

  steps: {
    eyebrow: 'How it works',
    title: 'Four simple steps',
    items: [
      { title: 'Extract', body: 'Get the key requirements from the tender documents.' },
      { title: 'Verify', body: 'Check compliance and make sure you meet all criteria.' },
      { title: 'Generate', body: 'Create your bid content using AI and templates.' },
      { title: 'Assemble', body: 'Put everything together into one complete package.' },
    ],
  },

  screens: {
    eyebrow: 'A first look',
    title: 'Inside Tender Leo',
    items: [
      // TEMP: cropped from the portfolio card's source image.
      { image: DASHBOARD, caption: 'Build a compliant bid in four steps' },
      {
        // TEMP: cropped from the brand board; the smallest asset here, replace first.
        image: {
          src: `${IMG}/tender-leo-screen-package-temp.webp`,
          width: 430,
          height: 227,
          alt: 'Tender Leo screen showing a finished bid package, ready to upload',
        },
        caption: 'Your bid package, ready to upload',
      },
    ],
  },

  values: {
    eyebrow: 'Our promise',
    title: 'What Tender Leo stands for',
    items: [
      'No missed requirements.',
      'Always up to date.',
      'Less manual work.',
      'Built for your success.',
    ],
    closing: 'Compliant bids. Greater chances.',
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Good to know',
    items: [
      {
        q: 'What is Tender Leo?',
        a: 'Tender Leo helps Kenyan businesses prepare complete, compliant and accurate tender bids, so you can focus on winning, not paperwork.',
      },
      {
        q: 'Who is it for?',
        a: 'Kenyan businesses that bid for tenders and want every bid complete and compliant.',
      },
      {
        q: 'How does it work?',
        a: 'In four steps: extract the key requirements from the tender documents, verify that you meet all the criteria, generate your bid content using AI and templates, and assemble everything into one complete package.',
      },
      {
        q: 'Is Tender Leo available yet?',
        a: "Not yet. Tender Leo is coming soon. Join the launch list and we'll email you when it opens.",
      },
    ],
  },

  final: {
    title: 'Be ready for your next tender.',
    body: "Join the launch list and we'll send you one email, the day Tender Leo launches.",
  },

  builtBy: 'Tender Leo is an NX Original, designed and built by Nesture-X.',
};
