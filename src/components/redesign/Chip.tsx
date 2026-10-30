import type { ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

type ChipProps = ComponentPropsWithoutRef<'span'> & {
  variant?: 'default' | 'blue';
};

export default function Chip({ variant = 'default', className, children, ...rest }: ChipProps) {
  return (
    <span className={cx(variant === 'blue' ? 'nx-chip-blue' : 'nx-chip', className)} {...rest}>
      {children}
    </span>
  );
}
