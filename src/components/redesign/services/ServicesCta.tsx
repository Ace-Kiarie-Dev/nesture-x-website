import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton } from '@/components/redesign';

const PETER = ASSETS_3D['peter-pointing'];

// Same blue gradient panel as the homepage CTA. No GravityText here.
export default function ServicesCta() {
  return (
    <section className="nxsv-sec" aria-labelledby="nxsv-cta-title">
      <div className="nxsv-cta nxsv-reveal">
        <div className="nxsv-cta-body">
          <h2 id="nxsv-cta-title" className="nxsv-cta-title">
            NOT SURE WHAT YOU NEED?
          </h2>
          <p className="nxsv-cta-text">
            Tell us the problem. We will tell you which of these actually fixes it. The first conversation is free.
          </p>
          <div className="nxsv-cta-btns">
            <ClayButton href="/booking" className="nxsv-btn-white">
              Book a consultation
            </ClayButton>
            <ClayButton href="/portfolio" variant="ghost" className="nxsv-btn-glass">
              See our work
            </ClayButton>
          </div>
        </div>
        {/* Mirrored so he points back at the message. */}
        <Image
          src={PETER.src}
          alt="Peter of Nesture-X as a 3D character, pointing at the message"
          width={PETER.width}
          height={PETER.height}
          sizes="(min-width: 1100px) 240px, 170px"
          className="nxsv-cta-peter"
        />
      </div>
    </section>
  );
}
