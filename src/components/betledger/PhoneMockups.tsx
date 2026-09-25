// Code-built phone mockups for the BetLedger landing page. Purely decorative —
// each frame is aria-hidden so screen readers skip the sample figures.

type PhoneProps = {
  children: React.ReactNode;
  className?: string;
};

function Phone({ children, className = '' }: PhoneProps) {
  return (
    <div className={`bl-phone ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

// ─── Dashboard (hero front screen) ────────────────────────────────────────────

const RECENT = [
  { name: 'Home FC vs Away United', market: 'Over 2.5', amount: '+850',   up: true  },
  { name: 'City Stars vs Rovers',   market: 'Home Win', amount: '-1,500', up: false },
  { name: 'Lions vs Leopards',      market: 'BTTS',     amount: '+920',   up: true  },
];

export function DashboardPhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="bl-screen">
        <div className="bl-screen-head">
          <div className="bl-brand">
            <span className="bl-brand-mark">B</span>
            BetLedger
          </div>
          <span className="bl-pill bl-pill--teal">30 DAYS</span>
        </div>

        <div className="bl-pl-card">
          <div className="bl-pl-top">
            <span className="bl-label">Net Profit / Loss</span>
            <span className="bl-pill bl-pill--teal">+14.2% ROI</span>
          </div>
          <div className="bl-pl-value">+KES 4,250</div>
          <div className="bl-pl-foot">
            <span>Staked <strong>29,800</strong></span>
            <span>Won <strong className="bl-up">34,050</strong></span>
          </div>
        </div>

        <div className="bl-panel">
          <div className="bl-panel-head">
            <span>30-Day P/L Curve</span>
          </div>
          <svg viewBox="0 0 280 48" fill="none" style={{ width: '100%', height: 48, display: 'block' }}>
            <defs>
              <linearGradient id="blHeroChartGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#42DEC3" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#42DEC3" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,38 Q30,34 65,36 T130,22 T190,26 T240,12 T276,6 L276,48 L0,48 Z" fill="url(#blHeroChartGrad)" />
            <path d="M0,38 Q30,34 65,36 T130,22 T190,26 T240,12 T276,6" stroke="#42DEC3" strokeLinecap="round" strokeWidth="2.2" />
            <circle cx="276" cy="6" r="3.5" fill="#42DEC3" />
          </svg>
        </div>

        <div>
          <div className="bl-panel-head" style={{ textTransform: 'uppercase', color: 'var(--bl-text-subtle)' }}>
            <span>Recent Activity</span>
            <span>P / L</span>
          </div>
          <div className="bl-activity">
            {RECENT.map(bet => (
              <div key={bet.name} className="bl-activity-row">
                <div className="bl-activity-left">
                  <span className={`bl-dot ${bet.up ? 'bl-dot--up' : 'bl-dot--down'}`} />
                  <div style={{ minWidth: 0 }}>
                    <div className="bl-activity-name">{bet.name}</div>
                    <div className="bl-activity-market">{bet.market}</div>
                  </div>
                </div>
                <div className={`bl-activity-amt ${bet.up ? 'bl-up' : 'bl-down'}`}>
                  {bet.amount}
                  <small>KES</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─── Fan side screens (mobile hero only) ──────────────────────────────────────

export function QuickLogSidePhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="bl-screen bl-screen--small">
        <div className="bl-screen-head">
          <span className="bl-screen-title">Quick Log</span>
        </div>
        <div>
          <span className="bl-label">Match</span>
          <div className="bl-field" style={{ fontFamily: 'inherit', fontWeight: 600 }}>Home FC vs Away United</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div className="bl-field" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="bl-label">Stake</span>
            <span style={{ fontWeight: 700 }}>1,000</span>
          </div>
          <div className="bl-field" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="bl-label">Odds</span>
            <span className="bl-up" style={{ fontWeight: 700 }}>1.85</span>
          </div>
        </div>
        <div className="bl-save" style={{ padding: 8 }}>Save</div>
      </div>
    </Phone>
  );
}

export function HabitsSidePhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="bl-screen bl-screen--small">
        <div className="bl-screen-head">
          <span className="bl-screen-title" style={{ color: 'var(--bl-gold)' }}>Habits</span>
          <span className="bl-pill bl-pill--teal">30 DAYS</span>
        </div>
        <div className="bl-panel" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--bl-text-muted)' }}>Strike rate</span>
          <span className="bl-mono bl-up" style={{ fontWeight: 700 }}>64.2%</span>
        </div>
        <div className="bl-bars" style={{ height: 44, borderBottom: 'none' }}>
          {[40, 60, 100, 55, 85].map((h, i) => (
            <div key={i} className="bl-bar-col">
              <div
                className="bl-bar"
                style={{ height: `${h}%`, background: i === 3 ? 'var(--bl-coral)' : 'var(--bl-teal)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ─── New Bet Entry (section 3) ────────────────────────────────────────────────

export function NewBetPhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="bl-screen" style={{ gap: 16, padding: 20 }}>
        <div className="bl-screen-head">
          <span className="bl-screen-title">New Bet Entry</span>
          <span className="bl-pill bl-pill--teal">KES</span>
        </div>

        <div>
          <span className="bl-label">Stake</span>
          <div className="bl-field bl-field--active">
            <span className="bl-field-prepend">KES</span>
            <span className="bl-field-value">1,000</span>
          </div>
        </div>

        <div>
          <span className="bl-label">Odds</span>
          <div className="bl-field">
            <span className="bl-field-prepend">@</span>
            <span className="bl-field-value bl-up">2.15</span>
          </div>
        </div>

        <div>
          <span className="bl-label">Bet Type</span>
          <div className="bl-toggle">
            <span data-active="true">Single</span>
            <span>Multibet</span>
          </div>
        </div>

        <div className="bl-return">
          <span style={{ fontSize: 10.5, color: 'var(--bl-text-muted)' }}>Potential Return</span>
          <span style={{ fontWeight: 700 }}>KES 2,150</span>
        </div>

        <div className="bl-save">Save to Ledger</div>
      </div>
    </Phone>
  );
}

// ─── Analytics (section 4) ────────────────────────────────────────────────────

const WEEKS = [
  { label: 'W1', height: 55, up: true  },
  { label: 'W2', height: 30, up: false },
  { label: 'W3', height: 78, up: true  },
  { label: 'W4', height: 96, up: true  },
];

const STRIKE_RATE = 64.2;

export function AnalyticsPhone({ className }: { className?: string }) {
  return (
    <Phone className={className}>
      <div className="bl-screen" style={{ gap: 16, padding: 20 }}>
        <div className="bl-screen-head">
          <span className="bl-screen-title">Analytics</span>
          <span className="bl-pill bl-pill--gold">
            30 DAYS
          </span>
        </div>

        <div className="bl-panel">
          <div className="bl-panel-head">
            <span>WEEKLY P/L</span>
            <span className="bl-up">+KES 4,250 NET</span>
          </div>
          <div className="bl-bars">
            {WEEKS.map(w => (
              <div key={w.label} className="bl-bar-col">
                <div
                  className="bl-bar"
                  style={{ height: `${w.height}%`, background: w.up ? 'var(--bl-teal)' : 'var(--bl-coral)' }}
                />
                <span className="bl-bar-label">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bl-panel bl-strike">
          <div>
            <span className="bl-label">Strike Rate</span>
            <div className="bl-strike-value">{STRIKE_RATE}%</div>
            <span className="bl-strike-sub">18 Won · 10 Lost</span>
          </div>
          <svg viewBox="0 0 36 36" width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#FFB5B2" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="none"
              stroke="#42DEC3"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${STRIKE_RATE} 100`}
            />
          </svg>
        </div>
      </div>
    </Phone>
  );
}
