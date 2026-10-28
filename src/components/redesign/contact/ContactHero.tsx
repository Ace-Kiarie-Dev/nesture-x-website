import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, Eyebrow } from '@/components/redesign';
import { cx } from '@/components/redesign/cx';

const HEADLINE = [
  { text: "LET'S", outline: false },
  { text: 'TALK.', outline: true },
];

const CALENDAR = ASSETS_3D['calendar-cutout'];

// No GravityText here: it hides letters until the fonts load. The "reply fast" line is
// backed by the form's own promise (a reply within 24 hours).
export default function ContactHero() {
  return (
    <section className="nxct-hero" aria-labelledby="nxct-hero-title">
      <div className="nxct-hero-copy">
        <Eyebrow>Contact</Eyebrow>
        <h1 id="nxct-hero-title" className="nxct-hero-title" aria-label="Let's talk.">
          {HEADLINE.map((line) => (
            <span key={line.text} className={cx('nxct-hero-line', line.outline && 'nx-outline')} aria-hidden="true">
              {line.text}
            </span>
          ))}
        </h1>
        <p className="nxct-hero-lede">
          Tell us the problem. We&apos;ll tell you how we&apos;d build it. Most questions get a reply fast, so
          don&apos;t overthink the message.
        </p>
        <div className="nxct-hero-ctas">
          <ClayButton href="/booking">Book a consultation</ClayButton>
          <ClayButton href="#message" variant="ghost">
            Send a message
          </ClayButton>
        </div>
      </div>

      <div className="nxct-hero-art" aria-hidden="true">
        <span className="nxct-hero-glow" />
        {/* The LCP candidate: the only eager, high-priority image on the page. */}
        <Image
          src={CALENDAR.src}
          alt=""
          width={CALENDAR.width}
          height={CALENDAR.height}
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1100px) 560px, (min-width: 768px) 400px, 280px"
          className="nxct-hero-img"
        />
      </div>
    </section>
  );
}
