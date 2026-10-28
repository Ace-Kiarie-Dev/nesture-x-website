import { Check } from 'lucide-react';
import { cx } from '@/components/redesign/cx';

const LABELS = ['Your details', 'Date & time', 'Confirm', 'Booked'] as const;

// Read-only progress for /booking: it mirrors the page's step state and never sets it.
// From 640px a row of clay nodes; below that "Step 2 of 4" with a thin bar. Styles: booking.css.
export default function BookingStepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <nav className="nxbk-stepper" aria-label="Booking progress">
      <ol className="nxbk-steps">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const state = n < step ? 'done' : n === step ? 'active' : 'todo';
          return (
            <li key={label} className={cx('nxbk-step', `is-${state}`)} aria-current={state === 'active' ? 'step' : undefined}>
              <span className="nxbk-node" aria-hidden="true">
                {state === 'done' ? <Check size={16} strokeWidth={3} /> : n}
              </span>
              <span className="nxbk-step-label">
                {label}
                {state === 'done' && <span className="nx-sr-only"> (done)</span>}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="nxbk-steps-compact">
        <p className="nxbk-compact-text">
          Step {step} of {LABELS.length} <span aria-hidden="true">·</span> <strong>{LABELS[step - 1]}</strong>
        </p>
        <div className="nxbk-bar" aria-hidden="true">
          <span className="nxbk-bar-fill" style={{ width: `${(step / LABELS.length) * 100}%` }} />
        </div>
      </div>
    </nav>
  );
}
