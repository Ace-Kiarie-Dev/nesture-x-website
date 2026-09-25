'use client';

import { useId, useState } from 'react';
import { ArrowRight, BadgeCheck, CircleCheck, Mail } from 'lucide-react';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'loading' | 'success' | 'error';

interface WaitlistFormProps {
  buttonLabel: string;
  note?: string;
}

function readSource(): string {
  try {
    return new URLSearchParams(window.location.search).get('utm_source')?.trim() || 'direct';
  } catch {
    return 'direct';
  }
}

export default function WaitlistForm({ buttonLabel, note }: WaitlistFormProps) {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError]   = useState('');
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
          email:       email.trim(),
          projectSlug: 'betledger',
          projectName: 'BetLedger',
          source:      readSource(),
        }),
      });

      // 409 = already signed up for BetLedger. Nothing new is inserted, and
      // from the visitor's side that's still a success.
      if (res.ok || res.status === 409) {
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
      <div className="bl-form" role="status" aria-live="polite">
        <p className="bl-form-success">
          <CircleCheck size={20} aria-hidden="true" />
          You&apos;re on the list. We&apos;ll let you know when BetLedger launches.
        </p>
      </div>
    );
  }

  const invalid = status === 'error';
  const loading = status === 'loading';

  return (
    <form className="bl-form" onSubmit={submit} noValidate>
      <div className="bl-form-row" data-invalid={invalid}>
        <div className="bl-input-wrap" data-invalid={invalid}>
          <Mail size={18} aria-hidden="true" />
          <label htmlFor={inputId} className="sr-only">Email address</label>
          <input
            id={inputId}
            className="bl-input"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email address"
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
        <button type="submit" className="bl-btn bl-btn--primary" disabled={loading} aria-busy={loading}>
          {loading ? (
            <>
              <span className="bl-spinner" aria-hidden="true" />
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
          <p id={errorId} className="bl-form-error">{error}</p>
        )}
      </div>

      {note && !invalid && (
        <p className="bl-form-note">
          <BadgeCheck size={16} aria-hidden="true" />
          {note}
        </p>
      )}
    </form>
  );
}
