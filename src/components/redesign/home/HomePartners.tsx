import type { CSSProperties } from 'react';
import { PARTNERS } from '@/data/partners';
import { Band, Eyebrow } from '@/components/redesign';
import PartnerCard from '@/components/redesign/PartnerCard';

export default function HomePartners() {
  return (
    <Band variant="slate" aria-labelledby="nxhp-partners-title">
      <div className="nxhp-partners-head nxhp-reveal">
        <div className="flex flex-col gap-5">
          <Eyebrow>Portfolio Companies</Eyebrow>
          <h2 id="nxhp-partners-title" className="nx-h2">
            NX EQUITY <span className="nx-outline">PARTNERS</span>
          </h2>
        </div>
        <p className="nx-body">
          We don&apos;t just build for clients — we co-own businesses. These are the brands where Nesture-X holds
          equity stakes, builds the technology, and grows alongside the founders.
        </p>
      </div>

      {/* A swipe row on phones, so it takes focus for keyboard scrolling. */}
      <ul className="nxhp-partners" tabIndex={0} aria-label="NX equity partners">
        {PARTNERS.map((p, i) => (
          <PartnerCard key={p.name} partner={p} className="nxhp-partner nxhp-reveal" style={{ '--i': i } as CSSProperties} />
        ))}
      </ul>
    </Band>
  );
}
