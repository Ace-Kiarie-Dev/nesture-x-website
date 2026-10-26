import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { cx } from './cx';

type Variant = 'primary' | 'ghost';

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & { variant?: Variant };
type NativeButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: Variant; href?: undefined };

export type ClayButtonProps = LinkButtonProps | NativeButtonProps;

// Clay pill button. With href it renders next/link, otherwise a <button type="button">.
// No 'use client' needed: event handlers work whenever it's rendered from a client component.
export default function ClayButton(props: ClayButtonProps) {
  if (props.href !== undefined) {
    const { variant = 'primary', className, ...rest } = props;
    return <Link className={cx('nx-clay-btn', variant === 'ghost' && 'nx-clay-btn-ghost', className)} {...rest} />;
  }
  const { variant = 'primary', className, type = 'button', ...rest } = props;
  return <button type={type} className={cx('nx-clay-btn', variant === 'ghost' && 'nx-clay-btn-ghost', className)} {...rest} />;
}
