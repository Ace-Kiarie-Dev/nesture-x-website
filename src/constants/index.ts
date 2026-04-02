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
    title: 'Web Development',
    description: 'Custom websites and full-stack web applications built for growth.',
    items: [
      'Custom website design & development',
      'Full-stack web applications',
      'M-Pesa STK push integration',
      'API development (Node.js/Express)',
      'Database design (MongoDB Atlas)',
      'Deployment & hosting management',
    ],
  },
  {
    title: 'Graphic Design',
    description: 'Brand identities and visual assets that communicate with precision.',
    items: [
      'Brand identity design (logos, color systems)',
      'Print design (flyers, posters, business cards)',
      'Digital design assets (social media)',
      'Canva-based design for clients',
    ],
  },
  {
    title: 'Digital Marketing',
    description: 'Strategy and execution to grow your audience and reach.',
    items: [
      'Social media strategy & content creation',
      'SEO and content marketing',
      'Outreach and backlink strategy',
      'WhatsApp-integrated marketing flows',
    ],
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
