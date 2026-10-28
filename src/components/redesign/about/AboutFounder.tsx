import Image from 'next/image';
import { Chip, GlassPanel, SectionHeading } from '@/components/redesign';

const SKILLS = ['Full-stack development', 'Brand and graphic design', 'M-Pesa integration', 'Deployment', 'Digital marketing'];

// Both photos are the originals in public/images, served resized through next/image.
const PHOTO = { src: '/images/Ace1.jpg', width: 3567, height: 5659 };
const PHOTO_ALT = { src: '/images/Ace2.jpg', width: 3896, height: 5844 };

// The real photo (with the old page's hover swap to the second photo) beside the bio.
// Title, bio and the "intentionally lean" line come from the old About page.
export default function AboutFounder() {
  return (
    <section className="nxab-sec" aria-labelledby="nxab-founder-title">
      <div className="nxab-founder nxab-reveal">
        <div className="nxab-photo nx-clay">
          <Image
            src={PHOTO.src}
            alt="Peter Kiarie Kamande, founder of Nesture-X"
            width={PHOTO.width}
            height={PHOTO.height}
            sizes="(min-width: 1100px) 420px, (min-width: 768px) 46vw, calc(100vw - 40px)"
            className="nxab-photo-img"
          />
          <Image
            src={PHOTO_ALT.src}
            alt=""
            aria-hidden="true"
            width={PHOTO_ALT.width}
            height={PHOTO_ALT.height}
            sizes="(min-width: 1100px) 420px, (min-width: 768px) 46vw, calc(100vw - 40px)"
            className="nxab-photo-img nxab-photo-alt"
          />
        </div>

        <GlassPanel className="nxab-founder-panel" style={{ padding: 'clamp(28px, 4vw, 48px)' }}>
          <SectionHeading id="nxab-founder-title" eyebrow="The person behind it" title="MEET PETER." outline="PETER." />
          <div>
            <p className="nxab-founder-name">Peter Kiarie Kamande</p>
            <p className="nxab-founder-role">Founder · CEO · Lead Developer &amp; Designer</p>
          </div>
          <p className="nx-body">
            A hands-on builder at heart, Peter works across both the creative and technical sides of every project.
            From interface design to backend systems and deployment, he stays close to the work, making sure
            what&apos;s imagined is actually what gets built.
          </p>
          <p className="nx-body">
            Nesture-X is intentionally lean: decisions are fast, communication is direct, and execution stays focused.
          </p>
          <ul className="nxab-skills" aria-label="What Peter works on">
            {SKILLS.map((s) => (
              <li key={s}>
                <Chip>{s}</Chip>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>
    </section>
  );
}
