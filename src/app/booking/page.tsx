'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NxButton from '@/components/ui/NxButton';
import BookingCalendar from '@/components/booking/BookingCalendar';
import { formatDateLabel, formatSlotLabel } from '@/lib/bookingSlots';
import { CONTACT } from '@/constants';

// ── Types ──────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name:     string;
  email:    string;
  phone:    string;
  service:  string;
  date:     string;
  timeSlot: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

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

const INITIAL: FormData = { name: '', email: '', phone: '', service: '', date: '', timeSlot: '' };

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

// ── Back link ──────────────────────────────────────────────────────────────────

function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
      {label}
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const router = useRouter();

  const [step,       setStep]       = useState<Step>(1);
  const [form,       setForm]       = useState<FormData>(INITIAL);
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ── Form helpers ─────────────────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSlotSelect(date: string, timeSlot: string) {
    setForm(p => ({ ...p, date, timeSlot }));
  }

  const step1Valid = form.name.trim() && form.email.trim() && form.phone.trim();
  const step2Valid = !!form.date && !!form.timeSlot;

  // ── Submit booking ───────────────────────────────────────────────────────────
  async function submitBooking() {
    setSubmitting(true);
    setError('');
    try {
      const res  = await fetch('/api/booking', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Could not save your booking.');
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Step titles ──────────────────────────────────────────────────────────────
  const stepTitle: Record<Step, string> = {
    1: 'TELL US ABOUT YOU.',
    2: 'PICK A DATE & TIME.',
    3: 'CONFIRM YOUR BOOKING.',
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
            A free 30-minute consultation — no payment required. Pick a day and time that works for you.
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
                    <label style={labelSt}>Phone Number *</label>
                    <input
                      name="phone" type="tel" required
                      placeholder="+254 7XX XXX XXX"
                      value={form.phone} onChange={handleChange}
                      onFocus={focusBorder} onBlur={blurBorder}
                      style={inputSt}
                    />
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

            {/* ── Step 2: Pick date & time ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <BookingCalendar
                    selectedDate={form.date || null}
                    selectedTimeSlot={form.timeSlot || null}
                    onSelect={handleSlotSelect}
                  />

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <NxButton
                      variant="primary" size="lg"
                      onClick={() => setStep(3)}
                      disabled={!step2Valid}
                    >
                      Continue →
                    </NxButton>
                    <BackLink label="← Edit details" onClick={() => setStep(1)} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Confirm booking ── */}
            {step === 3 && (
              <motion.div
                key="step3"
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
                    <SummaryRow label="Date"    value={formatDateLabel(form.date)} />
                    <SummaryRow label="Time"    value={formatSlotLabel(form.timeSlot)} />
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
                  This consultation is free — no payment is required.{' '}
                  A confirmation will be sent to{' '}
                  <strong style={{ color: 'rgba(245,245,245,0.72)' }}>{form.email}</strong>.
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
                    onClick={submitBooking}
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? 'BOOKING…' : 'CONFIRM BOOKING'}
                  </NxButton>

                  <BackLink label="← Change date/time" onClick={() => { setError(''); setStep(2); }} />
                </div>
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
                      Booking Confirmed
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'rgba(245,245,245,0.6)', lineHeight: 1.8, margin: 0 }}>
                    You&apos;re booked for{' '}
                    <strong style={{ color: 'rgba(245,245,245,0.82)' }}>{formatDateLabel(form.date)}</strong> at{' '}
                    <strong style={{ color: 'rgba(245,245,245,0.82)' }}>{formatSlotLabel(form.timeSlot)}</strong>.
                    A confirmation email has been sent to{' '}
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
                  See you then. Need to change anything?{' '}
                  <a
                    href={WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25d366', textDecoration: 'none' }}
                  >
                    Reach us on WhatsApp →
                  </a>
                </p>

                <NxButton variant="ghost" size="lg" onClick={() => router.push('/')}>
                  Back to home
                </NxButton>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
