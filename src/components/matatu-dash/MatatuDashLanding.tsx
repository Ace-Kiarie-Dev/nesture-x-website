import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeftRight,
  Bike,
  Check,
  CloudRain,
  Crown,
  Globe,
  LockOpen,
  Medal,
  Megaphone,
  Play,
  Store,
  Van,
} from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import Faq from './Faq';

// The Matatu Dash app policy doesn't exist yet; the site-wide policy covers
// the launch waitlist.
const PRIVACY_HREF = '/privacy-policy';

// lucide has no sneaker, so this one is drawn in the same 24px / 2px-stroke style.
function SneakerIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 10a2 2 0 0 1 2-2l3 .5L8 7h3l3 5 5.2 1.07A3.5 3.5 0 0 1 22 16.5v.5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
      <path d="M2 15h20" />
      <path d="M10 9.5l1.5-1" />
      <path d="M11.5 11.5l1.5-1" />
    </svg>
  );
}

// Every game illustration carries this badge; the logos never do.
function ConceptArt() {
  return <span className="md-concept">CONCEPT ART</span>;
}

const HOW_TO_PLAY = [
  { icon: <SneakerIcon />,               tone: 'teal',  title: 'TAP TO HOP',           body: 'Tap to hop forward, one step at a time.' },
  { icon: <ArrowLeftRight size={24} />,  tone: 'gold',  title: 'SWIPE TO SIDESTEP',    body: 'Swipe left or right to change lanes.' },
  { icon: <Van size={24} />,             tone: 'coral', title: 'DODGE TRAFFIC',        body: "Matatus, bodabodas, and hawkers won't wait for you." },
  { icon: <Crown size={24} />,           tone: 'gold',  title: 'BEAT YOUR HIGH SCORE', body: 'Go further, grab coins, and set a new record.' },
] as const;

const LANES = [
  {
    title: 'LANE 01 · MATATU LANE',
    tag: 'FAST & RELENTLESS',
    tone: 'coral',
    body: 'Fast and relentless. Time your hop or get flattened.',
    image: { src: '/images/matatu-dash/obstacle-matatu.webp', width: 1280, height: 720, alt: 'Concept art of a yellow matatu covered in colourful Nairobi graffiti' },
  },
  {
    title: 'LANE 02 · BODABODA LANE',
    tag: 'ZIG-ZAG',
    tone: 'gold',
    body: "They zig. They zag. Nobody knows where they're going.",
    image: { src: '/images/matatu-dash/obstacle-bodaboda.webp', width: 1024, height: 1024, alt: 'Concept art of a bodaboda rider in a hi-vis vest on a red motorbike' },
  },
  {
    title: 'LANE 03 · HAWKER ROW',
    tag: 'SLOW BUT SNEAKY',
    tone: 'teal',
    body: 'Slow moving carts. Easy to underestimate.',
    image: { src: '/images/matatu-dash/obstacle-hawker.webp', width: 1024, height: 1024, alt: 'Concept art of a hawker pushing a fruit cart under a striped umbrella' },
  },
  {
    title: 'LANE 04 · SAFE ISLAND',
    tag: 'REST STOP',
    tone: 'muted',
    body: "Catch your breath. It won't last.",
    image: null,
  },
] as const;

const TIERS = [
  { name: 'CHILL',     tone: 'teal',  body: 'Light traffic. Find your rhythm.' },
  { name: 'RUSH HOUR', tone: 'gold',  body: 'More matatus, tighter gaps.' },
  { name: 'MADNESS',   tone: 'coral', body: "Full Nairobi chaos. One slip and it's over." },
] as const;

const RUNNER_CHIPS = ['BODY', 'OUTFIT', 'ACCESSORY', 'COLOUR'];
const RUNNER_POINTS = [
  'Mix and match layers to make your runner yours',
  'Unlock new characters and skins as you play',
];

const SOUNDS = [
  { icon: Megaphone, label: 'CONDUCTORS', tone: 'gold'  },
  { icon: Bike,      label: 'BODABODAS',  tone: 'teal'  },
  { icon: Store,     label: 'HAWKERS',    tone: 'coral' },
  { icon: CloudRain, label: 'RAIN',       tone: 'teal'  },
] as const;

// Bar heights (%) for the decorative waveform.
const WAVE = [30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 25, 65, 90, 40, 75, 55, 85, 30, 60, 95, 45, 70, 35, 80, 50, 65, 100, 40, 75, 30, 55, 85];

const BOARD_FEATURES = [
  { icon: Globe,    tone: 'teal',  title: 'GLOBAL LEADERBOARD', body: 'See how you rank against every player.' },
  { icon: Medal,    tone: 'gold',  title: 'PERSONAL BEST',      body: 'Beat your own record, run after run.' },
  { icon: LockOpen, tone: 'coral', title: 'UNLOCKABLES',        body: 'Earn new characters and skins as you play.' },
] as const;

const DASHERS = [
  { rank: 1, name: 'Wanjiku_Speedster', distance: '4,820m' },
  { rank: 2, name: 'Omondi_Hop',        distance: '4,315m' },
  { rank: 3, name: 'Kip_Dasher',        distance: '3,980m' },
  { rank: 4, name: 'Mwangi_Dash',       distance: '3,640m' },
];

export default function MatatuDashLanding() {
  return (
    <main className="md-main">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="md-section md-hero" aria-labelledby="md-hero-title">
        <div className="md-container md-hero-grid">
          <div className="md-hero-copy">
            <Image
              src="/images/originals/matatu-dash-logo.png"
              alt="Matatu Dash logo"
              width={1115}
              height={964}
              className="md-hero-logo"
              sizes="(min-width: 1024px) 300px, 220px"
              preload
            />
            <span className="md-pill md-pill--gold">
              <Play size={12} fill="currentColor" aria-hidden="true" />
              COMING TO GOOGLE PLAY
            </span>
            <h1 id="md-hero-title" className="md-h1">
              SURVIVE{' '}
              <span className="md-gold">NAIROBI&apos;S STREETS.</span>
            </h1>
            <p className="md-lead">
              Hop through matatu lanes, dodge bodabodas, and weave past hawkers. How far can you go?
            </p>
            <WaitlistForm note="We'll only email you when Matatu Dash launches." />
          </div>

          <div className="md-hero-visual">
            <div className="md-hazard-frame">
              <div className="md-art md-art--key">
                <Image
                  src="/images/matatu-dash/key-art.webp"
                  alt="Matatu Dash concept art: a runner in a yellow hoodie leaps across a Nairobi road at dusk as a matatu and a bodaboda speed past"
                  width={1600}
                  height={900}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  preload
                />
                <ConceptArt />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. How to play ──────────────────────────────────────────────── */}
      <section className="md-section" aria-labelledby="md-play-title">
        <div className="md-container">
          <div className="md-head md-head--track">
            <h2 id="md-play-title" className="md-h2">HOW TO PLAY</h2>
            <span className="md-track" aria-hidden="true"><span /></span>
          </div>
          <ul className="md-play-grid">
            {HOW_TO_PLAY.map(card => (
              <li key={card.title} className="md-card md-play-card">
                <span className={`md-icon-tile md-tone--${card.tone}`} aria-hidden="true">{card.icon}</span>
                <h3 className="md-h3">{card.title}</h3>
                <p className="md-body">{card.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 3. The streets ──────────────────────────────────────────────── */}
      <section className="md-section" aria-labelledby="md-lanes-title">
        <div className="md-container">
          <div className="md-head md-head--center">
            <h2 id="md-lanes-title" className="md-h2">EVERY LANE IS A NEW CHALLENGE</h2>
            <p className="md-lead">Nairobi&apos;s roads are alive. Each lane has its own rhythm.</p>
          </div>
          <ol className="md-lanes">
            {LANES.map((lane, i) => (
              <li key={lane.title} className="md-lane-item">
                {i > 0 && <span className="md-lane-dashes" aria-hidden="true" />}
                <article className="md-card md-lane" data-flip={i % 2 === 1}>
                  <div className="md-lane-copy">
                    <span className={`md-tag md-tag--${lane.tone}`}>{lane.tag}</span>
                    <h3 className="md-h3 md-lane-title">{lane.title}</h3>
                    <p className="md-body">{lane.body}</p>
                  </div>
                  <div className="md-lane-media">
                    {lane.image ? (
                      <div className="md-art md-art--lane">
                        <Image
                          src={lane.image.src}
                          alt={lane.image.alt}
                          width={lane.image.width}
                          height={lane.image.height}
                          sizes="(min-width: 1024px) 460px, 100vw"
                        />
                        <ConceptArt />
                      </div>
                    ) : (
                      <div className="md-island" aria-hidden="true">
                        <span className="md-island-road md-island-road--top" />
                        <span className="md-island-kerb" />
                        <span className="md-island-pave" />
                        <span className="md-island-kerb" />
                        <span className="md-island-road md-island-road--bottom" />
                      </div>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 4. It gets harder ───────────────────────────────────────────── */}
      <section className="md-section" aria-labelledby="md-speed-title">
        <div className="md-container">
          <div className="md-panel md-speed">
            <div className="md-head">
              <h2 id="md-speed-title" className="md-h2">
                THE FURTHER YOU GO,{' '}
                <span className="md-gold">THE FASTER IT GETS</span>
              </h2>
              <p className="md-lead">Every step forward makes the traffic faster and busier.</p>
            </div>
            <div className="md-speedbar" aria-hidden="true">
              <span className="md-speedbar-fill" />
            </div>
            <ol className="md-tiers">
              {TIERS.map(tier => (
                <li key={tier.name} className={`md-card md-tier md-tier--${tier.tone}`}>
                  <span className="md-tier-bar" aria-hidden="true" />
                  <h3 className="md-h3 md-tier-name">{tier.name}</h3>
                  <p className="md-body">{tier.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 5. Build your own runner ────────────────────────────────────── */}
      <section className="md-section" aria-labelledby="md-runner-title">
        <div className="md-container md-split">
          <div className="md-split-copy">
            <h2 id="md-runner-title" className="md-h2">BUILD YOUR OWN RUNNER</h2>
            <p className="md-lead">
              Pick your body, outfit, accessories, and colours, then take your character to the streets.
            </p>
            <ul className="md-chips">
              {RUNNER_CHIPS.map((chip, i) => (
                <li key={chip} className="md-chip" data-active={i === 0}>{chip}</li>
              ))}
            </ul>
            <ul className="md-checklist">
              {RUNNER_POINTS.map(point => (
                <li key={point}>
                  <span className="md-check" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="md-split-visual">
            <div className="md-art md-art--lineup">
              <Image
                src="/images/matatu-dash/characters-lineup.webp"
                alt="Concept art of four Matatu Dash runners: a teen in a yellow hoodie, an office worker with a briefcase, a woman in a kitenge dress, and a jogger in a green tracksuit"
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 600px, 100vw"
              />
              <ConceptArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Sounds of the city ───────────────────────────────────────── */}
      <section className="md-section" aria-labelledby="md-sound-title">
        <div className="md-container">
          <div className="md-panel md-sound">
            <span className="md-pill md-pill--coral">
              <span className="md-rec-dot" aria-hidden="true" />
              RECORDING IN PROGRESS
            </span>
            <h2 id="md-sound-title" className="md-h2">SOUNDED BY THE REAL STREETS</h2>
            <p className="md-lead">
              We&apos;re recording real Nairobi sounds for Matatu Dash: conductors calling out routes,
              bodaboda hoots, hawkers, and rain on the tarmac.
            </p>
            <div className="md-wave" aria-hidden="true">
              {WAVE.map((h, i) => (
                <span key={i} style={{ height: `${h}%`, animationDelay: `${(i % 8) * -0.15}s` }} />
              ))}
            </div>
            <ul className="md-sound-chips">
              {SOUNDS.map(({ icon: Icon, label, tone }) => (
                <li key={label} className="md-sound-chip">
                  <Icon size={20} className={`md-tone-text--${tone}`} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 7. Climb the leaderboard ────────────────────────────────────── */}
      <section className="md-section" aria-labelledby="md-board-title">
        <div className="md-container md-split">
          <div className="md-split-copy">
            <h2 id="md-board-title" className="md-h2">CLIMB THE LEADERBOARD</h2>
            <p className="md-lead">Every run counts. See how far you can go compared to everyone else.</p>
            <ul className="md-board-features">
              {BOARD_FEATURES.map(({ icon: Icon, tone, title, body }) => (
                <li key={title} className="md-card md-board-feature">
                  <Icon size={24} className={`md-tone-text--${tone}`} aria-hidden="true" />
                  <h3 className="md-h3 md-h3--sm">{title}</h3>
                  <p className="md-body md-body--sm">{body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="md-split-visual">
            <div className="md-board" aria-hidden="true">
              <p className="md-board-title">TOP DASHERS</p>
              <ol className="md-board-rows">
                {DASHERS.map(row => (
                  <li key={row.rank} className="md-board-row" data-rank={row.rank}>
                    <span className="md-board-rank">{row.rank}</span>
                    <span className="md-board-name">{row.name}</span>
                    <span className="md-board-dist">{row.distance}</span>
                  </li>
                ))}
                <li className="md-board-row md-board-row--you">
                  <span className="md-board-rank" />
                  <span className="md-board-name">You · Ready to dash?</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ──────────────────────────────────────────────────────── */}
      <section className="md-section" aria-labelledby="md-faq-title">
        <div className="md-container">
          <div className="md-head md-head--center">
            <h2 id="md-faq-title" className="md-h2">FREQUENTLY ASKED QUESTIONS</h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* ── 9. Final CTA ────────────────────────────────────────────────── */}
      <section id="waitlist" className="md-section md-final" aria-labelledby="md-final-title">
        <div className="md-container">
          <div className="md-final-card">
            <div className="md-art md-art--hop">
              <Image
                src="/images/matatu-dash/character-hop.webp"
                alt="Concept art of the Matatu Dash runner mid-hop in a yellow hoodie and red sneakers"
                width={1024}
                height={1024}
                sizes="(min-width: 1024px) 240px, 150px"
              />
              <ConceptArt />
            </div>
            <div className="md-final-inner">
              <p className="md-kicker">HOP • DODGE • KEEP GOING</p>
              <h2 id="md-final-title" className="md-h2">READY TO DASH?</h2>
              <p className="md-lead">Be the first to play when Matatu Dash launches.</p>
              <WaitlistForm />
              <Link href={PRIVACY_HREF} className="md-text-link">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
