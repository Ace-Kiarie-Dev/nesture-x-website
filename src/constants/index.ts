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
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

// Services
export const SERVICES = [
  {
    id: 'web',
    tab: 'Web Development',
    visual: 'WEB',
    headline: 'Web Development',
    description: 'From brochure sites to full-stack applications — we design, build, and deploy. Every project is production-grade, scalable, and built for the Kenyan market.',
    features: [
      'Custom Website Design & Build',
      'Full-Stack Web Applications',
      'React / Node.js Development',
      'Admin Panels & Dashboards',
      'API Development & Integration',
      'MongoDB Atlas Databases',
      'Netlify / Railway / Vercel Deploy',
      'Authentication & User Systems',
    ],
    gradient: 'linear-gradient(135deg, #0d1b3e 0%, #0a0a0a 100%)',
  },
  {
    id: 'design',
    tab: 'Graphic Design',
    visual: 'DESIGN',
    headline: 'Graphic Design',
    description: 'Brand identity that means something. From logos and colour systems to print materials and digital assets — we design with intention and craft.',
    features: [
      'Logo & Brand Identity',
      'Colour Systems & Typography',
      'Flyers, Posters & Banners',
      'Business Cards & Print',
      'Social Media Assets',
      'Company Profiles',
      'Marketing Collateral',
      'Canva Templates',
    ],
    gradient: 'linear-gradient(135deg, #111318 0%, #1a2540 100%)',
  },
  {
    id: 'marketing',
    tab: 'Digital Marketing',
    visual: 'MARKET',
    headline: 'Digital Marketing',
    description: 'Strategy that understands the Kenyan digital landscape. WhatsApp flows, social media content, SEO — built for where your customers actually are.',
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
    gradient: 'linear-gradient(135deg, #0a1020 0%, #060a14 100%)',
  },
  {
    id: 'mpesa',
    tab: 'M-Pesa Integration',
    visual: 'MPESA',
    headline: 'M-Pesa Integration',
    description: 'One of the few Nairobi agencies with confirmed, end-to-end M-Pesa STK Push integration. Built in production — for client sites and our own platforms.',
    features: [
      'M-Pesa STK Push (Daraja API)',
      'Paybill & Buy Goods Setup',
      'Booking & Payment Flows',
      'Payment Confirmation Webhooks',
      'WhatsApp Post-Payment Triggers',
      'Order Management Systems',
      'Payment Ledger & Reporting',
      'End-to-End QA Testing',
    ],
    gradient: 'linear-gradient(135deg, #0d1b3e 0%, #141920 100%)',
  },
] as const;

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
