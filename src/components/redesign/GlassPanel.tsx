import type { HTMLAttributes } from 'react';
import { cx } from './cx';

type GlassPanelProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'aside' | 'article';
};

export default function GlassPanel({ as: Tag = 'div', className, children, ...rest }: GlassPanelProps) {
  return (
    <Tag className={cx('nx-glass p-6 sm:p-8', className)} {...rest}>
      {children}
    </Tag>
  );
}
