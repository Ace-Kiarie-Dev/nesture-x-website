import Image from 'next/image';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';
import { cx } from '@/components/redesign/cx';

const HEADLINE = [
  { text: 'WE SOLVE.', outline: false },
  { text: 'THEN WE', outline: true },
  { text: 'BUILD.', outline: false },
];

// Orbiting objects around the phone. Decorative, so alt="" (from the registry).
const ORBIT: { key: Asset3dKey; className: string; sizes: string }[] = [
  { key: 'svc-seo', className: 'nxsv-orbit nxsv-orbit--seo', sizes: '(min-width: 1100px) 220px, (min-width: 768px) 130px, 90px' },
  { key: 'svc-cart', className: 'nxsv-orbit nxsv-orbit--cart', sizes: '(min-width: 1100px) 250px, (min-width: 768px) 140px, 96px' },
  { key: 'svc-lock', className: 'nxsv-orbit nxsv-orbit--lock', sizes: '(min-width: 1100px) 170px, 100px' },
];

const PHONE = ASSETS_3D['svc-phone'];

// No GravityText here: it hides letters until the fonts load, which would delay the LCP.
export default function ServicesHero() {
  return (
    <section className="nxsv-hero" aria-labelledby="nxsv-hero-title">
      <div className="nxsv-hero-copy">
        <Eyebrow>What we do</Eyebrow>
        <h1 id="nxsv-hero-title" className="nxsv-hero-title" aria-label="We solve. Then we build.">
          {HEADLINE.map((line) => (
            <span key={line.text} className={cx('nxsv-hero-line', line.outline && 'nx-outline')} aria-hidden="true">
              {line.text}
            </span>
          ))}
        </h1>
        <p className="nxsv-hero-lede">
          Web, design and marketing under one roof. Every service is built around one question: what problem are
          you actually trying to solve?
        </p>
      </div>

      <div className="nxsv-hero-stage">
        <span className="nxsv-hero-glow" aria-hidden="true" />
        {/* The LCP element: the only eager, high-priority image on the page. */}
        <Image
          src={PHONE.src}
          alt="3D smartphone showing an app dashboard"
          width={PHONE.width}
          height={PHONE.height}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1100px) 440px, (min-width: 768px) 270px, 165px"
          className="nxsv-hero-phone"
        />
        {ORBIT.map(({ key, className, sizes }) => {
          const asset = ASSETS_3D[key];
          return (
            <Image
              key={key}
              src={asset.src}
              alt=""
              width={asset.width}
              height={asset.height}
              sizes={sizes}
              className={className}
            />
          );
        })}
        <p className="nxsv-hero-chip nx-glass">6 services · 1 team</p>
      </div>

      <div className="nxsv-hero-ctas">
        <ClayButton href="/booking">Book a consultation</ClayButton>
        <ClayButton href="#s1" variant="ghost">
          See all six
        </ClayButton>
      </div>
    </section>
  );
}
