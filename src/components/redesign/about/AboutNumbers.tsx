import type { CSSProperties } from 'react';
import { Band, Eyebrow } from '@/components/redesign';
import CountUp from '@/components/redesign/home/CountUp';

// Only numbers already published on the site (the old /services stats strip). The year is
// shown as is: counting up to 2024 from 0 would read as a quantity, not a date.
const STATS = [
  { value: '33+', label: 'Clients served', count: true },
  { value: '5', label: 'Equity partners', count: true },
  { value: '100%', label: 'Full-stack in-house', count: true },
  { value: '2024', label: 'Founded', count: false },
];

export default function AboutNumbers() {
  return (
    <Band aria-labelledby="nxab-numbers-title" className="nxab-numbers">
      <Eyebrow className="nxab-reveal">By the numbers</Eyebrow>
      <h2 id="nxab-numbers-title" className="nx-sr-only">
        Nesture-X by the numbers
      </h2>
      <ul className="nxab-stats">
        {STATS.map((s, i) => (
          <li key={s.label} className="nxab-stat nx-clay nxab-reveal" style={{ '--i': i } as CSSProperties}>
            <span className="nxab-stat-num">{s.count ? <CountUp value={s.value} /> : s.value}</span>
            <span className="nxab-stat-label">{s.label}</span>
          </li>
        ))}
      </ul>
    </Band>
  );
}
