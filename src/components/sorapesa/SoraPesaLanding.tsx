import Link from 'next/link';
import {
  Bus,
  CalendarClock,
  Check,
  CircleHelp,
  FileText,
  Lightbulb,
  Lock,
  Receipt,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import Faq, { PRIVACY_HREF } from './Faq';
import { OverviewPhone, SalaryStoryPhone, SideHustlePhone } from './PhoneMockups';

const STEPS = [
  { title: 'Track',      body: 'What came in, what went out.'  },
  { title: 'Understand', body: 'See exactly where it went.'    },
  { title: 'Learn',      body: 'Spot your spending patterns.'  },
  { title: 'Guide',      body: 'Make better money decisions.'  },
];

const FEATURES = [
  {
    tone: 'indigo',
    Icon: FileText,
    title: 'M-Pesa Statement Import',
    body: 'Import your last 1 to 3 months of statements. SoraPesa sorts your transactions automatically, and you review the rest.',
    foot: 'You choose what to import · No SMS access',
  },
  {
    tone: 'purple',
    Icon: TrendingUp,
    title: 'Side Hustle Tracking',
    body: 'Log orders, revenue, and costs for your business, and see your real profit.',
    foot: 'Orders · Costs · Real profit',
  },
  {
    tone: 'navy',
    Icon: CalendarClock,
    title: 'Bills and Recurring Costs',
    body: "SoraPesa spots your regular payments so you always know what's coming.",
    foot: 'Upcoming bills · No surprises',
  },
];

const HUSTLE_POINTS = [
  'Track ingredient, packaging, and delivery costs per order',
  'See which orders are actually profitable',
  'Keep business money separate from personal spending',
];

const INSIGHTS = [
  { Icon: Bus,       text: 'You spent 24% more on transport this month.'         },
  { Icon: Receipt,   text: "You've paid KES 640 in transaction fees this month." },
  { Icon: Lightbulb, text: 'Your electricity bill usually averages KES 2,100.'   },
];

const PRIVACY_POINTS = [
  'We never read your SMS messages.',
  'You choose exactly which statements to import.',
  'Delete your data or account anytime.',
];

export default function SoraPesaLanding() {
  return (
    <main>
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="sp-section sp-hero" aria-labelledby="sp-hero-title">
        <div className="sp-orb sp-orb--hero" aria-hidden="true" />
        <div className="sp-container sp-hero-grid">
          <div className="sp-hero-copy">
            <span className="sp-pill"><span className="sp-pill-dot" aria-hidden="true" />Coming soon on Google Play</span>
            <h1 id="sp-hero-title" className="sp-h1">
              Open the Door to{' '}
              <br />
              <span className="sp-gradient-text">Smarter Money.</span>
            </h1>
            <p className="sp-lead">
              The money app for young Kenyans figuring out life. Track your salary, bills, and side
              hustles, and finally see where your money goes.
            </p>
            <WaitlistForm
              buttonLabel="Notify Me at Launch"
              note="We'll only email you when SoraPesa launches."
            />
          </div>

          <div className="sp-hero-visual">
            <span className="sp-shape sp-shape--a" aria-hidden="true" />
            <span className="sp-shape sp-shape--b" aria-hidden="true" />
            <span className="sp-ring" aria-hidden="true" />
            <div className="sp-phone-stage">
              <OverviewPhone className="sp-phone--tilt" />
              <span className="sp-chip sp-chip--auto" aria-hidden="true">
                Auto-categorised <Check size={14} strokeWidth={3} className="sp-chip-check" />
              </span>
              <span className="sp-chip sp-chip--hustle" aria-hidden="true">
                Side hustle <span className="sp-chip-positive">+KES 18,500</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The problem ──────────────────────────────────────────────── */}
      <section className="sp-section sp-section--white sp-section--bordered" aria-labelledby="sp-problem-title">
        <div className="sp-container sp-container--sm sp-problem">
          <span className="sp-icon-tile" aria-hidden="true"><CircleHelp size={26} /></span>
          <h2 id="sp-problem-title" className="sp-h2">Salary came in. Then… where did it go?</h2>
          <p className="sp-lead">
            Salary, M-Pesa, cash, bills, fees, side hustles. It&apos;s a lot to keep track of.
            SoraPesa brings it all into one clear picture.
          </p>
          <div className="sp-compare">
            <div className="sp-compare-card sp-compare-card--without">
              <X size={20} className="sp-compare-icon" aria-hidden="true" />
              <div>
                <span className="sp-compare-label">Without SoraPesa</span>
                <span className="sp-compare-text">End-of-month mystery and guesswork</span>
              </div>
            </div>
            <div className="sp-compare-card sp-compare-card--with">
              <Sparkles size={20} className="sp-compare-icon" aria-hidden="true" />
              <div>
                <span className="sp-compare-label">With SoraPesa</span>
                <span className="sp-compare-text">A clear picture of every shilling</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. How it works ─────────────────────────────────────────────── */}
      <section className="sp-section sp-section--bg" aria-labelledby="sp-how-title">
        <div className="sp-container sp-container--md">
          <div className="sp-section-head">
            <span className="sp-eyebrow">How it works</span>
            <h2 id="sp-how-title" className="sp-h2">Four simple steps to clarity</h2>
          </div>
          <ol className="sp-steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="sp-step">
                <span className="sp-step-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 4. Signature feature (phone left on desktop) ────────────────── */}
      <section className="sp-section sp-section--tint" aria-labelledby="sp-salary-title">
        <div className="sp-container sp-split sp-split--visual-left">
          <div className="sp-copy">
            <span className="sp-eyebrow">Signature feature</span>
            <h2 id="sp-salary-title" className="sp-h2">See the Story of Your Salary</h2>
            <p className="sp-lead">
              When your salary lands, SoraPesa shows what&apos;s already committed and what&apos;s
              truly yours to spend, then tracks it through the month.
            </p>
            <div className="sp-check-card">
              <span className="sp-check-tile" aria-hidden="true"><Check size={20} strokeWidth={3} /></span>
              No mental maths. See what&apos;s truly yours from day one.
            </div>
          </div>
          <div className="sp-split-visual">
            <SalaryStoryPhone />
          </div>
        </div>
      </section>

      {/* ── 5. Feature cards ────────────────────────────────────────────── */}
      <section className="sp-section sp-section--white" aria-labelledby="sp-features-title">
        <div className="sp-container">
          <div className="sp-section-head">
            <span className="sp-eyebrow">Core capabilities</span>
            <h2 id="sp-features-title" className="sp-h2">Built for your daily flow</h2>
          </div>
          <ul className="sp-features" role="list">
            {FEATURES.map(({ tone, Icon, title, body, foot }) => (
              <li key={title} className={`sp-feature sp-feature--${tone}`}>
                <div>
                  <span className="sp-feature-icon" aria-hidden="true"><Icon size={24} /></span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
                <p className="sp-feature-foot">{foot}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 6. Side hustle spotlight (phone right on desktop) ───────────── */}
      <section className="sp-section sp-section--bg" aria-labelledby="sp-hustle-title">
        <div className="sp-container sp-split">
          <div className="sp-copy">
            <span className="sp-eyebrow sp-eyebrow--purple">Hustle smarter</span>
            <h2 id="sp-hustle-title" className="sp-h2">Your Side Hustle Is a Business. Track It Like One.</h2>
            <p className="sp-lead">
              From baking to design to reselling, see your revenue, costs, and real profit for every order.
            </p>
            <ul className="sp-bullets">
              {HUSTLE_POINTS.map((point, i) => (
                <li key={point}>
                  <span className="sp-bullet-num" aria-hidden="true">{i + 1}</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="sp-split-visual">
            <SideHustlePhone />
          </div>
        </div>
      </section>

      {/* ── 7. Insights ─────────────────────────────────────────────────── */}
      <section className="sp-section sp-section--fade" aria-labelledby="sp-insights-title">
        <div className="sp-container sp-container--md sp-center">
          <div className="sp-section-head">
            <span className="sp-eyebrow">Smart discovery</span>
            <h2 id="sp-insights-title" className="sp-h2">Insights That Actually Make Sense</h2>
          </div>
          <ul className="sp-insights" role="list">
            {INSIGHTS.map(({ Icon, text }) => (
              <li key={text} className="sp-insight">
                <span className="sp-icon-tile" aria-hidden="true"><Icon size={22} /></span>
                <p>&ldquo;{text}&rdquo;</p>
              </li>
            ))}
          </ul>
          <p className="sp-insight-foot">No judgement. Just clear numbers.</p>
        </div>
      </section>

      {/* ── 8. Privacy band ─────────────────────────────────────────────── */}
      <section className="sp-section sp-section--navy" aria-labelledby="sp-privacy-title">
        <div className="sp-container sp-container--md">
          <div className="sp-privacy-top">
            <div>
              <span className="sp-privacy-pill"><Lock size={14} aria-hidden="true" />Zero SMS Access</span>
              <h2 id="sp-privacy-title" className="sp-h2">Your Money. Your Data. Your Control.</h2>
            </div>
            <p className="sp-privacy-side">SoraPesa is built with respect for your privacy from day one.</p>
          </div>
          <ul className="sp-privacy-points">
            {PRIVACY_POINTS.map(point => (
              <li key={point}>
                <span className="sp-privacy-check" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
      <section className="sp-section sp-section--white" aria-labelledby="sp-faq-title">
        <div className="sp-container sp-container--sm">
          <div className="sp-section-head">
            <span className="sp-eyebrow">Frequently asked questions</span>
            <h2 id="sp-faq-title" className="sp-h2">Got questions? We&apos;re clear.</h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* ── 10. Final CTA ───────────────────────────────────────────────── */}
      <section className="sp-section sp-section--bg" aria-labelledby="sp-cta-title">
        <div className="sp-container sp-container--md">
          <div id="waitlist" className="sp-cta">
            <span className="sp-cta-lock" aria-hidden="true"><Lock size={22} /></span>
            <h2 id="sp-cta-title" className="sp-h2">Be the first to know when SoraPesa launches.</h2>
            <p className="sp-cta-body">
              Join the waitlist and we&apos;ll let you know as soon as SoraPesa is on Google Play.
            </p>
            <WaitlistForm buttonLabel="Notify Me" variant="onGradient" />
            <Link href={PRIVACY_HREF} className="sp-cta-link">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
