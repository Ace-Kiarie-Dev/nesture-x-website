import CtaPanel from '@/components/redesign/CtaPanel';

// Final CTA: the shared blue gradient panel (same as the homepage CTA). No GravityText.
export default function ServicesCta() {
  return (
    <section className="nxsv-sec" aria-labelledby="nxsv-cta-title">
      <CtaPanel
        titleId="nxsv-cta-title"
        title="NOT SURE WHAT YOU NEED?"
        text="Tell us the problem. We will tell you which of these actually fixes it. The first conversation is free."
        primary={{ href: '/booking', label: 'Book a consultation' }}
        secondary={{ href: '/portfolio', label: 'See our work' }}
        art="peter-pointing"
        artAlt="Peter of Nesture-X as a 3D character, pointing at the message"
        mirror
        className="nxsv-reveal"
      />
    </section>
  );
}
