// Code-built device mockups for the Kikota landing page. Purely decorative —
// each frame is aria-hidden so screen readers skip the sample figures.

import { Trophy } from 'lucide-react';

type FrameProps = {
  children: React.ReactNode;
  className?: string;
};

function Laptop({ children, className = '' }: FrameProps) {
  return (
    <div className={`kk-laptop ${className}`} aria-hidden="true">
      <div className="kk-laptop-screen">
        <div className="kk-laptop-bar">
          <span className="kk-laptop-dots"><i /><i /><i /></span>
        </div>
        <div className="kk-laptop-body">{children}</div>
      </div>
      <div className="kk-laptop-base" />
    </div>
  );
}

function Phone({ children, className = '' }: FrameProps) {
  return (
    <div className={`kk-phone ${className}`} aria-hidden="true">
      <span className="kk-phone-notch" />
      <div className="kk-phone-screen">{children}</div>
    </div>
  );
}

// ─── Hero: owner dashboard ────────────────────────────────────────────────────

const WEEK = [
  { day: 'M', value: 52 },
  { day: 'T', value: 68 },
  { day: 'W', value: 74 },
  { day: 'T', value: 61 },
  { day: 'F', value: 88 },
  { day: 'S', value: 70 },
  { day: 'S', value: 38 },
];

const MEMBERS = [
  { name: 'Kevin M.',  status: 'Active',   tone: 'active'   },
  { name: 'Faith K.',  status: 'Expiring', tone: 'expiring' },
  { name: 'Dennis M.', status: 'Overdue',  tone: 'overdue'  },
] as const;

export function DashboardLaptop({ className = '' }: { className?: string }) {
  return (
    <Laptop className={className}>
      <div className="kk-dash-head">
        <span className="kk-mock-label">Iron Den</span>
        <span className="kk-mock-label kk-mock-label--muted">Dashboard</span>
      </div>

      <div className="kk-stats">
        <div className="kk-stat">
          <span className="kk-stat-label">Active Members</span>
          <span className="kk-stat-value">248</span>
          <span className="kk-stat-sub">+14 this week</span>
        </div>
        <div className="kk-stat">
          <span className="kk-stat-label">Today&apos;s Check-ins</span>
          <span className="kk-stat-value kk-stat-value--blue">63</span>
        </div>
        <div className="kk-stat">
          <span className="kk-stat-label">Renewals Due</span>
          <span className="kk-stat-value">12</span>
        </div>
        <div className="kk-stat kk-stat--accent">
          <span className="kk-stat-label">Revenue This Month</span>
          <span className="kk-stat-value">KES 412,000</span>
        </div>
      </div>

      <div className="kk-chart">
        <span className="kk-stat-label">Weekly Check-ins</span>
        <div className="kk-bars">
          {WEEK.map((d, i) => (
            <div key={i} className="kk-bar-col">
              <span className="kk-bar" data-peak={d.value === 88} style={{ height: `${d.value}%` }} />
              <span className="kk-bar-day">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <ul className="kk-members">
        {MEMBERS.map(m => (
          <li key={m.name} className="kk-member">
            <span className="kk-member-name">{m.name}</span>
            <span className={`kk-status kk-status--${m.tone}`}>{m.status}</span>
          </li>
        ))}
      </ul>
    </Laptop>
  );
}

export function HeroRankPhone({ className = '' }: { className?: string }) {
  return (
    <Phone className={`kk-phone--sm ${className}`}>
      <div className="kk-rank-head">
        <span className="kk-mock-label">Nairobi Deadlift Challenge</span>
        <Trophy size={14} />
      </div>
      <div className="kk-rank-row">
        <span className="kk-rank-pos">#1 IRON DEN</span>
        <span className="kk-rank-pts">4,820 PTS</span>
      </div>
      <span className="kk-rank-meter"><span style={{ width: '88%' }} /></span>
    </Phone>
  );
}

// ─── Operations: attendance heatmap ───────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['06:00', '09:00', '12:00', '15:00', '18:00', '20:00'];
// Busyness 0 (quiet) to 4 (busy): early mornings and evenings peak on weekdays,
// Saturdays are busiest mid-morning, Sundays stay quiet.
const HEAT = [
  [4, 3, 4, 3, 4, 1, 0],
  [1, 1, 1, 1, 1, 3, 2],
  [2, 2, 1, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1],
  [4, 4, 4, 4, 3, 1, 0],
  [2, 2, 2, 2, 1, 0, 0],
];

export function HeatmapLaptop({ className = '' }: { className?: string }) {
  return (
    <Laptop className={className}>
      <div className="kk-heat-head">
        <span className="kk-heat-title">Attendance Heatmap</span>
      </div>
      <div className="kk-heat">
        <span />
        {DAYS.map(d => <span key={d} className="kk-heat-day">{d}</span>)}
        {HOURS.map((h, r) => (
          <div key={h} className="kk-heat-row">
            <span className="kk-heat-hour">{h}</span>
            {HEAT[r].map((level, c) => (
              <span key={c} className="kk-heat-cell" data-level={level} />
            ))}
          </div>
        ))}
      </div>
      <div className="kk-heat-legend">
        <span>Quiet</span>
        <span className="kk-heat-scale">
          {[0, 1, 2, 3, 4].map(l => <span key={l} className="kk-heat-cell" data-level={l} />)}
        </span>
        <span>Busy</span>
      </div>
    </Laptop>
  );
}

// ─── Payments: renewal confirmation ───────────────────────────────────────────

export function PaymentPhone({ className = '' }: { className?: string }) {
  return (
    <Phone className={`kk-phone--pay ${className}`}>
      <span className="kk-mock-label">Payment Confirmed</span>
      <div className="kk-pay-badge">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </div>
      <span className="kk-pay-title">Membership Renewed</span>
      <div className="kk-pay-amount">
        <span className="kk-pay-kes">KES 3,000</span>
        <span className="kk-pay-plan">Monthly Plan</span>
      </div>
      <dl className="kk-pay-meta">
        <div><dt>Gym</dt><dd>Iron Den</dd></div>
        <div><dt>Time</dt><dd>Today, 6:14 AM</dd></div>
      </dl>
    </Phone>
  );
}

// ─── Network: leaderboard and member profile ──────────────────────────────────

const BOARD = [
  { rank: 1, gym: 'Iron Den',         area: 'Westlands', pts: '4,820', yours: true  },
  { rank: 2, gym: 'Peak Performance', area: 'Kilimani',  pts: '4,650', yours: false },
  { rank: 3, gym: 'Forge Fitness',    area: 'Karen',     pts: '4,310', yours: false },
  { rank: 4, gym: 'Apex Strength',    area: 'Parklands', pts: '3,980', yours: false },
];

export function LeaderboardPhone({ className = '' }: { className?: string }) {
  return (
    <Phone className={`kk-phone--board ${className}`}>
      <div className="kk-board-head">
        <span className="kk-board-title">Nairobi Deadlift Challenge</span>
        <span className="kk-mock-label kk-mock-label--muted">Week 4 of 6</span>
      </div>
      <ol className="kk-board">
        {BOARD.map(row => (
          <li key={row.rank} className="kk-board-row" data-yours={row.yours}>
            <span className="kk-board-rank">{row.rank}</span>
            <span className="kk-board-gym">
              <span className="kk-board-name">{row.gym}</span>
              <span className="kk-board-area">
                {row.yours ? <><span className="kk-board-yours">Your Gym</span> · </> : null}
                {row.area}
              </span>
            </span>
            <span className="kk-board-pts">{row.pts}</span>
          </li>
        ))}
      </ol>
    </Phone>
  );
}

export function ProfilePhone({ className = '' }: { className?: string }) {
  return (
    <Phone className={`kk-phone--profile ${className}`}>
      <div className="kk-profile-head">
        <span className="kk-avatar">BO</span>
        <span>
          <span className="kk-profile-name">Brian O.</span>
          <span className="kk-profile-gym">Home gym: Iron Den</span>
        </span>
      </div>
      <div className="kk-profile-stats">
        <div><span className="kk-profile-num">142</span><span className="kk-profile-cap">Sessions</span></div>
        <div><span className="kk-profile-num kk-profile-num--blue">6</span><span className="kk-profile-cap">Challenges</span></div>
        <div><span className="kk-profile-num">#3</span><span className="kk-profile-cap">Best Rank</span></div>
      </div>
      <span className="kk-mock-label kk-mock-label--muted">Badges</span>
      <ul className="kk-badges">
        <li>Century Club (100+ check-ins)</li>
        <li>Nairobi Top 10</li>
      </ul>
    </Phone>
  );
}
