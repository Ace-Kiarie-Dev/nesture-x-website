import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';
import { cx } from '@/components/redesign/cx';

const HEADLINE = [
  { text: "WE DON'T MAKE", outline: false },
  { text: 'PRODUCTS.', outline: true },
  { text: 'WE BUILD', outline: false },
  { text: 'SOLUTIONS.', outline: false },
];

const PETER = ASSETS_3D['peter-pointing'];

// No GravityText here: it hides letters until the fonts load.
export default function AboutHero() {
  return (
    <section className="nxab-hero" aria-labelledby="nxab-hero-title">
      <div className="nxab-hero-copy">
        <Eyebrow>About Nesture-X</Eyebrow>
        <h1 id="nxab-hero-title" className="nxab-hero-title" aria-label="We don't make products. We build solutions.">
          {HEADLINE.map((line) => (
            <span key={line.text} className={cx('nxab-hero-line', line.outline && 'nx-outline')} aria-hidden="true">
              {line.text}
            </span>
          ))}
        </h1>
        <p className="nxab-hero-lede">
          Nesture-X is a creative technology agency in Nairobi. Design and development under one roof, built for
          businesses that want to grow online.
        </p>
        <div className="nxab-hero-ctas">
          <ClayButton href="/booking">Book a consultation</ClayButton>
          <ClayButton href="/portfolio" variant="ghost">
            See our work
          </ClayButton>
        </div>
      </div>

      <div className="nxab-hero-art">
        <span className="nxab-hero-glow" aria-hidden="true" />
        {/* The LCP element: the only eager, high-priority image on the page. Mirrored so he
            points back at the headline. */}
        <Image
          src={PETER.src}
          alt="Peter of Nesture-X as a 3D character, pointing at the headline"
          width={PETER.width}
          height={PETER.height}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1100px) 400px, (min-width: 768px) 250px, 175px"
          className="nxab-hero-img"
        />
      </div>
    </section>
  );
}
