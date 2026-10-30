'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ClayButton, GlassPanel } from '@/components/redesign';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Already authenticated? Go straight to quotes
  useEffect(() => {
    fetch('/api/admin/auth')
      .then(r => r.json())
      .then((d: { ok: boolean }) => { if (d.ok) router.replace('/admin/quotes'); })
      .catch(() => {/* stay on login */});
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res  = await fetch('/api/admin/auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json() as { ok: boolean; error?: string };

      if (data.ok) {
        router.replace('/admin/quotes');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Invalid password.');
        setPassword('');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Could not connect. Check your connection.');
    }
  }

  return (
    <main id="nxad-main" className="nxad-login nxad-scope">
      <GlassPanel className="nxad-login-card" style={{ padding: 'clamp(24px, 6vw, 40px)' }}>

        {/* Header */}
        <div className="nxad-login-head">
          <span className="nx-logo">NESTURE<span>-X</span></span>
          <h1 className="nxad-login-title" aria-label="Admin access">
            <span aria-hidden="true">ADMIN</span>
            <span className="nx-outline" aria-hidden="true">ACCESS</span>
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="nxad-login-form">
          <div className="nx-field">
            <label htmlFor="nxad-password">Password</label>
            <input
              id="nxad-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              placeholder="Enter admin password"
              className="nx-input"
              aria-invalid={status === 'error' || undefined}
              aria-describedby={status === 'error' ? 'nxad-login-error' : undefined}
            />
          </div>

          <div className="nxad-live" aria-live="assertive">
            {status === 'error' && (
              <p id="nxad-login-error" className="nx-form-error">
                {errorMsg}
              </p>
            )}
          </div>

          <ClayButton
            type="submit"
            disabled={status === 'loading' || !password}
            aria-busy={status === 'loading' || undefined}
            className="nxad-login-btn"
          >
            {status === 'loading' && <span className="nxad-spinner" aria-hidden="true" />}
            {status === 'loading' ? 'Checking…' : 'Sign in'}
          </ClayButton>
        </form>

      </GlassPanel>
    </main>
  );
}
