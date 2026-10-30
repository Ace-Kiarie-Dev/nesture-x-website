import type { HTMLAttributes } from 'react';
import { cx } from './cx';

type GlassPanelProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'aside' | 'article';
};

// Padding is inline: the unlayered `* { padding: 0 }` reset in globals.css beats Tailwind's p-* utilities.
export default function GlassPanel({ as: Tag = 'div', className, style, children, ...rest }: GlassPanelProps) {
  return (
    <Tag className={cx('nx-glass', className)} style={{ padding: 'clamp(24px, 3.5vw, 32px)', ...style }} {...rest}>
      {children}
    </Tag>
  );
}
