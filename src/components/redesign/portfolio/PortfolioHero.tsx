import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { Chip, Eyebrow } from '@/components/redesign';
import { cx } from '@/components/redesign/cx';

const HEADLINE = [
  { text: 'WORK THAT', outline: false },
  { text: 'SPEAKS FOR', outline: true },
  { text: 'ITSELF.', outline: false },
];

const EASEL = ASSETS_3D['port-easel'];

type PortfolioHeroProps = {
  /** One line under the headline; differs per screen (entry, design, digital). */
  lede: string;
  /** Items on this screen, shown as the mono count chip. */
  count: number;
};

// Kept short so the content starts within about one scroll on desktop. No GravityText.
export default function PortfolioHero({ lede, count }: PortfolioHeroProps) {
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
          <p className="nxpf-hero-lede">{lede}</p>
          <Chip variant="blue" className="nxpf-count">
            {count} projects
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
