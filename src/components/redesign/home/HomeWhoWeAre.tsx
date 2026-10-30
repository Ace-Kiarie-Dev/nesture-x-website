import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';
import GravityTextLazy from '@/components/effects/GravityTextLazy';

const PETER = ASSETS_3D['peter-pointing'];

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
        {/* One heading with the whole sentence; the falling line beside it is visual only. */}
        <div className="nxhp-who-heading">
          <h2 id="nxhp-who-title" className="nx-h2">
            WE BUILD DIGITAL EXPERIENCES<span className="nx-sr-only"> THAT HIT DIFFERENT.</span>
          </h2>
          <div className="nxhp-who-gt">
            <GravityTextLazy
              text="THAT HIT DIFFERENT."
              announce={false}
              height="var(--nxhp-who-gt-h)"
              className="nx-gt-top nx-gt-left"
              letterClassName="nxhp-who-gt-letter nx-outline"
            />
          </div>
        </div>
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
