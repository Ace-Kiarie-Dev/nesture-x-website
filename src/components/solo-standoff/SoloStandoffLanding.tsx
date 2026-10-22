import Image from 'next/image';
import DemoBoard from './DemoBoard';
import PlayBadge from './PlayBadge';

const ART = '/images/solo-standoff';

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
    </main>
  );
}
