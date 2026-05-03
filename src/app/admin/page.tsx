'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

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
    <div style={{
      minHeight:       '100vh',
      background:      '#0a0a0a',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      fontFamily:      'var(--font-body), sans-serif',
    }}>

      {/* Grid overlay */}
      <div className="grid-overlay" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div style={{
        position:   'relative',
        zIndex:     1,
        width:      'min(400px, calc(100vw - 2rem))',
        padding:    '2.5rem',
        background: 'rgba(13,27,62,0.6)',
        border:     '1px solid rgba(26,111,212,0.2)',
        backdropFilter: 'blur(20px)',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.58rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'rgba(26,111,212,0.65)',
            marginBottom:  '0.5rem',
          }}>
            Nesture-X
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize:   '2.2rem',
            color:      'var(--color-text)',
            lineHeight: 0.95,
            margin:     0,
          }}>
            ADMIN ACCESS
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display:       'block',
              fontFamily:    'var(--font-mono)',
              fontSize:      '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'rgba(245,245,245,0.38)',
              marginBottom:  '0.45rem',
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Enter admin password"
              style={{
                width:            '100%',
                background:       'rgba(26,111,212,0.04)',
                border:           '1px solid rgba(26,111,212,0.2)',
                color:            'var(--color-text)',
                fontFamily:       'var(--font-body)',
                fontSize:         '0.95rem',
                padding:          '0.8rem 1rem',
                outline:          'none',
                boxSizing:        'border-box',
              }}
              onFocus={e  => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
              onBlur={e   => (e.target.style.borderColor = 'rgba(26,111,212,0.2)')}
            />
          </div>

          {status === 'error' && (
            <p style={{
              fontFamily:   'var(--font-mono)',
              fontSize:     '0.68rem',
              color:        '#ff4444',
              background:   'rgba(255,68,68,0.05)',
              border:       '1px solid rgba(255,68,68,0.2)',
              padding:      '0.6rem 0.85rem',
              letterSpacing:'0.04em',
              margin:       0,
            }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !password}
            style={{
              background:    'var(--color-primary)',
              border:        'none',
              color:         'var(--color-text)',
              fontFamily:    'var(--font-body)',
              fontWeight:    600,
              fontSize:      '0.88rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding:       '0.85rem',
              cursor:        status === 'loading' ? 'wait' : 'pointer',
              opacity:       status === 'loading' ? 0.7 : 1,
              transition:    'opacity 0.2s',
              clipPath:      'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
            }}
          >
            {status === 'loading' ? 'CHECKING…' : 'ENTER →'}
          </button>
        </form>

      </div>
    </div>
  );
}
