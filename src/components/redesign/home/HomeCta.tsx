import Image from 'next/image';
import { CONTACT } from '@/constants';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton } from '@/components/redesign';
import TippedText from './TippedText';

const AVATAR = ASSETS_3D['avatar-cutout'];
const CALENDAR = ASSETS_3D['calendar-cutout'];

// "SOMETHING?" toppling like dominoes: upright at the start, each later letter leaning
// and dropping a little more. [translateY em, rotate deg]
const PILE: [number, number][] = [
  [0, 0],
  [0, 0],
  [0.01, 2],
  [0.02, 4],
  [0.03, 6],
  [0.05, 8],
  [0.07, 11],
  [0.09, 14],
  [0.12, 18],
  [0.18, 28],
];

export default function HomeCta() {
  return (
    <section className="nxhp-sec" aria-labelledby="nxhp-cta-title">
      <div className="nxhp-cta nxhp-reveal">
        <Image
          src={AVATAR.src}
          alt=""
          width={AVATAR.width}
          height={AVATAR.height}
          sizes="(min-width: 1200px) 300px, (min-width: 768px) 220px, 170px"
          className="nxhp-cta-avatar"
        />

        <div className="nxhp-cta-body">
          <h2 id="nxhp-cta-title" className="nxhp-cta-title" aria-label="Ready to build something?">
            <span aria-hidden="true">READY TO BUILD </span>
            <TippedText text="SOMETHING?" tips={PILE} />
          </h2>
          <p className="nxhp-cta-text">
            Tell us what you&apos;re trying to solve. The first conversation is always free.
          </p>
          <div className="nxhp-ctas nxhp-cta-btns">
            <ClayButton href="#contact" className="nxhp-btn-white">
              Book a Consultation
            </ClayButton>
            <ClayButton href="#portfolio" variant="ghost" className="nxhp-btn-glass">
              See More Work
            </ClayButton>
          </div>
          <p className="nxhp-cta-contact">
            {CONTACT.location} · {CONTACT.phoneDisplay} · {CONTACT.email}
          </p>
        </div>

        <Image
          src={CALENDAR.src}
          alt=""
          width={CALENDAR.width}
          height={CALENDAR.height}
          sizes="(min-width: 1200px) 240px, 120px"
          className="nxhp-cta-calendar"
        />
      </div>
    </section>
  );
}
