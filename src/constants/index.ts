// Brand Colors
export const COLORS = {
  black: '#0a0a0a',
  blue: '#1a6fd4',
  white: '#f5f5f5',
  navy: '#0d1b3e',
  blueGrey: '#b8cef0',
} as const;

// Navigation Links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

// Services
export const SERVICES = [
  {
    id: 'web',
    tab: 'Web Development',
    number: '01',
    visual: 'WEB',
    headline: 'Web Development',
    description: 'From brochure sites to full-stack applications — we design, build, and deploy. Production-grade, scalable, and built for the Kenyan market including M-Pesa payment flows.',
    features: [
      'Custom Website Design & Build',
      'Full-Stack Web Applications',
      'React / Node.js Development',
      'Admin Panels & Dashboards',
      'API Development & Integration',
      'MongoDB Atlas Databases',
      'M-Pesa STK Push Integration',
      'Netlify / Railway / Vercel Deploy',
    ],
    gradient: 'linear-gradient(135deg, #0d1b3e 0%, #0a0a0a 100%)',
  },
  {
    id: 'mobile',
    tab: 'Mobile Apps',
    number: '02',
    visual: 'MOBILE',
    headline: 'Mobile App Development',
    description: 'Cross-platform mobile apps built with React Native, targeting Android (Google Play) and iOS. We build our own apps too — BetLedger and Hikarani are ours.',
    features: [
      'React Native Development',
      'Android (Google Play) Target',
      'iOS Development',
      'Cross-Platform Architecture',
      'App UI/UX Design',
      'Firebase / MongoDB Integration',
      'Push Notifications',
      'App Store Submission Support',
    ],
    gradient: 'linear-gradient(135deg, #060d1a 0%, #0a0a0a 100%)',
  },
  {
    id: 'design',
    tab: 'Graphic Design',
    number: '03',
    visual: 'DESIGN',
    headline: 'Graphic Design',
    description: 'Brand identity that means something. From logos and colour systems to social media assets and presentation slides — designed with intention, built to last.',
    features: [
      'Logo & Brand Identity',
      'Colour Systems & Typography',
      'Social Media Assets',
      'Company Profiles',
      'Presentation Slides',
      'ID Cards & Lanyards',
      'Marketing Collateral',
      'Canva Templates',
    ],
    gradient: 'linear-gradient(135deg, #111318 0%, #1a2540 100%)',
  },
  {
    id: 'print',
    tab: 'Print & Branding',
    number: '04',
    visual: 'PRINT',
    headline: 'Print & Branding',
    description: 'Large format, branded merchandise, and everything in between. We design it and we print it — roll-up banners to car branding, business cards to award plaques.',
    features: [
      'Roll-Up Banners & Signage',
      'Large Format Printing',
      'Car Branding & Wraps',
      'T-Shirts & Branded Merch',
      'Business Cards & Flyers',
      'Posters & Stickers',
      'Mugs, Pillows & Branded Items',
      'Award Plaques & Certificates',
    ],
    gradient: 'linear-gradient(135deg, #0a1020 0%, #060a14 100%)',
  },
  {
    id: 'marketing',
    tab: 'Digital Marketing',
    number: '05',
    visual: 'MARKET',
    headline: 'Digital Marketing',
    description: 'Strategy built for the Kenyan digital landscape. WhatsApp flows, social media content, SEO — where your customers actually are.',
    features: [
      'Social Media Strategy',
      'Content Creation & Planning',
      'SEO & Content Marketing',
      'WhatsApp Marketing Flows',
      'Outreach & Backlink Strategy',
      'Campaign Management',
      'Audience & Analytics Review',
      'Growth Consulting',
    ],
    gradient: 'linear-gradient(135deg, #0d1b3e 0%, #141920 100%)',
  },
] as const;

// Contact
export const CONTACT = {
  phone: '+254717164951',
  phoneDisplay: '+254-717-164-951',
  email: 'Nesture-x@gmail.com',
  whatsapp: 'https://wa.me/254717164951',
  location: 'Nairobi, Kenya',
} as const;

// Portfolio Companies (Equity Partners)
export const PORTFOLIO_COMPANIES = [
  {
    name: 'ODU Fitness',
    industry: 'Fitness Coaching',
    tagline: 'Fitness coaching platform built and co-owned by Nesture-X.',
  },
  {
    name: 'Vicking Ventures',
    industry: 'Tours & Travel',
    tagline: 'Full-stack adventure travel site with M-Pesa booking.',
  },
  {
    name: 'MR Right Imports & Gym Services',
    industry: 'Imports / Fitness Equipment',
    tagline: 'Product catalogue and web presence built by Nesture-X.',
  },
  {
    name: 'Joyspark Enterprises',
    industry: 'Décor / Events',
    tagline: 'Active equity partnership — decor and events.',
  },
  {
    name: 'Rar Ray Bakes',
    industry: 'Bakery / Food',
    tagline: 'Nairobi bakery brand with Nesture-X backing.',
  },
] as const;

// Client Trust Strip
export const CLIENTS = [
  'Zaidi Movers',
  'HSDPM',
  'Nairobi Made',
  'Jawitz General',
  'Phoneporium Kenya',
  'Osoro Law',
  'Cradle Tattoos',
  'Salix Data',
  'Shadowcope',
  'Blefice',
  'Centron Technics',
] as const;

// NX Originals
export const NX_ORIGINALS = [
  {
    name: 'SHINKUSEN',
    category: 'Faith × Anime × Streetwear',
    description: 'A Kenya-based Christian apparel brand blending faith, anime culture, and streetwear.',
    url: 'https://shinkusen.co.ke',
    status: 'live' as const,
  },
  {
    name: 'BetLedger',
    category: 'Personal Finance / Mobile App',
    description: 'A ledger-style app for tracking and analysing betting history.',
    url: null,
    status: 'in-development' as const,
  },
  {
    name: 'Hikarani',
    category: 'Faith & Community / Mobile App',
    description: 'A faith-based app for spiritual growth and community connection.',
    url: null,
    status: 'in-development' as const,
  },
] as const;
