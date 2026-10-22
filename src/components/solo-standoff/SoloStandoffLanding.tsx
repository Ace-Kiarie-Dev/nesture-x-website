import Image from 'next/image';
import { Boxes, CalendarDays, CloudUpload, Flame, ShieldCheck, Star } from 'lucide-react';
import DemoBoard from './DemoBoard';
import MechanicsGrid from './MechanicsGrid';
import PlayBadge from './PlayBadge';
import ScreenshotCarousel from './ScreenshotCarousel';

const ART = '/images/solo-standoff';

const FEATURES = [
  {
    Icon: CalendarDays,
    title: 'Daily Challenge',
    body: 'A new puzzle every day. Gentle on Monday, brutal on Sunday. See where you rank.',
  },
  {
    Icon: Boxes,
    title: 'The Props Tray',
    body: 'Some puzzles hand you the props. You decide where the mirror, wall, barrel and portal go.',
  },
  {
    Icon: ShieldCheck,
    title: 'Verified scores',
    body: 'Every clear is replayed on our servers. No fake scores, fair rankings.',
  },
  {
    Icon: Flame,
    title: 'Streaks and coins',
    body: 'Clear the Daily on back to back days to build a streak. Coins unlock agent skins and avatars.',
  },
  {
    Icon: Star,
    title: '3 stars per mission',
    body: 'Clear it, match par, and do it without failing once.',
  },
  {
    Icon: CloudUpload,
    title: 'Back up with Google',
    body: 'Play as a guest, or keep your progress and restore it on a new phone.',
  },
];

const RULES = [
  {
    n: '01',
    title: 'Tap to fire',
    body: 'A character shoots in the direction they face. No aiming, no timing. Just order.',
    src: `${ART}/characters/agent_down.webp`,
    w: 788,
    h: 788,
    pose: false,
  },
  {
    n: '02',
    title: 'Plan the chain',
    body: 'Shots bounce, explode and teleport. One bullet can finish a whole rooftop if you set it up right.',
    src: `${ART}/characters/thug_pose_standing.webp`,
    w: 586,
    h: 1200,
    pose: true,
  },
  {
    n: '03',
    title: 'Clear it in par',
    body: 'Take down every thug, never hit a hostage, and use as few taps as the level allows.',
    src: `${ART}/characters/hostage_down.webp`,
    w: 788,
    h: 788,
    pose: false,
  },
];

export default function SoloStandoffLanding() {
  return (
    <main className="ss-main">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="ss-hero" aria-labelledby="ss-hero-title">
        <div className="ss-hero-bg" aria-hidden="true">
          <Image src={`${ART}/brand/bg_rooftop.webp`} alt="" fill sizes="100vw" preload />
        </div>

        <div className="ss-wrap ss-hero-grid">
          <div className="ss-hero-copy">
            <Image
              src={`${ART}/brand/logo_solo_standoff.webp`}
              alt="Solo Standoff"
              width={1200}
              height={384}
              sizes="(min-width: 960px) 440px, 80vw"
              className="ss-hero-logo"
              preload
            />
            <h1 id="ss-hero-title" className="ss-h1">
              Think first. Then <span className="ss-gold">fire.</span>
            </h1>
            <p className="ss-lead">
              A rooftop standoff puzzle. Tap a character and they fire straight ahead. Work out the
              right order to take down every thug, keep the hostages safe, and do it in as few taps
              as possible.
            </p>
            <PlayBadge />
          </div>

          <div className="ss-hero-demo">
            <DemoBoard />
          </div>
        </div>
      </section>

      {/* ── 2. How to play ──────────────────────────────────────────────── */}
      <section className="ss-section" aria-labelledby="ss-rules-title">
        <div className="ss-wrap">
          <div className="ss-section-head">
            <span className="ss-eyebrow">How to play</span>
            <h2 id="ss-rules-title" className="ss-h2">
              Three rules, then it gets hard
            </h2>
          </div>
          <ol className="ss-rules">
            {RULES.map((rule) => (
              <li key={rule.n} className="ss-card ss-rule">
                <span className="ss-rule-n" aria-hidden="true">
                  {rule.n}
                </span>
                <Image
                  src={rule.src}
                  alt=""
                  width={rule.w}
                  height={rule.h}
                  sizes="160px"
                  className={`ss-rule-art ${rule.pose ? 'ss-rule-art--pose' : ''}`}
                />
                <h3 className="ss-h3">{rule.title}</h3>
                <p>{rule.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 3. Mechanics ────────────────────────────────────────────────── */}
      <section className="ss-section ss-section--panel" aria-labelledby="ss-mech-title">
        <div className="ss-wrap">
          <div className="ss-section-head">
            <span className="ss-eyebrow">Mechanics</span>
            <h2 id="ss-mech-title" className="ss-h2">
              Know your rooftop
            </h2>
            <p>Every piece changes where a bullet goes.</p>
          </div>
          <MechanicsGrid />
        </div>
      </section>

      {/* ── 4. Features ─────────────────────────────────────────────────── */}
      <section className="ss-section" aria-labelledby="ss-features-title">
        <div className="ss-wrap">
          <div className="ss-section-head">
            <span className="ss-eyebrow">What&apos;s inside</span>
            <h2 id="ss-features-title" className="ss-h2">
              Seventy missions and a new one every morning
            </h2>
          </div>
          <ul className="ss-features">
            <li className="ss-card ss-feature ss-feature--big">
              <span className="ss-feature-big" aria-hidden="true">
                70
              </span>
              <div>
                <h3 className="ss-h3">70 missions</h3>
                <p>Three chapters: Training, Hard Targets, and the Workshop finale.</p>
              </div>
            </li>
            {FEATURES.map(({ Icon, title, body }) => (
              <li key={title} className="ss-card ss-feature">
                <span className="ss-feature-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="ss-h3">{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. Screenshots ──────────────────────────────────────────────── */}
      <section className="ss-section ss-section--panel" aria-labelledby="ss-shots-title">
        <div className="ss-wrap">
          <div className="ss-section-head">
            <span className="ss-eyebrow">Screenshots</span>
            <h2 id="ss-shots-title" className="ss-h2">
              Six screens from the rooftop
            </h2>
          </div>
          <ScreenshotCarousel />
        </div>
      </section>
    </main>
  );
}
