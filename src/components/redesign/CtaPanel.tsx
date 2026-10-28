import Image from 'next/image';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import ClayButton from './ClayButton';
import { cx } from './cx';

type CtaLink = { href: string; label: string };

type CtaPanelProps = {
  /** id for the heading, so the caller's section can be aria-labelledby it. */
  titleId: string;
  title: string;
  text: string;
  primary: CtaLink;
  secondary: CtaLink;
  art: Asset3dKey;
  artAlt: string;
  /** Flip the art horizontally (e.g. so a pointing character points at the message). */
  mirror?: boolean;
  className?: string;
};

// Final call-to-action: the homepage CTA's blue gradient panel with a white-clay primary
// button, a glass ghost button and a 3D character. Styles in hybrid.css (.nx-cta).
// No GravityText. Used by /services and /about.
export default function CtaPanel({ titleId, title, text, primary, secondary, art, artAlt, mirror = false, className }: CtaPanelProps) {
  const asset = ASSETS_3D[art];
  return (
    <div className={cx('nx-cta', className)}>
      <div className="nx-cta-body">
        <h2 id={titleId} className="nx-cta-title">
          {title}
        </h2>
        <p className="nx-cta-text">{text}</p>
        <div className="nx-cta-btns">
          <ClayButton href={primary.href} className="nx-btn-white">
            {primary.label}
          </ClayButton>
          <ClayButton href={secondary.href} variant="ghost" className="nx-btn-glass">
            {secondary.label}
          </ClayButton>
        </div>
      </div>
      <Image
        src={asset.src}
        alt={artAlt}
        width={asset.width}
        height={asset.height}
        sizes="(min-width: 1100px) 250px, (min-width: 768px) 190px, 150px"
        className={cx('nx-cta-art', mirror && 'nx-cta-art--mirror')}
      />
    </div>
  );
}
