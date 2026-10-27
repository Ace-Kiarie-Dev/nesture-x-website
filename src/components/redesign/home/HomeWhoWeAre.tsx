import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';
import TippedText from './TippedText';

const PETER = ASSETS_3D['peter-pointing'];

// "DIFFERENT." tipping over: a few letters nudged down and rotated, the rest upright.
const DIFFERENT_TIPS: [number, number][] = [
  [0, 0],
  [0, 0],
  [0.02, -4],
  [0, 0],
  [0.04, 5],
  [0, 0],
  [0.05, -6],
  [0.02, 3],
  [0.1, 12],
  [0.2, 0],
];

export default function HomeWhoWeAre() {
  return (
    <section aria-labelledby="nxhp-who-title" className="nxhp-sec nxhp-who">
      {/* Peter faces right in the render, so on the left he points at the copy unflipped. */}
      <div className="nxhp-who-art nxhp-reveal">
        <Image
          src={PETER.src}
          alt=""
          width={PETER.width}
          height={PETER.height}
          sizes="(min-width: 1200px) 280px, (min-width: 768px) 220px, 150px"
          className="nxhp-who-img"
        />
      </div>

      <div className="nxhp-who-copy nxhp-reveal">
        <Eyebrow>Who We Are</Eyebrow>
        <h2 id="nxhp-who-title" className="nx-h2" aria-label="WE BUILD DIGITAL EXPERIENCES THAT HIT DIFFERENT.">
          <span aria-hidden="true">WE BUILD DIGITAL EXPERIENCES </span>
          <span className="nx-outline nxhp-nowrap" aria-hidden="true">
            THAT HIT
          </span>{' '}
          <span className="nx-outline">
            <TippedText text="DIFFERENT." tips={DIFFERENT_TIPS} />
          </span>
        </h2>
        <p className="nx-body nxhp-who-text">
          Strategy, design, and code — all under one roof, all built with intention. Born in Nairobi, built for the
          world.
        </p>
        <ClayButton href="/about" variant="ghost">
          OUR STORY
        </ClayButton>
      </div>
    </section>
  );
}
