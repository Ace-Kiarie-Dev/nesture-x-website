import { useId, type ChangeEventHandler, type CSSProperties } from 'react';
import { HONEYPOT_FIELD } from '@/lib/honeypot';

// Anti-spam trap: an ordinary-looking text field moved off-screen. People never
// see it, can't tab to it, and screen readers skip it (aria-hidden); bots that
// fill every input fill it too, and the API then quietly drops the submission
// (lib/formGuard.ts). Positioned absolutely, so it takes no space and the form's
// layout is unchanged. Not display:none, which some bots check for.
const OFFSCREEN: CSSProperties = {
  position: 'absolute',
  left: '-10000px',
  top: 'auto',
  width: '1px',
  height: '1px',
  overflow: 'hidden',
};

type HoneypotProps = {
  /** Controlled use, for forms that keep every field in state (booking). */
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

// Rendered only from client components (the forms), so useId is fine without 'use client' here.
export default function Honeypot({ value, onChange }: HoneypotProps) {
  const id = useId();
  return (
    <div style={OFFSCREEN} aria-hidden="true">
      <label htmlFor={id}>Website</label>
      <input
        id={id}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...(onChange ? { value: value ?? '', onChange } : {})}
      />
    </div>
  );
}

/** Reads the trap's value from a submitted form, for forms that don't keep it in state. */
export function honeypotValue(form: HTMLFormElement): string {
  const value = new FormData(form).get(HONEYPOT_FIELD);
  return typeof value === 'string' ? value : '';
}
