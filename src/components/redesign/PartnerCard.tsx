import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import type { Partner } from '@/data/partners';
import { cx } from './cx';

type PartnerCardProps = {
  partner: Partner;
  /** Show the full trading name and the one-line blurb (the /portfolio trust strip). */
  detailed?: boolean;
  className?: string;
  style?: CSSProperties;
};

// Dark clay card for an NX equity partner: 3D art over a glow, "NX Partner" badge,
// name, industry. Renders an <li>; the caller owns the list and its layout.
export default function PartnerCard({ partner, detailed = false, className, style }: PartnerCardProps) {
  const art = ASSETS_3D[partner.art];
  return (
    <li className={cx('nx-partner', className)} style={style}>
      <span className="nx-partner-art">
        <Image src={art.src} alt="" width={art.width} height={art.height} sizes="110px" />
      </span>
      <span className="nx-partner-badge">NX Partner</span>
      <span className="nx-partner-name">{detailed ? partner.longName ?? partner.name : partner.name}</span>
      <span className="nx-partner-industry">{partner.industry}</span>
      {detailed && <span className="nx-partner-blurb">{partner.blurb}</span>}
    </li>
  );
}
