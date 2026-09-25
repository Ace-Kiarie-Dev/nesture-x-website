'use client';

import { useId, useState } from 'react';
import { ArrowRight, BadgeCheck, CircleCheck, Mail } from 'lucide-react';

// Shared launch-waitlist form for product landing pages (BetLedger, SoraPesa…).
// Owns the behaviour only — validation, submission, loading/success/error
// states. All styling comes in through `classes`, so each product's scoped
// theme (.theme-betledger, .theme-sorapesa) styles it without shared colours.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'loading' | 'success' | 'error';

export interface WaitlistFormClasses {
  form: string;
  row: string;
  inputWrap: string;
  input: string;
  button: string;
  spinner: string;
  error: string;
  note: string;
  success: string;
}

export interface WaitlistFormProps {
  projectSlug: string;
  projectName: string;
  buttonLabel: string;
  placeholder: string;
  /** Shown after a new signup. */
  successMessage: string;
  /** Shown when the email is already on this project's list (API 409). */
  duplicateMessage: string;
  note?: string;
  classes: WaitlistFormClasses;
}

function readSource(): string {
  try {
    return new URLSearchParams(window.location.search).get('utm_source')?.trim() || 'direct';
  } catch {
    return 'direct';
  }
}

export default function WaitlistForm({
  projectSlug,
  projectName,
  buttonLabel,
  placeholder,
  successMessage,
  duplicateMessage,
  note,
  classes,
}: WaitlistFormProps) {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError]   = useState('');
  const [message, setMessage] = useState(successMessage);
  const errorId = useId();
  const inputId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'loading') return;

    if (!EMAIL_RE.test(email.trim())) {
      setStatus('error');
      setError('Enter a valid email address.');
      return;
    }

    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/launch-list', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email: email.trim(),
          projectSlug,
          projectName,
          source: readSource(),
        }),
      });

      // 409 = already signed up for this project. Nothing new is inserted, and
      // from the visitor's side that's still a success.
      if (res.ok || res.status === 409) {
        setMessage(res.ok ? successMessage : duplicateMessage);
        setStatus('success');
        return;
      }

      const data = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(data.error || 'Could not join the waitlist. Please try again.');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className={classes.form} role="status" aria-live="polite">
        <p className={classes.success}>
          <CircleCheck size={20} aria-hidden="true" />
          {message}
        </p>
      </div>
    );
  }

  const invalid = status === 'error';
  const loading = status === 'loading';

  return (
    <form className={classes.form} onSubmit={submit} noValidate>
      <div className={classes.row} data-invalid={invalid}>
        <div className={classes.inputWrap} data-invalid={invalid}>
          <Mail size={18} aria-hidden="true" />
          <label htmlFor={inputId} className="sr-only">Email address</label>
          <input
            id={inputId}
            className={classes.input}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder={placeholder}
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              if (status === 'error') { setStatus('idle'); setError(''); }
            }}
            disabled={loading}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
          />
        </div>
        <button type="submit" className={classes.button} disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <span className={classes.spinner} aria-hidden="true" />
              Joining…
            </>
          ) : (
            <>
              {buttonLabel}
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <div aria-live="polite">
        {invalid && error && (
          <p id={errorId} className={classes.error}>{error}</p>
        )}
      </div>

      {note && !invalid && (
        <p className={classes.note}>
          <BadgeCheck size={16} aria-hidden="true" />
          {note}
        </p>
      )}
    </form>
  );
}
