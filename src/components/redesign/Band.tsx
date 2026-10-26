import type { ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

type BandProps = ComponentPropsWithoutRef<'section'> & {
  /** "dark" paints the page background, "slate" the alternating band colour. */
  variant?: 'dark' | 'slate';
};

// Full-bleed section band. Place it inside a max-width container; see .nx-band.
export default function Band({ variant = 'slate', className, children, ...rest }: BandProps) {
  return (
    <section className={cx('nx-band', variant === 'dark' && 'nx-band--dark', className)} {...rest}>
      {children}
    </section>
  );
}
