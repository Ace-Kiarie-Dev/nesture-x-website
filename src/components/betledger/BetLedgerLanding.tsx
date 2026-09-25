import {
  ArrowDown,
  BookOpen,
  Layers,
  LineChart,
  NotebookPen,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import WaitlistForm from './WaitlistForm';
import Faq from './Faq';
import {
  AnalyticsPhone,
  DashboardPhone,
  HabitsSidePhone,
  NewBetPhone,
  QuickLogSidePhone,
} from './PhoneMockups';

const HIGHLIGHTS = [
  { idx: '01 / SPEED',   title: 'Log',    sub: 'Bets in seconds',      Icon: NotebookPen, solid: false },
  { idx: '02 / CORE',    title: 'Track',  sub: 'Real profit and loss', Icon: LineChart,   solid: true  },
  { idx: '03 / ARCHIVE', title: 'Review', sub: 'Full bet history',     Icon: BookOpen,    solid: false },
  { idx: '04 / INSIGHT', title: 'Learn',  sub: 'Smart insights',       Icon: Sparkles,    solid: false },
];

function Feature({ Icon, title, body }: { Icon: typeof Zap; title: string; body: string }) {
  return (
    <div className="bl-feature bl-glass bl-lift">
      <span className="bl-feature-icon"><Icon size={20} aria-hidden="true" /></span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}

export default function BetLedgerLanding() {
  return (
    <main className="bl-main">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="bl-hero" aria-labelledby="bl-hero-title">
        <div className="bl-hero-copy">
          <span className="bl-pill bl-pill--gold bl-pill--dot">Coming soon on Google Play</span>
          <h1 id="bl-hero-title" className="bl-h1">
            Track Every Bet.
            <span className="bl-h1-accent">Know Your Numbers.</span>
          </h1>
          <p className="bl-lead">
            A simple bet tracker built for Kenyan sports bettors. Log your bets, see your real
            wins and losses, and understand your habits.
          </p>
          <WaitlistForm
            buttonLabel="Notify Me at Launch"
            note="We'll only contact you when BetLedger launches."
          />
        </div>

        <div className="bl-hero-visual">
          <span className="bl-ring bl-ring--sm" aria-hidden="true" />
          <span className="bl-ring bl-ring--lg" aria-hidden="true" />
          <div className="bl-fan">
            <QuickLogSidePhone className="bl-fan-side bl-fan-side--left" />
            <HabitsSidePhone className="bl-fan-side bl-fan-side--right" />
            <div className="bl-fan-front">
              <DashboardPhone className="bl-phone--glow" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Highlight cards ──────────────────────────────────────────── */}
      <section aria-label="What BetLedger does">
        <ul className="bl-highlights" role="list">
          {HIGHLIGHTS.map(({ idx, title, sub, Icon, solid }) => (
            <li key={idx} className={`bl-hl ${solid ? 'bl-hl--solid' : 'bl-glass bl-lift'}`}>
              <div className="bl-hl-top">
                <span className="bl-hl-idx">{idx}</span>
                <Icon size={22} aria-hidden="true" />
              </div>
              <div>
                <h2 className="bl-hl-title">{title}</h2>
                <p className="bl-hl-sub">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 3. Zigzag: quick logging (phone left on desktop) ────────────── */}
      <section className="bl-zig bl-zig--phone-left" aria-labelledby="bl-logging-title">
        <div className="bl-zig-copy">
          <span className="bl-eyebrow">Quick Logging</span>
          <h2 id="bl-logging-title" className="bl-h2">Log Every Bet in Seconds</h2>
          <p className="bl-lead">
            Record your stake, odds, and result in a few taps, so your ledger is always complete
            and accurate.
          </p>
          <div className="bl-features">
            <Feature Icon={Zap} title="Quick Entry" body="Add stake, odds, and outcome in a few taps." />
            <Feature
              Icon={Layers}
              title="Any Market"
              body="Track singles, multibets, and any bet type across football, basketball, and more."
            />
          </div>
          <a href="#waitlist" className="bl-btn bl-btn--ghost" style={{ marginTop: '0.5rem' }}>
            Join the Waitlist
            <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="bl-zig-visual">
          <span className="bl-zig-deco bl-zig-deco--tl" aria-hidden="true" />
          <NewBetPhone className="bl-phone--tilt-left" />
        </div>
      </section>

      {/* ── 4. Zigzag: honest numbers (phone right on desktop) ──────────── */}
      <section className="bl-zig" aria-labelledby="bl-numbers-title">
        <div className="bl-zig-copy">
          <span className="bl-eyebrow">Honest Numbers</span>
          <h2 id="bl-numbers-title" className="bl-h2">See Where Your Money Really Goes</h2>
          <p className="bl-lead">
            It&apos;s easy to remember one big win and forget the small losses. BetLedger adds it
            all up, so you see your true position.
          </p>
          <div className="bl-features">
            <Feature
              Icon={Scale}
              title="True P/L"
              body="Your real net position, not just the wins you remember."
            />
            <Feature
              Icon={TrendingUp}
              title="Insights"
              body="Spot patterns in your stakes, markets, and results."
            />
          </div>
        </div>
        <div className="bl-zig-visual">
          <span className="bl-zig-deco bl-zig-deco--br" aria-hidden="true" />
          <AnalyticsPhone className="bl-phone--tilt-right" />
        </div>
      </section>

      {/* ── 5. Responsible tracking ─────────────────────────────────────── */}
      <section className="bl-narrow" aria-label="Responsible tracking">
        <div className="bl-band bl-glass">
          <span className="bl-band-icon"><ShieldCheck size={26} aria-hidden="true" /></span>
          <div>
            <div className="bl-band-head">
              <span className="bl-band-label">Responsible Tracking</span>
              <span className="bl-pill bl-pill--coral">18+ Only</span>
            </div>
            <p>
              BetLedger is a tracking and personal budgeting tool, not a betting platform or
              bookmaker. We don&apos;t accept bets or handle money. Bet responsibly.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ──────────────────────────────────────────────────────── */}
      <section className="bl-narrow" aria-labelledby="bl-faq-title">
        <div className="bl-faq-head">
          <span className="bl-eyebrow">FAQ</span>
          <h2 id="bl-faq-title" className="bl-h2">Questions, answered</h2>
        </div>
        <Faq />
      </section>

      {/* ── 7. Final CTA ────────────────────────────────────────────────── */}
      <section className="bl-narrow" aria-labelledby="bl-cta-title">
        <div id="waitlist" className="bl-cta bl-glass">
          <span className="bl-pill bl-pill--gold bl-pill--dot">Early Access</span>
          <h2 id="bl-cta-title" className="bl-h2">Be the first to know when BetLedger launches.</h2>
          <p className="bl-lead">
            Join the waitlist and we&apos;ll notify you as soon as BetLedger is available on
            Google Play.
          </p>
          <WaitlistForm buttonLabel="Notify Me" />
          <div className="bl-cta-foot">
            <Link href="/legal/betledger/privacy" className="bl-text-link">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
