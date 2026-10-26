import type { HTMLAttributes } from 'react';
import { cx } from './cx';

type ClayCardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'li';
};

export default function ClayCard({ as: Tag = 'div', className, children, ...rest }: ClayCardProps) {
  return (
    <Tag className={cx('nx-clay p-7 sm:p-9', className)} {...rest}>
      {children}
    </Tag>
  );
}
