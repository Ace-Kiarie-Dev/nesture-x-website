import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import { Band, Eyebrow } from '@/components/redesign';

const PARTNERS: { name: string; industry: string; art: Asset3dKey }[] = [
  { name: 'Rar Ray Bakes', industry: 'Bakery · Food', art: 'partner-baker' },
  { name: 'MR Right Imports', industry: 'Imports · Fitness Equipment', art: 'partner-importer' },
  { name: 'Joyspark Enterprises', industry: 'Décor · Events', art: 'partner-decorator' },
  { name: 'Vicking Ventures', industry: 'Tours · Travel', art: 'partner-guide' },
  { name: 'ODU Fitness', industry: 'Fitness · Coaching', art: 'partner-coach' },
];

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
        {PARTNERS.map((p, i) => {
          const art = ASSETS_3D[p.art];
          return (
            <li key={p.name} className="nxhp-partner nxhp-reveal" style={{ '--i': i } as CSSProperties}>
              <span className="nxhp-partner-art">
                <Image src={art.src} alt="" width={art.width} height={art.height} sizes="110px" />
              </span>
              <span className="nxhp-partner-badge">NX Partner</span>
              <span className="nxhp-partner-name">{p.name}</span>
              <span className="nxhp-partner-industry">{p.industry}</span>
            </li>
          );
        })}
      </ul>
    </Band>
  );
}
