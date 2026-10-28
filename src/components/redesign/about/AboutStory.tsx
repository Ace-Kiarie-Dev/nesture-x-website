import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { Band, SectionHeading } from '@/components/redesign';

const CHIPS = ['Founded 2024', 'Nairobi, Kenya', 'Create. Discover. Explore.'];
const TEAM = ASSETS_3D['about-team'];

// Story: the brief's paragraph, then the origin from the old About page.
export default function AboutStory() {
  return (
    <Band aria-labelledby="nxab-story-title" className="nxab-story">
      <div className="nxab-story-grid nxab-reveal">
        <div className="nxab-story-copy">
          <SectionHeading id="nxab-story-title" eyebrow="Our story" title="FROM NAIROBI, FOR AFRICA." outline="FOR AFRICA." />
          <p className="nx-body">
            Nesture-X was founded in late 2024, sitting where design meets development. We build digital experiences,
            from full-stack web apps to brand identities and marketing campaigns, for businesses looking to grow
            online. Everything we ship is production-grade, scalable and distinctly Kenyan in its market context,
            including M-Pesa where it matters.
          </p>
          <p className="nx-body">
            At the time, there was a pattern that kept showing up: businesses were investing in digital, but not
            always getting results back. Websites that looked good but didn&apos;t convert. Brands that existed, but
            didn&apos;t connect. Systems that worked, but didn&apos;t scale. So Nesture-X was built to close that gap.
          </p>
          <ul className="nxab-chips" aria-label="At a glance">
            {CHIPS.map((c) => (
              <li key={c} className="nxab-glass-chip nx-glass">
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="nxab-story-art" aria-hidden="true">
          <span className="nxab-story-glow" />
          <Image src={TEAM.src} alt="" width={TEAM.width} height={TEAM.height} sizes="(min-width: 900px) 440px, 280px" className="nxab-story-img" />
        </div>
      </div>
    </Band>
  );
}
