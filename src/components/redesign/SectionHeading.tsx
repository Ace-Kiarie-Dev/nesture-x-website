import type { ReactNode } from 'react';
import Eyebrow from './Eyebrow';
import { cx } from './cx';

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: string;
  /** Part of the title drawn as blue outline text. If the title doesn't contain it, it is appended. */
  outline?: string;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
};

function renderTitle(title: string, outline?: string): ReactNode {
  if (!outline) return title;
  const at = title.indexOf(outline);
  if (at === -1) {
    return (
      <>
        {title} <span className="nx-outline">{outline}</span>
      </>
    );
  }
  return (
    <>
      {title.slice(0, at)}
      <span className="nx-outline">{outline}</span>
      {title.slice(at + outline.length)}
    </>
  );
}

export default function SectionHeading({ eyebrow, title, outline, as: Heading = 'h2', id, className }: SectionHeadingProps) {
  return (
    <div className={cx('flex flex-col gap-5', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading id={id} className="nx-h2">
        {renderTitle(title, outline)}
      </Heading>
    </div>
  );
}
