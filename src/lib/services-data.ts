import type { Asset3dKey } from './assets3d';

// Content for the redesigned /services page. Ids double as the in-page anchors (#s1..#s6)
// used by the quick nav and the hero's "See all six" button.

export type Service = {
  id: `s${number}`;
  number: string;
  title: string;
  asset: Asset3dKey;
  sub: string;
  body: string;
  chips: string[];
  seenIn: string[];
};

export const SERVICES: readonly Service[] = [
  {
    id: 's1',
    number: '01',
    title: 'Web & mobile apps',
    asset: 'svc-phone',
    sub: 'Sites that work as hard as you do.',
    body: 'Custom websites and full-stack web apps with logins, payments and admin panels, plus React Native apps built for Google Play. Mobile-first, because that is how Kenya browses.',
    chips: ['Custom websites', 'Full-stack web apps', 'React Native apps', 'Admin panels'],
    seenIn: ['Vicking Ventures', 'Odu Fitness'],
  },
  {
    id: 's2',
    number: '02',
    title: 'E-commerce & M-Pesa',
    asset: 'svc-cart',
    sub: 'Sell online. Get paid on M-Pesa.',
    body: 'Catalogues, carts and checkouts with M-Pesa STK push confirmed end to end. Orders, stock and customers live in one admin, with WhatsApp and email confirmations after every sale.',
    chips: ['M-Pesa STK push', 'Product catalogues', 'Order tracking', 'WhatsApp enquiries'],
    seenIn: ['Shinkusen', 'Mr Right Imports'],
  },
  {
    id: 's3',
    number: '03',
    title: 'APIs, data & hosting',
    asset: 'svc-cloud',
    sub: 'The engine room, handled.',
    body: 'Node and Express APIs, MongoDB Atlas databases, and deployment on Railway, Vercel, Netlify or Firebase. You get something scalable, not something that falls over on launch day.',
    chips: ['Node.js + Express', 'MongoDB Atlas', 'Railway · Vercel · Netlify', 'Firebase'],
    seenIn: ['NX Admin', 'Vicking Ventures'],
  },
  {
    id: 's4',
    number: '04',
    title: 'Auth, admin & access',
    asset: 'svc-lock',
    sub: 'Only the right people get in.',
    body: 'JWT sign-in, protected dashboards and role-based tools so your team can run the business from one place without exposing it to everyone else.',
    chips: ['JWT auth', 'Protected dashboards', 'Admin tools', 'Role-based access'],
    seenIn: ['Kikota', 'NX Admin'],
  },
  {
    id: 's5',
    number: '05',
    title: 'Digital marketing & SEO',
    asset: 'svc-seo',
    sub: 'Be found. Then be remembered.',
    body: 'Social media strategy and content, SEO and content marketing, backlink outreach, and WhatsApp-integrated flows that turn a scroll into a conversation.',
    chips: ['Social media content', 'SEO & content', 'Outreach & backlinks', 'WhatsApp flows'],
    seenIn: ['Blefice', 'Shadowcope'],
  },
  {
    id: 's6',
    number: '06',
    title: 'Design & print',
    asset: 'svc-print',
    sub: 'Brands people recognise on sight.',
    body: 'Logos, colour systems and typography, then the flyers, posters, banners and business cards that carry them. Large-format printing handled start to finish.',
    chips: ['Brand identity', 'Flyers & posters', 'Banners & business cards', 'Social assets'],
    seenIn: ['Nairobi Made', 'Cradle Tattoos'],
  },
];

export type ProcessStep = { number: string; title: string; text: string };

export const PROCESS_STEPS: readonly ProcessStep[] = [
  { number: '01', title: 'Listen', text: 'We interrogate the brief until we know the real problem.' },
  { number: '02', title: 'Design', text: 'Mockups first, so you see it before we build it.' },
  { number: '03', title: 'Build', text: 'Production-grade code, tested on real phones.' },
  { number: '04', title: 'Launch + grow', text: 'We stay after delivery. Sometimes as equity partners.' },
];
