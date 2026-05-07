'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NxButton from '@/components/ui/NxButton';
import { CONTACT } from '@/constants';

// ── Types ──────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name:    string;
  email:   string;
  phone:   string;
  service: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const FEE = 1000;

const SERVICES = [
  { value: '',                   label: 'What do you need? (optional)' },
  { value: 'Website',            label: 'Website' },
  { value: 'Web App',            label: 'Web App' },
  { value: 'Branding',           label: 'Branding & Identity' },
  { value: 'Mobile App',         label: 'Mobile App' },
  { value: 'Graphic Design',     label: 'Graphic Design' },
  { value: 'Digital Marketing',  label: 'Digital Marketing' },
  { value: 'Not sure yet',       label: "Not sure yet — let's talk" },
];

const INITIAL: FormData = { name: '', email: '', phone: '', service: '' };

const WHATSAPP = `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(
  "Hi, I tried to book a consultation on your site and need some help."
)}`;

// ── Shared input styles ────────────────────────────────────────────────────────

const inputSt: React.CSSProperties = {
  width:             '100%',
  background:        'rgba(26,111,212,0.04)',
  border:            '1px solid rgba(26,111,212,0.2)',
  color:             'var(--color-text)',
  fontFamily:        'var(--font-body)',
  fontSize:          '0.92rem',
  padding:           '0.8rem 1rem',
  outline:           'none',
  appearance:        'none',
  WebkitAppearance:  'none',
  transition:        'border-color 0.2s',
};

const labelSt: React.CSSProperties = {
  display:       'block',
  fontFamily:    'var(--font-mono)',
  fontSize:      '0.58rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color:         'rgba(245,245,245,0.38)',
  marginBottom:  '0.45rem',
};

function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'rgba(26,111,212,0.55)';
}
function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'rgba(26,111,212,0.2)';
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepDots({ step }: { step: Step }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '1rem' }}>
      {([1, 2, 3, 4] as Step[]).map(s => (
        <span
          key={s}
          style={{
            width:      s === step ? '22px' : '6px',
            height:     '5px',
            background: s <= step ? 'var(--color-primary)' : 'rgba(26,111,212,0.18)',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ── Summary row ────────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
      <span style={{
        fontFamily:    'var(--font-mono)',
        fontSize:      '0.56rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color:         'rgba(26,111,212,0.55)',
        width:         '3.5rem',
        flexShrink:    0,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize:   '0.85rem',
        color:      'rgba(245,245,245,0.72)',
        lineHeight: 1.4,
      }}>
        {value}
      </span>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const router = useRouter();

  const [step,         setStep]         = useState<Step>(1);
  const [form,         setForm]         = useState<FormData>(INITIAL);
  const [bookingId,    setBookingId]    = useState('');
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [error,        setError]        = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? '';

  // ── Poll for payment status (step 3) ────────────────────────────────────────
  useEffect(() => {
    if (step !== 3 || !bookingId) return;

    let attempts = 0;
    const MAX_ATTEMPTS = 40; // 40 × 3 s = 2 min

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res  = await fetch(`/api/booking?id=${bookingId}`);
        const data = await res.json() as { status: string };

        if (data.status === 'paid') {
          clearInterval(pollRef.current!);
          setStep(4);
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current!);
          setError('Payment was cancelled or failed. You can try again.');
          setStep(2);
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(pollRef.current!);
          setError('Payment timed out. Please try again or contact us on WhatsApp.');
          setStep(2);
        }
      } catch {
        // Network hiccup — keep polling silently
      }
    }, 3000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [step, bookingId]);

  // ── Form helpers ─────────────────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  const step1Valid = form.name.trim() && form.email.trim() && form.phone.trim();

  // ── Initiate payment ─────────────────────────────────────────────────────────
  async function initiatePayment() {
    setSubmitting(true);
    setError('');
    try {
      const res  = await fetch('/api/booking', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json() as { bookingId?: string; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Payment initiation failed.');
      setBookingId(data.bookingId!);
      setMpesaMessage(data.message || 'Check your phone for the M-Pesa prompt.');
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Step titles ──────────────────────────────────────────────────────────────
  const stepTitle: Record<Step, string> = {
    1: 'TELL US ABOUT YOU.',
    2: 'CONFIRM & PAY.',
    3: 'CHECKING PAYMENT.',
    4: "YOU'RE BOOKED.",
  };

  return (
    <main className="relative overflow-hidden bg-[var(--color-bg)]">
      <div className="grid-overlay absolute inset-0 z-0 pointer-events-none" aria-hidden />

      {/* ── Page hero ── */}
      <section style={{ padding: 'clamp(8rem, 12vw, 14rem) clamp(2rem, 7vw, 8rem) clamp(3rem, 5vw, 5rem)' }}>
        <motion.div
          className="relative z-[1]"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="section-label" style={{ marginBottom: '1.25rem' }}>Consultation Booking</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'clamp(3.5rem, 9vw, 8rem)',
              lineHeight: 0.88,
              color:      'var(--color-text)',
              marginBottom: '1.5rem',
            }}
          >
            BOOK YOUR<br />CONSULTATION.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   'clamp(0.95rem, 1.4vw, 1.1rem)',
              lineHeight: 1.9,
              color:      'rgba(245,245,245,0.5)',
              maxWidth:   '34rem',
            }}
          >
            A KES {FEE.toLocaleString()} fee secures your slot — redeemable in full against your project cost if we proceed.
          </p>
        </motion.div>
      </section>

      {/* ── Form panel ── */}
      <section style={{ padding: '0 clamp(2rem, 7vw, 8rem) clamp(6rem, 10vw, 10rem)' }}>
        <motion.div
          className="relative z-[1]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
          style={{
            maxWidth:   '560px',
            background: 'rgba(13,27,62,0.72)',
            border:     '1px solid rgba(26,111,212,0.22)',
            padding:    'clamp(2rem, 5vw, 3rem)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <StepDots step={step} />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize:   'clamp(1.75rem, 4vw, 2.4rem)',
                lineHeight: 0.92,
                color:      'var(--color-text)',
                margin:     0,
              }}
            >
              {stepTitle[step]}
            </h2>
          </div>

          <AnimatePresence mode="wait">

            {/* ── Step 1: Contact info ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                  <div>
                    <label style={labelSt}>Full Name *</label>
                    <input
                      name="name" type="text" required
                      placeholder="Your name"
                      value={form.name} onChange={handleChange}
                      onFocus={focusBorder} onBlur={blurBorder}
                      style={inputSt}
                    />
                  </div>

                  <div>
                    <label style={labelSt}>Email Address *</label>
                    <input
                      name="email" type="email" required
                      placeholder="your@email.com"
                      value={form.email} onChange={handleChange}
                      onFocus={focusBorder} onBlur={blurBorder}
                      style={inputSt}
                    />
                  </div>

                  <div>
                    <label style={labelSt}>M-Pesa Phone Number *</label>
                    <input
                      name="phone" type="tel" required
                      placeholder="+254 7XX XXX XXX"
                      value={form.phone} onChange={handleChange}
                      onFocus={focusBorder} onBlur={blurBorder}
                      style={inputSt}
                    />
                    <p style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '0.56rem',
                      letterSpacing: '0.06em',
                      color:         'rgba(245,245,245,0.25)',
                      marginTop:     '0.35rem',
                    }}>
                      The M-Pesa payment prompt will be sent to this number
                    </p>
                  </div>

                  <div>
                    <label style={labelSt}>What do you need? (optional)</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        name="service"
                        value={form.service} onChange={handleChange}
                        onFocus={focusBorder} onBlur={blurBorder}
                        style={{
                          ...inputSt,
                          color:  form.service ? 'var(--color-text)' : 'rgba(245,245,245,0.32)',
                          cursor: 'pointer',
                        }}
                      >
                        {SERVICES.map(s => (
                          <option key={s.value} value={s.value} style={{ background: '#0d1b3e', color: 'var(--color-text)' }}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,111,212,0.5)', pointerEvents: 'none', fontSize: '0.62rem' }}>▼</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    <NxButton
                      variant="primary" size="lg"
                      onClick={() => setStep(2)}
                      disabled={!step1Valid}
                    >
                      Continue →
                    </NxButton>
                    <NxButton variant="ghost" size="lg" href="/contact">
                      Cancel
                    </NxButton>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ── Step 2: Confirm + pay ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {/* Summary */}
                <div style={{
                  border:       '1px solid rgba(26,111,212,0.2)',
                  padding:      '1.4rem',
                  background:   'rgba(26,111,212,0.04)',
                  marginBottom: '1.5rem',
                }}>
                  <p style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '0.56rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         'rgba(245,245,245,0.3)',
                    marginBottom:  '1rem',
                  }}>
                    Booking Summary
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <SummaryRow label="Name"    value={form.name} />
                    <SummaryRow label="Email"   value={form.email} />
                    <SummaryRow label="Phone"   value={form.phone} />
                    <SummaryRow label="Service" value={form.service || 'General Consultation'} />
                  </div>
                  <div style={{
                    borderTop:      '1px solid rgba(26,111,212,0.14)',
                    marginTop:      '1.2rem',
                    paddingTop:     '1.2rem',
                    display:        'flex',
                    justifyContent: 'space-between',
                    alignItems:     'baseline',
                  }}>
                    <span style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '0.56rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color:         'rgba(245,245,245,0.3)',
                    }}>
                      Consultation Fee
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize:   '2.2rem',
                      color:      'var(--color-primary)',
                      lineHeight: 1,
                    }}>
                      KES {FEE.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontFamily:   'var(--font-body)',
                  fontSize:     '0.82rem',
                  color:        'rgba(245,245,245,0.42)',
                  lineHeight:   1.8,
                  marginBottom: '1.4rem',
                  borderLeft:   '2px solid rgba(26,111,212,0.2)',
                  paddingLeft:  '0.85rem',
                }}>
                  An M-Pesa STK prompt will be sent to{' '}
                  <strong style={{ color: 'rgba(245,245,245,0.72)' }}>{form.phone}</strong>.
                  Enter your PIN to confirm.{' '}
                  <span style={{ color: 'rgba(245,245,245,0.3)' }}>
                    The fee is redeemable against your project cost if we proceed.
                  </span>
                </p>

                {error && (
                  <p style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '0.68rem',
                    color:         '#ff4444',
                    background:    'rgba(255,68,68,0.05)',
                    border:        '1px solid rgba(255,68,68,0.2)',
                    padding:       '0.7rem 1rem',
                    marginBottom:  '1.25rem',
                    letterSpacing: '0.04em',
                  }}>
                    {error}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  <NxButton
                    variant="primary" size="lg"
                    onClick={initiatePayment}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'SENDING PROMPT…' : `PAY KES ${FEE.toLocaleString()} VIA M-PESA`}
                  </NxButton>

                  <button
                    onClick={() => { setError(''); setStep(1); }}
                    data-hover
                    style={{
                      background:    'none',
                      border:        'none',
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '0.6rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color:         'rgba(245,245,245,0.28)',
                      cursor:        'pointer',
                      padding:       '0.5rem',
                      transition:    'color 0.2s',
                      alignSelf:     'flex-start',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.6)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.28)')}
                  >
                    ← Edit details
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Waiting for payment ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                  <div style={{ position: 'relative', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="pulse-ring" style={{ position: 'absolute', inset: 0, border: '1px solid rgba(26,111,212,0.35)' }} />
                    <div className="pulse-ring pulse-ring--delay" style={{ position: 'absolute', inset: '10px', border: '1px solid rgba(26,111,212,0.5)' }} />
                    <div style={{
                      width:          '30px',
                      height:         '30px',
                      background:     'rgba(26,111,212,0.12)',
                      border:         '1px solid rgba(26,111,212,0.45)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                    }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--color-primary)' }}>M</span>
                    </div>
                  </div>
                </div>

                <p style={{
                  fontFamily:   'var(--font-display)',
                  fontSize:     '1.4rem',
                  color:        'var(--color-text)',
                  marginBottom: '0.75rem',
                  lineHeight:   1,
                }}>
                  WAITING FOR PAYMENT
                </p>

                <p style={{
                  fontFamily:   'var(--font-body)',
                  fontSize:     '0.85rem',
                  color:        'rgba(245,245,245,0.5)',
                  lineHeight:   1.8,
                  marginBottom: '0.5rem',
                }}>
                  {mpesaMessage}
                </p>

                <p style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.58rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color:         'rgba(245,245,245,0.22)',
                  marginBottom:  '2.25rem',
                }}>
                  Checking automatically every 3 seconds…
                </p>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(245,245,245,0.28)', lineHeight: 1.7 }}>
                  Didn&apos;t get the prompt?{' '}
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25d366', textDecoration: 'none' }}
                  >
                    Contact us on WhatsApp →
                  </a>
                </p>
              </motion.div>
            )}

            {/* ── Step 4: Success ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{
                  border:       '1px solid rgba(26,111,212,0.28)',
                  padding:      '1.4rem',
                  background:   'rgba(26,111,212,0.06)',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      width:          '24px',
                      height:         '24px',
                      background:     'rgba(26,111,212,0.2)',
                      border:         '1px solid rgba(26,111,212,0.4)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      fontSize:       '0.7rem',
                      color:          'var(--color-primary)',
                      flexShrink:     0,
                    }}>
                      ✓
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(26,111,212,0.7)' }}>
                      Payment Confirmed
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(245,245,245,0.6)', lineHeight: 1.8, margin: 0 }}>
                    KES {FEE.toLocaleString()} received. A confirmation email has been sent to{' '}
                    <strong style={{ color: 'rgba(245,245,245,0.82)' }}>{form.email}</strong>.
                  </p>
                </div>

                <p style={{
                  fontFamily:   'var(--font-body)',
                  fontSize:     '0.88rem',
                  color:        'rgba(245,245,245,0.5)',
                  lineHeight:   1.85,
                  marginBottom: '1.75rem',
                }}>
                  Now pick your time slot on Calendly. Slots available{' '}
                  <strong style={{ color: 'rgba(245,245,245,0.78)' }}>Monday – Friday</strong>:
                  <br />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.05em', color: 'rgba(245,245,245,0.45)' }}>
                    12:00 PM – 12:45 PM &nbsp;·&nbsp; 3:00 PM – 3:45 PM
                  </span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <a
                    href={`${calendlyUrl}?name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-hover
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      gap:            '0.75rem',
                      padding:        '0.9rem 2rem',
                      background:     'var(--color-primary)',
                      fontFamily:     'var(--font-body)',
                      fontWeight:     600,
                      fontSize:       '0.88rem',
                      letterSpacing:  '0.06em',
                      textTransform:  'uppercase',
                      color:          'var(--color-text)',
                      textDecoration: 'none',
                      clipPath:       'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)',
                      transition:     'opacity 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    PICK YOUR SLOT ON CALENDLY →
                  </a>

                  <button
                    onClick={() => router.push('/')}
                    data-hover
                    style={{
                      background:    'none',
                      border:        'none',
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '0.58rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color:         'rgba(245,245,245,0.25)',
                      cursor:        'pointer',
                      padding:       '0.5rem',
                      transition:    'color 0.2s',
                      alignSelf:     'flex-start',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.55)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.25)')}
                  >
                    Back to home →
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
