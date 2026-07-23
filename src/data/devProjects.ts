// Client-site projects rendered in the Web Apps tab. Lives in a plain
// (non-'use client') module so Server Components — e.g.
// /portfolio/status/[slug]/page.tsx's generateStaticParams — can import the
// data directly. WebDevGrid.tsx used to define this inline, but a 'use client'
// module's plain data exports aren't reliably readable from server code.

export interface DevProject {
  name: string;
  image: string | null;
  url: string | null;
  industry: string;
  comingSoon?: boolean;
}

export const DEV_PROJECTS: DevProject[] = [
  {
    name: 'MegaJackpot Predictions',
    image: '/images/megajp.png',
    url: 'https://megajackpot-predicitions.netlify.app/',
    industry: 'Sports & Betting',
  },
  {
    name: 'ShadowScope',
    image: '/images/shadowscope.png',
    url: 'https://shadowscope.netlify.app/',
    industry: 'Mystery Shopping',
  },
  {
    name: 'Zaidi Movers',
    image: '/images/zaidi.png',
    url: 'https://zaidi-movers.netlify.app/',
    industry: 'Logistics',
  },
  {
    name: 'Gucha Youth FC',
    image: '/images/gutcha.png',
    url: 'https://gutcha-youth.netlify.app/',
    industry: 'Sports & Community',
  },
  {
    name: 'Fit Track',
    image: '/images/fit.png',
    url: 'https://fit-track-fitii.netlify.app/',
    industry: 'Health & Fitness',
  },
  {
    name: 'ODU Active',
    image: '/images/odu.png',
    url: 'https://www.oduactive.com/',
    industry: 'Fitness Coaching',
  },
  {
    name: 'Vicking Ventures',
    image: null,
    url: null,
    industry: 'Tours & Travel',
    comingSoon: true,
  },
];
