'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check } from 'lucide-react';
import BookingCalendar from '@/components/booking/BookingCalendar';
import { formatDateLabel, formatSlotLabel } from '@/lib/bookingSlots';
import { CONTACT } from '@/constants';
import { ASSETS_3D } from '@/lib/assets3d';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import Honeypot from '@/components/ui/Honeypot';
import { ClayButton, ClayCard, Eyebrow, GlassPanel } from '@/components/redesign';
import BookingStepper from '@/components/redesign/booking/BookingStepper';
import StepHeading from '@/components/redesign/booking/StepHeading';

// ── Types ──────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name:     string;
  email:    string;
  phone:    string;
  service:  string;
  date:     string;
  timeSlot: string;
  website:  string; // honeypot (components/ui/Honeypot.tsx); stays empty for people
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

const INITIAL: FormData = { name: '', email: '', phone: '', service: '', date: '', timeSlot: '', website: '' };

const WHATSAPP = `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(
  "Hi, I tried to book a consultation on your site and need some help."
)}`;

const CALENDAR = ASSETS_3D['calendar-cutout'];

// One-line helper under each step title. Steps 3 and 4 carry their copy in the body.
const STEP_HELPER: Record<Step, string | null> = {
  1: 'Fields marked * are required.',
  2: 'Pick a day and time that works for you.',
  3: null,
  4: null,
};

// ── Summary row ────────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="nxbk-sum-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

// ── Back link ──────────────────────────────────────────────────────────────────

function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <ClayButton variant="ghost" onClick={onClick} className="nxbk-btn">
      {label}
    </ClayButton>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BookingClient() {
  const router = useRouter();

  const [step,       setStep]       = useState<Step>(1);
  const [form,       setForm]       = useState<FormData>(INITIAL);
  const [error,      setError]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailSent,  setEmailSent]  = useState(true);

  // ── Form helpers ─────────────────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  }

  function handleSlotSelect(date: string, timeSlot: string) {
    setError('');
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
      const data = await res.json() as { error?: string; emailSent?: boolean };
      // Slot just taken: drop it and go back to the calendar, which reloads that
      // day's availability on mount, so Continue stays off until a new time is picked.
      if (res.status === 409) {
        setForm(p => ({ ...p, timeSlot: '' }));
        setError(data.error || 'That slot was just booked by someone else. Please pick another.');
        setStep(2);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Could not save your booking.');
      setEmailSent(data.emailSent !== false);
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
    <main className="nxbk">
      <div className="nxbk-wrap nxbk-page">
        <div className="nxbk-layout">

          {/* ── Page header ── */}
          <header className="nxbk-head">
            <Eyebrow>Book a consultation</Eyebrow>
            <h1 className="nxbk-title" aria-label="Book a consultation.">
              <span className="nxbk-title-line" aria-hidden="true">BOOK A</span>
              <span className="nxbk-title-line nx-outline" aria-hidden="true">CONSULTATION.</span>
            </h1>
            <p className="nxbk-lede">
              A free 30-minute consultation — no payment required. Pick a day and time that works for you.
            </p>
          </header>

          {/* ── Flow ── */}
          <section className="nxbk-flow" aria-label="Booking form">
            <BookingStepper step={step} />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            >
              <GlassPanel className="nxbk-panel" style={{ padding: 'clamp(20px, 3.4vw, 36px)' }}>
                <div className="nxbk-panel-head">
                  <StepHeading step={step}>{stepTitle[step]}</StepHeading>
                  {STEP_HELPER[step] && <p className="nxbk-helper">{STEP_HELPER[step]}</p>}
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
                      <div className="nxbk-fields">
                        <Honeypot value={form.website} onChange={handleChange} />

                        <div className="nx-field">
                          <label htmlFor="bk-name">Full name <span className="nxbk-req" aria-hidden="true">*</span></label>
                          <input
                            id="bk-name" name="name" type="text" required
                            autoComplete="name"
                            placeholder="Your name"
                            value={form.name} onChange={handleChange}
                            className="nx-input"
                          />
                        </div>

                        <div className="nx-field">
                          <label htmlFor="bk-email">Email address <span className="nxbk-req" aria-hidden="true">*</span></label>
                          <input
                            id="bk-email" name="email" type="email" required
                            autoComplete="email"
                            placeholder="your@email.com"
                            value={form.email} onChange={handleChange}
                            className="nx-input"
                          />
                        </div>

                        <div className="nx-field">
                          <label htmlFor="bk-phone">Phone number <span className="nxbk-req" aria-hidden="true">*</span></label>
                          <input
                            id="bk-phone" name="phone" type="tel" required
                            autoComplete="tel"
                            placeholder="+254 7XX XXX XXX"
                            value={form.phone} onChange={handleChange}
                            className="nx-input"
                          />
                        </div>

                        <div className="nx-field">
                          <label htmlFor="bk-service">What do you need? (optional)</label>
                          <div className="nx-select">
                            <select
                              id="bk-service" name="service"
                              value={form.service} onChange={handleChange}
                              className={form.service ? 'nx-input' : 'nx-input is-empty'}
                            >
                              {SERVICES.map(s => (
                                <option key={s.value} value={s.value}>
                                  {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="nxbk-actions">
                          <ClayButton variant="ghost" href="/contact" className="nxbk-btn">
                            Cancel
                          </ClayButton>
                          <ClayButton
                            onClick={() => setStep(2)}
                            disabled={!step1Valid}
                            className="nxbk-btn"
                          >
                            Continue →
                          </ClayButton>
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
                      <BookingCalendar
                        selectedDate={form.date || null}
                        selectedTimeSlot={form.timeSlot || null}
                        onSelect={handleSlotSelect}
                      />

                      <div className="nxbk-live" aria-live="assertive">
                        {error && <p className="nx-form-error">{error}</p>}
                      </div>

                      {/* Sticky on phones so the picked date and time stay on screen. */}
                      <div className="nxbk-pickbar">
                        <p className="nxbk-picked" aria-live="polite">
                          <span className="nxbk-picked-label">Your slot</span>
                          {form.date && form.timeSlot ? (
                            <strong>{formatDateLabel(form.date)} · {formatSlotLabel(form.timeSlot)}</strong>
                          ) : (
                            <span className="nxbk-picked-none">Pick a day, then a time</span>
                          )}
                        </p>
                        <div className="nxbk-actions">
                          <BackLink label="← Edit details" onClick={() => setStep(1)} />
                          <ClayButton
                            onClick={() => setStep(3)}
                            disabled={!step2Valid}
                            className="nxbk-btn"
                          >
                            Continue →
                          </ClayButton>
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
                      className="nxbk-stack"
                    >
                      {/* Summary */}
                      <ClayCard className="nxbk-summary" style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
                        <p className="nxbk-kicker">Booking Summary</p>
                        <dl className="nxbk-sum">
                          <SummaryRow label="Name"    value={form.name} />
                          <SummaryRow label="Email"   value={form.email} />
                          <SummaryRow label="Phone"   value={form.phone} />
                          <SummaryRow label="Service" value={form.service || 'General Consultation'} />
                          <SummaryRow label="Date"    value={formatDateLabel(form.date)} />
                          <SummaryRow label="Time"    value={formatSlotLabel(form.timeSlot)} />
                        </dl>
                        <div className="nxbk-fee">
                          <span className="nxbk-kicker">Fee</span>
                          <strong className="nxbk-fee-amt">FREE</strong>
                        </div>
                      </ClayCard>

                      <p className="nxbk-note">
                        This consultation is free — no payment is required.{' '}
                        A confirmation will be sent to{' '}
                        <strong>{form.email}</strong>.
                      </p>

                      <div className="nxbk-live" aria-live="assertive">
                        {error && <p className="nx-form-error">{error}</p>}
                      </div>

                      <div className="nxbk-actions">
                        <BackLink label="← Change date/time" onClick={() => { setError(''); setStep(2); }} />
                        <ClayButton
                          onClick={submitBooking}
                          disabled={submitting}
                          aria-busy={submitting || undefined}
                          className="nxbk-btn"
                        >
                          {submitting && <span className="nxbk-spinner" aria-hidden="true" />}
                          {submitting ? 'BOOKING…' : 'CONFIRM BOOKING'}
                        </ClayButton>
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
                      className="nxbk-stack"
                    >
                      <div className="nxbk-done">
                        <div className="nxbk-done-art" aria-hidden="true">
                          <span className="nxbk-done-glow" />
                          <Image
                            src={CALENDAR.src}
                            alt=""
                            width={CALENDAR.width}
                            height={CALENDAR.height}
                            sizes="220px"
                            className="nxbk-done-img"
                          />
                        </div>

                        <ClayCard className="nxbk-summary" style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
                          <p className="nxbk-badge">
                            <span className="nxbk-badge-tick" aria-hidden="true"><Check size={14} strokeWidth={3} /></span>
                            Booking Confirmed
                          </p>
                          <p className="nxbk-done-text">
                            You&apos;re booked for{' '}
                            <strong>{formatDateLabel(form.date)}</strong> at{' '}
                            <strong>{formatSlotLabel(form.timeSlot)}</strong>.{' '}
                            {emailSent ? (
                              <>
                                A confirmation email has been sent to{' '}
                                <strong>{form.email}</strong>.
                              </>
                            ) : (
                              <>
                                We couldn&apos;t confirm that the email to{' '}
                                <strong>{form.email}</strong>{' '}
                                went through — your booking is saved either way.
                              </>
                            )}
                          </p>
                        </ClayCard>
                      </div>

                      <p className="nxbk-note">
                        See you then. Need to change anything?{' '}
                        <a
                          href={WHATSAPP}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="nxbk-wa"
                        >
                          <WhatsAppIcon size={16} />
                          Reach us on WhatsApp →
                        </a>
                      </p>

                      <div className="nxbk-actions">
                        <ClayButton variant="ghost" onClick={() => router.push('/')} className="nxbk-btn">
                          Back to home
                        </ClayButton>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </GlassPanel>
            </motion.div>
          </section>
        </div>
      </div>
    </main>
  );
}
