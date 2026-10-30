import type { HTMLAttributes } from 'react';
import { cx } from './cx';

type ClayCardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'article' | 'li';
};

// Padding is inline: the unlayered `* { padding: 0 }` reset in globals.css beats Tailwind's p-* utilities.
export default function ClayCard({ as: Tag = 'div', className, style, children, ...rest }: ClayCardProps) {
  return (
    <Tag className={cx('nx-clay', className)} style={{ padding: 'clamp(28px, 4vw, 36px)', ...style }} {...rest}>
      {children}
    </Tag>
  );
}
