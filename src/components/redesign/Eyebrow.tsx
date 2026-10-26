import type { ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export default function Eyebrow({ className, children, ...rest }: ComponentPropsWithoutRef<'p'>) {
  return (
    <p className={cx('nx-eyebrow', className)} {...rest}>
      {children}
    </p>
  );
}
