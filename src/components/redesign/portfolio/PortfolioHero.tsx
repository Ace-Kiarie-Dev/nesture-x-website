import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { WORK_CARDS } from '@/lib/portfolio-data';
import { Chip, Eyebrow } from '@/components/redesign';
import { cx } from '@/components/redesign/cx';

const HEADLINE = [
  { text: 'WORK THAT', outline: false },
  { text: 'SPEAKS FOR', outline: true },
  { text: 'ITSELF.', outline: false },
];

const EASEL = ASSETS_3D['port-easel'];

// Kept short so the grid starts within about one scroll on desktop. No GravityText.
export default function PortfolioHero() {
  return (
    <section className="nxpf-hero" aria-labelledby="nxpf-hero-title">
      <div className="nxpf-hero-copy">
        <Eyebrow>Our work</Eyebrow>
        <h1 id="nxpf-hero-title" className="nxpf-hero-title" aria-label="Work that speaks for itself.">
          {HEADLINE.map((line) => (
            <span key={line.text} className={cx('nxpf-hero-line', line.outline && 'nx-outline')} aria-hidden="true">
              {line.text}
            </span>
          ))}
        </h1>
        <div className="nxpf-hero-foot">
          <p className="nxpf-hero-lede">
            Logos, print, social, and full-stack builds. Pick a category and have a look.
          </p>
          <Chip variant="blue" className="nxpf-count">
            {WORK_CARDS.length} projects
          </Chip>
        </div>
      </div>

      <div className="nxpf-hero-art" aria-hidden="true">
        <span className="nxpf-hero-glow" />
        <Image
          src={EASEL.src}
          alt=""
          width={EASEL.width}
          height={EASEL.height}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1100px) 360px, 240px"
          className="nxpf-hero-img"
        />
      </div>
    </section>
  );
}
