'use client';

import { useState } from 'react';

const TABS = [
  {
    id: 'web',
    label: 'Web Development',
    ghost: 'WEB',
    title: 'Web Development',
    description: 'Custom websites and full-stack web applications built for performance, scalability, and real business results — M-Pesa included.',
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
  },
  {
    id: 'design',
    label: 'Graphic Design',
    ghost: 'DESIGN',
    title: 'Graphic Design',
    description: 'Brand identities and visual assets built with precision. From logo to launch collateral — every pixel has intent.',
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
  },
  {
    id: 'marketing',
    label: 'Digital Marketing',
    ghost: 'MARKET',
    title: 'Digital Marketing',
    description: 'Strategy and execution to grow your audience. Content, SEO, WhatsApp flows — built for the Nairobi market and beyond.',
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
  },
  {
    id: 'mpesa',
    label: 'M-Pesa Integration',
    ghost: 'MPESA',
    title: 'M-Pesa Integration',
    description: 'End-to-end Daraja API integration. STK push, webhooks, booking flows, and payment confirmations — production-ready.',
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
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const panel = TABS[activeTab];

  return (
    <section
      id="services"
      style={{ background: '#111318', padding: '6rem 3rem' }}
    >
      {/* Header */}
      <div style={{ marginBottom: '4rem' }}>
        <div className="section-label" style={{ marginBottom: '1rem' }}>
          What We Do
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-bebas), sans-serif',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: '#f5f5f5',
            lineHeight: 1,
            margin: 0,
          }}
        >
          OUR SERVICES
        </h2>
      </div>

      {/* 2-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        {/* LEFT — sticky tab nav */}
        <nav style={{ position: 'sticky', top: '8rem' }}>
          {TABS.map((tab, i) => {
            const active = i === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(i)}
                data-hover
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '1rem 0',
                  borderBottom: '1px solid rgba(245,245,245,0.06)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-grotesk), sans-serif',
                  fontWeight: 500,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: active ? '#1a6fd4' : 'rgba(245,245,245,0.4)',
                  transition: 'color 0.2s',
                  textAlign: 'left',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = '#f5f5f5';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(245,245,245,0.4)';
                }}
              >
                {tab.label}
                <span
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'opacity 0.2s, transform 0.2s',
                    color: '#1a6fd4',
                  }}
                >
                  →
                </span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT — content panel */}
        <div>
          {/* Visual block */}
          <div
            style={{
              height: '180px',
              background: '#141920',
              border: '1px solid rgba(26,111,212,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-bebas), sans-serif',
                fontSize: '5rem',
                color: 'rgba(26,111,212,0.08)',
                letterSpacing: '0.1em',
                userSelect: 'none',
              }}
            >
              {panel.ghost}
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-bebas), sans-serif',
              fontSize: '3rem',
              color: '#f5f5f5',
              margin: '0 0 1rem',
              lineHeight: 1,
            }}
          >
            {panel.title}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-grotesk), sans-serif',
              fontWeight: 300,
              fontSize: '1rem',
              color: 'rgba(245,245,245,0.6)',
              maxWidth: '500px',
              lineHeight: 1.7,
              margin: '0 0 2rem',
            }}
          >
            {panel.description}
          </p>

          {/* Features grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1px',
              background: 'rgba(26,111,212,0.1)',
            }}
          >
            {panel.features.map(feature => (
              <div
                key={feature}
                style={{
                  background: '#111318',
                  border: '1px solid rgba(26,111,212,0.1)',
                  padding: '0.7rem',
                  fontFamily: 'var(--font-grotesk), sans-serif',
                  fontSize: '0.82rem',
                  color: 'rgba(245,245,245,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ color: '#1a6fd4', flexShrink: 0 }}>→</span>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
