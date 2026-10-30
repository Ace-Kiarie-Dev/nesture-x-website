'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// The step title. When the step changes (not on first load) it takes focus, so keyboard
// and screen-reader users land at the top of the new step. Purely presentational: it
// watches the step, it doesn't change it.
export default function StepHeading({ step, children }: { step: number; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shown = useRef(step);

  useEffect(() => {
    if (shown.current === step) return;
    shown.current = step;
    ref.current?.focus();
  }, [step]);

  return (
    <h2 ref={ref} tabIndex={-1} className="nxbk-step-title">
      {children}
    </h2>
  );
}
