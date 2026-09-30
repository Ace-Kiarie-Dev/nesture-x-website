import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarClock,
  Check,
  ChartNoAxesColumn,
  IdCard,
  LayoutDashboard,
  QrCode,
  Smartphone,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import Faq from './Faq';
import FoundingGymLink from './FoundingGymLink';
import {
  DashboardLaptop,
  HeatmapLaptop,
  HeroRankPhone,
  LeaderboardPhone,
  PaymentPhone,
  ProfilePhone,
} from './Mockups';

// Kikota's app policy is still placeholder content, so the waitlist links to
// the site-wide policy (which covers the launch waitlist) until it's written.
const PRIVACY_HREF = '/privacy-policy';

const LAYERS = [
  {
    num: '01',
    title: 'OPERATIONS',
    body: 'Everything you need to run your gym day to day.',
    tags: ['Check-ins', 'M-Pesa Payments', 'Owner Dashboard', 'Attendance Reports', 'Progress Tracking'],
    active: false,
  },
  {
    num: '02',
    title: 'NETWORK',
    body: 'A fitness community that connects your members across gyms.',
    tags: ['Tournaments', 'Leaderboards', 'Member Profiles'],
    active: true,
  },
];

const OPERATIONS = [
  { icon: QrCode,          title: 'Member Check-ins',   body: "Members check in with a QR code at the desk, so you always know who's in." },
  { icon: Smartphone,      title: 'M-Pesa Payments',    body: 'Members renew straight from their phones with an M-Pesa payment prompt.' },
  { icon: LayoutDashboard, title: 'Owner Dashboard',    body: 'Members, revenue, and renewals at a glance.' },
  { icon: CalendarClock,   title: 'Attendance Reports', body: 'See your busiest days and quietest hours, and plan around them.' },
  { icon: TrendingUp,      title: 'Progress Tracking',  body: 'Help members see their results and stay motivated.' },
];

const PAYMENT_POINTS = [
  "M-Pesa payment prompts sent straight to members' phones",
  'Payments recorded in your dashboard automatically',
  'Less cash to handle and fewer payments to chase',
];

const NETWORK = [
  { icon: Trophy,            title: 'Cross-Gym Tournaments',  body: 'Challenges that bring gyms across the city together.' },
  { icon: ChartNoAxesColumn, title: 'Inter-Gym Leaderboards', body: "Your gym's name on the board, ranked against gyms across the city." },
  { icon: IdCard,            title: 'Member Profiles',        body: 'Progress that follows members wherever they train on the network.' },
];

const IMPACT = [
  { title: 'RETAIN',  body: 'Members who compete have a reason to keep coming back.' },
  { title: 'COMPETE', body: "Put your gym on the city's leaderboard and build real club pride." },
  { title: 'GROW',    body: 'Get your gym seen by members across the network.' },
];

const STEPS = [
  { num: '01', title: 'SET UP YOUR GYM',    body: 'Add your membership plans, pricing, and members.' },
  { num: '02', title: 'START CHECKING IN',  body: 'Track attendance with QR check-ins and collect M-Pesa payments.' },
  { num: '03', title: 'JOIN THE NETWORK',   body: 'Enter tournaments and climb the city leaderboard.' },
];

const FOUNDING_POINTS = [
  'Free during the pilot',
  'Early access to every feature',
  'Help shape what we build next',
];

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="kk-checklist">
      {items.map(item => (
        <li key={item}>
          <span className="kk-check" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function KikotaLanding() {
  return (
    <main className="kk-main">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="kk-section kk-hero" aria-labelledby="kk-hero-title">
        <span className="kk-glow kk-glow--hero" aria-hidden="true" />
        <div className="kk-container kk-hero-grid">
          <div className="kk-hero-copy">
            <div className="kk-lockup">
              <Image
                src="/images/originals/kikota-icon.png"
                alt="Kikota logo"
                width={356}
                height={324}
                className="kk-lockup-icon"
                priority
              />
              <span className="kk-lockup-name">Kikota</span>
            </div>
            <span className="kk-pill"><span className="kk-pill-dot" aria-hidden="true" />COMING SOON · FOUNDING GYMS WANTED</span>
            <h1 id="kk-hero-title" className="kk-h1">
              RUN YOUR GYM.{' '}
              <span className="kk-accent">NOT YOUR PAPERWORK.</span>
            </h1>
            <p className="kk-lead">
              Kikota is gym management software built for Kenya. Check-ins, M-Pesa payments, and
              attendance in one dashboard, plus a fitness network that connects your members to gyms
              across the city.
            </p>
            <WaitlistForm />
            <FoundingGymLink variant="outline" />
          </div>

          <div className="kk-hero-visual">
            <DashboardLaptop className="kk-hero-laptop" />
            <HeroRankPhone className="kk-hero-phone" />
          </div>
        </div>
      </section>

      {/* ── 2. Two layers ───────────────────────────────────────────────── */}
      <section className="kk-section kk-section--raised" aria-labelledby="kk-layers-title">
        <div className="kk-container">
          <div className="kk-head kk-head--bar">
            <p className="kk-eyebrow">HOW IT&apos;S BUILT</p>
            <h2 id="kk-layers-title" className="kk-h2">ONE PLATFORM. TWO LAYERS.</h2>
          </div>
          <div className="kk-layers">
            {LAYERS.map(layer => (
              <article key={layer.num} className="kk-card kk-layer" data-active={layer.active}>
                <span className="kk-layer-num" aria-hidden="true">{layer.num}</span>
                <h3 className="kk-h3 kk-layer-title">
                  <span className="sr-only">{layer.num} </span>{layer.title}
                </h3>
                <p className="kk-body">{layer.body}</p>
                <ul className="kk-tags">
                  {layer.tags.map(tag => <li key={tag} className="kk-tag">{tag}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Operations deep dive ─────────────────────────────────────── */}
      <section className="kk-section" aria-labelledby="kk-ops-title">
        <div className="kk-container kk-split">
          <div className="kk-split-visual kk-split-visual--first">
            <HeatmapLaptop />
          </div>
          <div className="kk-split-copy">
            <div className="kk-head">
              <p className="kk-eyebrow">OPERATIONS</p>
              <h2 id="kk-ops-title" className="kk-h2">YOUR WHOLE GYM IN ONE DASHBOARD</h2>
            </div>
            <ul className="kk-features">
              {OPERATIONS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="kk-card kk-feature">
                  <Icon size={22} className="kk-feature-icon" aria-hidden="true" />
                  <div>
                    <h3 className="kk-h3 kk-feature-title">{title}</h3>
                    <p className="kk-body">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4. M-Pesa spotlight ─────────────────────────────────────────── */}
      <section className="kk-section kk-section--stripes" aria-labelledby="kk-pay-title">
        <div className="kk-container kk-split">
          <div className="kk-split-copy">
            <div className="kk-head">
              <p className="kk-eyebrow kk-eyebrow--boxed">PAYMENTS</p>
              <h2 id="kk-pay-title" className="kk-h2 kk-h2--lg">
                GET PAID THE WAY{' '}
                <span className="kk-accent">KENYA PAYS.</span>
              </h2>
            </div>
            <p className="kk-lead">
              Members renew with M-Pesa in seconds. Payments show up in your dashboard automatically,
              so you always know who&apos;s paid.
            </p>
            <Checklist items={PAYMENT_POINTS} />
          </div>
          <div className="kk-split-visual">
            <div className="kk-brackets">
              <PaymentPhone />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Network deep dive ────────────────────────────────────────── */}
      <section className="kk-section" aria-labelledby="kk-net-title">
        <span className="kk-glow kk-glow--net" aria-hidden="true" />
        <div className="kk-container kk-split">
          <div className="kk-split-copy">
            <div className="kk-head">
              <p className="kk-eyebrow">THE NETWORK</p>
              <h2 id="kk-net-title" className="kk-h2 kk-h2--lg">GIVE YOUR MEMBERS SOMETHING TO COMPETE FOR</h2>
            </div>
            <p className="kk-lead">
              Training is more fun with something on the line. Kikota connects your gym to others
              across the city through friendly competition.
            </p>
            <ul className="kk-net-list">
              {NETWORK.map(({ icon: Icon, title, body }) => (
                <li key={title} className="kk-net-item">
                  <Icon size={22} className="kk-feature-icon" aria-hidden="true" />
                  <div>
                    <h3 className="kk-h3 kk-feature-title">{title}</h3>
                    <p className="kk-body">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="kk-split-visual kk-net-phones">
            <LeaderboardPhone className="kk-net-board" />
            <ProfilePhone className="kk-net-profile" />
          </div>
        </div>
      </section>

      {/* ── 6. Why it matters ───────────────────────────────────────────── */}
      <section className="kk-section kk-section--raised" aria-labelledby="kk-impact-title">
        <div className="kk-container">
          <div className="kk-head kk-head--center">
            <p className="kk-eyebrow">IMPACT</p>
            <h2 id="kk-impact-title" className="kk-h2">WHY IT MATTERS</h2>
          </div>
          <div className="kk-grid-3">
            {IMPACT.map((card, i) => (
              <article key={card.title} className="kk-card kk-impact" data-active={i === 1}>
                <h3 className="kk-impact-title">{card.title}</h3>
                <p className="kk-body">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. How it works ─────────────────────────────────────────────── */}
      <section className="kk-section" aria-labelledby="kk-how-title">
        <div className="kk-container">
          <div className="kk-head kk-head--center">
            <p className="kk-eyebrow">GETTING STARTED</p>
            <h2 id="kk-how-title" className="kk-h2">HOW KIKOTA WORKS</h2>
          </div>
          <ol className="kk-grid-3 kk-steps">
            {STEPS.map((step, i) => (
              <li key={step.num} className="kk-card kk-step" data-active={i === STEPS.length - 1}>
                <span className="kk-step-num" aria-hidden="true">{step.num}</span>
                <h3 className="kk-h3 kk-step-title">{step.title}</h3>
                <p className="kk-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 8. Founding gyms ────────────────────────────────────────────── */}
      <section className="kk-section" aria-labelledby="kk-founding-title">
        <div className="kk-container">
          <div className="kk-panel kk-founding">
            <div className="kk-founding-copy">
              <p className="kk-eyebrow kk-eyebrow--solid">FOUNDING GYMS</p>
              <h2 id="kk-founding-title" className="kk-h2">BE ONE OF THE FIRST GYMS ON KIKOTA</h2>
              <p className="kk-lead">
                We&apos;re looking for a small group of founding gyms in Nairobi to get early access and
                help shape the platform. Founding gyms use Kikota free during the pilot.
              </p>
              <Checklist items={FOUNDING_POINTS} />
            </div>
            <div className="kk-founding-cta">
              <FoundingGymLink variant="primary" arrow />
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
      <section className="kk-section kk-section--raised" aria-labelledby="kk-faq-title">
        <div className="kk-container">
          <div className="kk-head kk-head--bar">
            <p className="kk-eyebrow">QUESTIONS</p>
            <h2 id="kk-faq-title" className="kk-h2">FREQUENTLY ASKED QUESTIONS</h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* ── 10. Final CTA ───────────────────────────────────────────────── */}
      <section id="waitlist" className="kk-section kk-final" aria-labelledby="kk-final-title">
        <div className="kk-container">
          <div className="kk-panel kk-panel--stripes kk-final-panel">
            <p className="kk-eyebrow">EARLY ACCESS</p>
            <h2 id="kk-final-title" className="kk-h2">READY TO RUN A SMARTER GYM?</h2>
            <p className="kk-lead">Join the waitlist and we&apos;ll let you know as soon as Kikota launches.</p>
            <WaitlistForm />
            <Link href={PRIVACY_HREF} className="kk-text-link">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
