import type { CSSProperties } from 'react';
import { CLIENT_BRANDS, PARTNERS } from '@/data/partners';
import { Band, SectionHeading } from '@/components/redesign';
import PartnerCard from '@/components/redesign/PartnerCard';
import Ticker from '@/components/redesign/Ticker';

// Below the grid: tier 1, the NX equity partners (shared PartnerCard, same as the
// homepage); tier 2, a ticker of brands we've worked with (shared Ticker). No client
// logos ship in the repo, so the brands are set as stylised names.
export default function TrustStrip() {
  return (
    <Band variant="slate" aria-labelledby="nxpf-trust-title" className="nxpf-trust">
      <SectionHeading
        id="nxpf-trust-title"
        eyebrow="Our portfolio companies"
        title="WE BUILD WHAT WE BACK."
        outline="WHAT WE BACK."
      />
      <p className="nx-body nxpf-trust-intro">
        Nesture-X holds equity in these businesses: we build the brand and the technology, then grow alongside the
        founders.
      </p>

      {/* A swipe row on phones, so it takes focus for keyboard scrolling. */}
      <ul className="nxpf-partners" tabIndex={0} aria-label="NX equity partners">
        {PARTNERS.map((p, i) => (
          <PartnerCard key={p.name} partner={p} detailed className="nxpf-partner" style={{ '--i': i } as CSSProperties} />
        ))}
      </ul>

      <h3 className="nxpf-brands-title">Brands we&apos;ve worked with</h3>
      <Ticker items={CLIENT_BRANDS} variant="brands" label="Brands we've worked with" className="nxpf-brands" />
    </Band>
  );
}
