import Image from 'next/image';
import { CONTACT } from '@/constants';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton } from '@/components/redesign';
import GravityTextLazy from '@/components/effects/GravityTextLazy';

const AVATAR = ASSETS_3D['avatar-cutout'];
const CALENDAR = ASSETS_3D['calendar-cutout'];

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
            READY TO BUILD<span className="nx-sr-only"> SOMETHING?</span>
          </h2>
          {/* SOMETHING? piles up on its own floor inside the panel's padding. */}
          <div className="nxhp-cta-gt">
            <GravityTextLazy
              text="SOMETHING?"
              announce={false}
              height="var(--nxhp-cta-gt-h)"
              className="nxhp-cta-stage nx-gt-top"
              letterClassName="nxhp-cta-gt-letter"
            />
          </div>
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
