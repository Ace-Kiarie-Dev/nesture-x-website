import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';
import CountUp from './CountUp';

const STATS = [
  { stat: '20+', label: 'Projects Shipped' },
  { stat: '3', label: 'Core Disciplines' },
  { stat: '100%', label: 'Built with Intention' },
];

const TEAM = ASSETS_3D['about-team'];

export default function HomeAbout() {
  return (
    <section id="about" className="nxhp-sec nxhp-about" aria-labelledby="nxhp-about-title">
      <div className="nxhp-about-copy nxhp-reveal">
        <Eyebrow>About Us</Eyebrow>
        <h2 id="nxhp-about-title" className="nx-h2">
          BORN IN NAIROBI.
          <br />
          <span className="nx-outline">BUILT FOR THE WORLD.</span>
        </h2>
        <p className="nx-body">
          Nesture-X is a creative agency built by a tight-knit team of designers, developers, and strategists who
          believe the best digital work starts with genuine intention. We don&apos;t do cookie-cutter — every project
          is a new problem to solve, a new story to tell, and a new benchmark to set.
        </p>
        <p className="nx-body">
          Small enough to care deeply about every client. Skilled enough to compete with anyone. The full story is
          worth reading.
        </p>
        <ClayButton href="/about">OUR STORY</ClayButton>
      </div>

      <div className="nxhp-about-side">
        <Image
          src={TEAM.src}
          alt=""
          width={TEAM.width}
          height={TEAM.height}
          sizes="(min-width: 1200px) 360px, (min-width: 768px) 300px, 240px"
          className="nxhp-about-team nxhp-reveal"
        />
        <ul className="nxhp-about-stats">
          {STATS.map(({ stat, label }, i) => (
            <li key={label} className="nxhp-about-stat nx-clay nxhp-reveal" style={{ '--i': i } as CSSProperties}>
              <span className="nxhp-about-num">
                <CountUp value={stat} />
              </span>
              <span className="nxhp-about-label">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
