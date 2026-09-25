// Code-built phone mockups for the SoraPesa landing page. Purely decorative —
// each frame is aria-hidden so screen readers skip the sample figures.

import { House, Lightbulb, PiggyBank, Wifi } from 'lucide-react';

function Phone({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`sp-phone ${className}`} aria-hidden="true">
      <div className="sp-notch" />
      <div className="sp-screen">{children}</div>
    </div>
  );
}

// ─── Hero: monthly overview ──────────────────────────────────────────────────

const HERO_ROWS = [
  { label: 'Rent',     amount: 'KES 15,000', Icon: House,     tone: 'indigo' },
  { label: 'Internet', amount: 'KES 2,500',  Icon: Wifi,      tone: 'purple' },
  { label: 'Savings',  amount: 'KES 8,000',  Icon: PiggyBank, tone: 'navy'   },
] as const;

export function OverviewPhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="sp-screen-top">
        <span className="sp-greeting">Hi, Wanjiru</span>
        <span className="sp-avatar">W</span>
      </div>

      <div className="sp-gradient-card">
        <span className="sp-gradient-card-label">Available this month</span>
        <div className="sp-gradient-card-value">KES 36,500</div>
        <div className="sp-gradient-card-sub">of KES 65,000 salary</div>
      </div>

      <div className="sp-rows">
        {HERO_ROWS.map(({ label, amount, Icon, tone }) => (
          <div key={label} className="sp-row">
            <span className="sp-row-left">
              <span className={`sp-row-icon sp-row-icon--${tone}`}><Icon size={14} /></span>
              {label}
            </span>
            <span className="sp-row-amt">{amount}</span>
          </div>
        ))}
      </div>
    </Phone>
  );
}

// ─── Signature feature: story of your salary ─────────────────────────────────

const COMMITTED = [
  { label: 'Rent',                amount: 'KES 15,000', Icon: House     },
  { label: 'Internet',            amount: 'KES 2,500',  Icon: Wifi      },
  { label: 'Bills and Utilities', amount: 'KES 3,000',  Icon: Lightbulb },
  { label: 'Savings',             amount: 'KES 8,000',  Icon: PiggyBank },
];

export function SalaryStoryPhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="sp-salary-head">
        <div className="sp-salary-value">Salary: KES 65,000</div>
      </div>

      <div>
        <div className="sp-split-labels">
          <span>Committed (44%)</span>
          <span>Remaining (56%)</span>
        </div>
        <div className="sp-split-bar">
          <span style={{ width: '44%' }} />
          <span style={{ width: '56%' }} />
        </div>
      </div>

      <div className="sp-gradient-card sp-gradient-card--center">
        <span className="sp-gradient-card-label">Truly yours to spend</span>
        <div className="sp-gradient-card-value">Remaining: KES 36,500</div>
      </div>

      <div className="sp-ledger">
        <span className="sp-mini-label">Committed KES 28,500</span>
        {COMMITTED.map(({ label, amount, Icon }) => (
          <div key={label} className="sp-ledger-row">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon size={13} />
              {label}
            </span>
            <strong>{amount}</strong>
          </div>
        ))}
      </div>
    </Phone>
  );
}

// ─── Side hustle: order profit ───────────────────────────────────────────────

const COSTS = [
  { label: 'Ingredients', amount: 'KES 1,300' },
  { label: 'Packaging',   amount: 'KES 300'   },
  { label: 'Delivery',    amount: 'KES 400'   },
];

export function SideHustlePhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="sp-biz-head">
        <span className="sp-biz-title">Baking Business</span>
        <span className="sp-status-pill">Active</span>
      </div>

      <div className="sp-order">Order #024 · 12 cupcakes</div>

      <div>
        <div className="sp-metric">
          <span>Revenue</span>
          <strong>KES 3,600</strong>
        </div>
        <div style={{ padding: '6px 0', borderBottom: '1px solid var(--sp-subtle)' }}>
          <div className="sp-ledger-row" style={{ color: 'var(--sp-text-muted)' }}>
            <span>Costs</span>
            <strong>KES 2,000</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 6 }}>
            {COSTS.map(c => (
              <div key={c.label} className="sp-ledger-row sp-ledger-row--sub">
                <span>{c.label}</span>
                <strong>{c.amount}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sp-gradient-card sp-gradient-card--center">
        <span className="sp-gradient-card-label">Net business profit</span>
        <div className="sp-gradient-card-value">Profit: KES 1,600</div>
      </div>
    </Phone>
  );
}
