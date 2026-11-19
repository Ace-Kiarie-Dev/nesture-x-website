import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { HELLO } from '@/lib/contactEmails';

const TITLE = 'Safiri Trips Privacy Policy | Nesture-X';
const DESCRIPTION =
  'How the Safiri Trips app handles your data: no account, no ads, no tracking, trips stored on your phone.';
const URL = 'https://nesturex.com/safiri-trips/privacy';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Nesture-X',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const mail = (
  <a href={`mailto:${HELLO}`} style={{ color: 'var(--color-primary)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
    {HELLO}
  </a>
);

type Block =
  | { type: 'p'; content: ReactNode }
  | { type: 'ul'; items: string[] };

type Section = { heading: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    heading: 'The short version',
    blocks: [
      {
        type: 'ul',
        items: [
          'No account, no sign up.',
          'No ads, no analytics, no tracking tools.',
          'Your trips, stops and packing lists are stored only on your phone.',
          'You can delete everything from inside the app at any time.',
        ],
      },
    ],
  },
  {
    heading: 'What stays on your phone',
    blocks: [
      {
        type: 'p',
        content:
          'Your trips, stops, start points, packing lists, settings, saved forecasts and place information, offline maps and scheduled trip alerts are stored on your device only. We do not receive copies of them.',
      },
      {
        type: 'p',
        content:
          'Pictures of a trip that you create with the share feature are made on your phone. They only leave it if you choose to share them or save them to a folder you pick.',
      },
    ],
  },
  {
    heading: 'What is sent over the internet, and why',
    blocks: [
      {
        type: 'p',
        content:
          'To search places, plan routes and show weather, the app sends requests to our own server (a proxy run by Nesture-X on Vercel). The proxy passes them to free public services and returns the answers. These requests contain:',
      },
      {
        type: 'ul',
        items: [
          'The text you type into search.',
          'The coordinates of the places in your trip, including your start point.',
          'Points along your route, used to suggest stops on the way.',
        ],
      },
      {
        type: 'p',
        content:
          'If you set your start point using "Use my location", your current location becomes your start point and is sent as part of these requests.',
      },
      {
        type: 'p',
        content:
          'The requests do not include your name, email, phone number, device ID or advertising ID. Our proxy does not store them in a database and does not log your search text or exact coordinates. Like any web server, it sees your IP address while handling a request and uses it briefly to prevent abuse.',
      },
      {
        type: 'p',
        content:
          'Some content loads directly from its source, which will see your IP address:',
      },
      {
        type: 'ul',
        items: ['Map tiles from OpenFreeMap.', 'Place photos from Wikimedia.'],
      },
    ],
  },
  {
    heading: 'Location',
    blocks: [
      {
        type: 'p',
        content:
          'Location access is optional. The app asks for it only when you tap "Near me" on the map or "Use my location" for a start point. It reads your location once, while the app is open. Safiri Trips never uses your location in the background. You can plan every trip without granting location access.',
      },
    ],
  },
  {
    heading: 'Notifications',
    blocks: [
      {
        type: 'p',
        content:
          'If you turn on trip alerts, the app schedules reminders on your phone using the forecast it already has. Nothing is sent to a notification server.',
      },
    ],
  },
  {
    heading: 'Third party services',
    blocks: [
      {
        type: 'p',
        content:
          'Safiri Trips relies on these services, each of which handles requests under its own privacy policy:',
      },
      {
        type: 'ul',
        items: [
          'OpenStreetMap: place search (Nominatim) and nearby places (Overpass)',
          'OpenRouteService by HeiGIT: driving routes',
          'Open-Meteo: weather and air quality',
          'Wikipedia and Wikimedia Commons: place summaries and photos',
          'OpenFreeMap: map tiles',
          'Vercel: hosting for our proxy',
        ],
      },
    ],
  },
  {
    heading: 'Deleting your data',
    blocks: [
      {
        type: 'p',
        content:
          'Open Settings in the app and tap "Delete all my data". This removes your trips, packing lists, saved maps, cached information and scheduled alerts from your phone. Uninstalling the app also removes everything. Because we store nothing about you on our servers, there is nothing else to delete.',
      },
    ],
  },
  {
    heading: 'Children',
    blocks: [
      {
        type: 'p',
        content:
          'Safiri Trips is a general audience travel app. It does not knowingly collect personal information from anyone, including children.',
      },
    ],
  },
  {
    heading: 'Changes to this policy',
    blocks: [
      {
        type: 'p',
        content:
          'If this policy changes, we will update this page and the effective date at the top.',
      },
    ],
  },
  {
    heading: 'Contact',
    blocks: [
      {
        type: 'p',
        content: (
          <>
            Nesture-X, Nairobi, Kenya
            <br />
            {mail}
          </>
        ),
      },
    ],
  },
];

const SECTION_PAD = 'clamp(4rem, 8vw, 8rem) clamp(1.25rem, 6vw, 8rem)';
const PROSE_WIDTH = '72ch';

const MUTED = 'color-mix(in srgb, var(--color-text) 70%, transparent)';

const H2_STYLE: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
  lineHeight: 1,
  color: 'var(--color-text)',
  marginTop: '3rem',
  marginBottom: '1rem',
  paddingTop: '2.5rem',
  borderTop: '1px solid rgba(26,111,212,0.12)',
};

const P_STYLE: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'clamp(0.95rem, 1.3vw, 1.05rem)',
  lineHeight: 1.8,
  color: MUTED,
  marginBottom: '1.1rem',
};

const UL_STYLE: CSSProperties = {
  ...P_STYLE,
  listStyleType: 'disc',
  paddingLeft: '1.4rem',
};

const LI_STYLE: CSSProperties = { marginBottom: '0.5rem' };

const MONO_LABEL: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.65rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--color-primary)',
};

export default function SafiriTripsPrivacyPage() {
  return (
    <main>
      <section
        className="relative overflow-hidden bg-[var(--color-bg)]"
        // Extra top padding clears the floating SiteNav (22px offset + 68px pill).
        style={{ padding: SECTION_PAD, paddingTop: 'calc(90px + clamp(3rem, 6vw, 6rem))' }}
      >
        <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />
        <div className="relative z-[1]" style={{ maxWidth: PROSE_WIDTH }}>
          <p style={MONO_LABEL}>Legal</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.75rem, 8vw, 7rem)',
              lineHeight: 0.9,
              color: 'var(--color-text)',
              margin: '1.25rem 0 1.5rem',
              overflowWrap: 'anywhere',
            }}
          >
            Safiri Trips Privacy Policy
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
            }}
          >
            Effective 19 November 2026
          </p>
        </div>
      </section>

      <section
        style={{
          background: 'var(--color-surface)',
          padding: 'clamp(3rem, 5vw, 5rem) clamp(1.25rem, 6vw, 8rem)',
        }}
      >
        <article style={{ maxWidth: PROSE_WIDTH }}>
          <p style={P_STYLE}>
            Safiri Trips is a free trip planning app for Kenya, made by Nesture-X, Nairobi, Kenya.
            This policy explains what the app does with your information. Questions: {mail}
          </p>

          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 style={H2_STYLE}>{section.heading}</h2>
              {section.blocks.map((block, i) =>
                block.type === 'p' ? (
                  <p key={i} style={P_STYLE}>
                    {block.content}
                  </p>
                ) : (
                  <ul key={i} style={UL_STYLE}>
                    {block.items.map((item) => (
                      <li key={item} style={LI_STYLE}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </article>
      </section>
    </main>
  );
}
