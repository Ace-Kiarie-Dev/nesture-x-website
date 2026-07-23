'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NxButton from '@/components/ui/NxButton';

interface LaunchListFormProps {
  projectSlug: string;
  projectName: string;
}

type Stage = 'idle' | 'form' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputSt: React.CSSProperties = {
  width:      '100%',
  background: 'rgba(26,111,212,0.04)',
  border:     '1px solid rgba(26,111,212,0.2)',
  color:      'var(--color-text)',
  fontFamily: 'var(--font-body)',
  fontSize:   '0.92rem',
  padding:    '0.8rem 1rem',
  outline:    'none',
  transition: 'border-color 0.2s',
};

function focusBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(26,111,212,0.55)';
}
function blurBorder(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = 'rgba(26,111,212,0.2)';
}

export default function LaunchListForm({ projectSlug, projectName }: LaunchListFormProps) {
  const [stage, setStage]         = useState<Stage>('idle');
  const [email, setEmail]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res  = await fetch('/api/launch-list', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim(), projectSlug, projectName }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Could not join the launch list. Please try again.');
      setStage('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {stage === 'success' && (
        <motion.p
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.75rem',
            letterSpacing: '0.04em',
            color:         'var(--color-primary)',
          }}
        >
          You&apos;re on the list — we&apos;ll email you at launch.
        </motion.p>
      )}

      {stage === 'idle' && (
        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <NxButton variant="primary" size="md" onClick={() => setStage('form')}>
            Notify me at launch
          </NxButton>
        </motion.div>
      )}

      {stage === 'form' && (
        <motion.form
          key="form"
          onSubmit={submit}
          noValidate
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: '380px', width: '100%' }}
        >
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={focusBorder}
              onBlur={blurBorder}
              disabled={submitting}
              style={{ ...inputSt, flex: '1 1 200px' }}
            />
            <NxButton variant="primary" size="md" type="submit" disabled={submitting}>
              {submitting ? 'Joining…' : 'Notify Me'}
            </NxButton>
          </div>

          {error && (
            <p
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '0.68rem',
                color:         '#ff4444',
                background:    'rgba(255,68,68,0.05)',
                border:        '1px solid rgba(255,68,68,0.2)',
                padding:       '0.7rem 1rem',
                letterSpacing: '0.04em',
              }}
            >
              {error}
            </p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}
