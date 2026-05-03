'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NxButton from '@/components/ui/NxButton';
import { CONTACT } from '@/constants';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  brief: string;
  budget: string;
  timeline: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

// ─── Constants ─────────────────────────────────────────────────────────────────

const SERVICES = [
  { value: '', label: 'What are you looking to build?' },
  { value: 'Website', label: 'Website' },
  { value: 'Web App', label: 'Web App' },
  { value: 'Branding', label: 'Branding' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

const BUDGETS = [
  { value: '', label: 'Budget range (optional)' },
  { value: 'Under 50K', label: 'Under 50K' },
  { value: '50K – 150K', label: '50K – 150K' },
  { value: '150K – 500K', label: '150K – 500K' },
  { value: '500K+', label: '500K+' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

const TIMELINES = [
  { value: '', label: 'Timeline (optional)' },
  { value: 'ASAP', label: 'ASAP' },
  { value: '2–4 weeks', label: '2–4 weeks' },
  { value: '1–2 months', label: '1–2 months' },
  { value: 'Flexible', label: 'Flexible' },
];

const WHATSAPP_URL = `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(
  "Hi, I'm interested in working with Nesture-X. I'd like to discuss a project."
)}`;

const WHATSAPP_FOLLOWUP = `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(
  "Hi, I just submitted a project request on your site and wanted to follow up directly."
)}`;

const INITIAL: FormState = {
  name: '', email: '', phone: '',
  service: '', brief: '', budget: '', timeline: '',
};

// ─── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(26,111,212,0.04)',
  border: '1px solid rgba(26,111,212,0.18)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  padding: '0.85rem 1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.6rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(245,245,245,0.40)',
  marginBottom: '0.5rem',
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

// ─── Main component ────────────────────────────────────────────────────────────

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handle(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Send failed');
      setStatus('success');
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  return (
    <section
      id="contact"
      style={{
        background: 'var(--color-surface)',
        padding: 'clamp(6rem, 10vw, 11rem) clamp(2rem, 7vw, 8rem)',
        borderTop: '1px solid rgba(26,111,212,0.10)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(4rem, 8vw, 8rem)',
          alignItems: 'start',
        }}
      >

        {/* ── Left — headline + details ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p className="section-label" style={{ marginBottom: '2.5rem' }} variants={item}>
            Get In Touch
          </motion.p>

          <motion.h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.8rem, 5vw, 5rem)',
              lineHeight: 0.9,
              color: 'var(--color-text)',
              marginBottom: '2rem',
            }}
            variants={item}
          >
            LET&apos;S BUILD SOMETHING THAT ACTUALLY WORKS.
          </motion.h2>

          <motion.p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.3vw, 1.05rem)',
              lineHeight: 1.9,
              color: 'rgba(245,245,245,0.55)',
              marginBottom: '3.5rem',
            }}
            variants={item}
          >
            Got an idea? Half an idea? Just exploring?<br />
            Start the conversation — we&apos;ll figure it out together.
          </motion.p>

          {/* Contact details */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}
            variants={stagger}
          >
            {[
              { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { label: 'Phone', value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}` },
              { label: 'Location', value: CONTACT.location, href: null },
            ].map(({ label, value, href }) => (
              <motion.div
                key={label}
                variants={item}
                style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(26,111,212,0.6)',
                    flexShrink: 0,
                    width: '4.5rem',
                  }}
                >
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    data-hover
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'rgba(245,245,245,0.70)',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.70)')}
                  >
                    {value}
                  </a>
                ) : (
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'rgba(245,245,245,0.70)' }}>
                    {value}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* WhatsApp CTA */}
          <motion.div variants={item}>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1.5rem',
                border: '1px solid rgba(37,211,102,0.35)',
                background: 'rgba(37,211,102,0.06)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#25d366',
                textDecoration: 'none',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.12)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,0.55)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,0.35)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Message on WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* ── Right — form ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: 'clamp(3rem, 5vw, 4rem)',
                border: '1px solid rgba(26,111,212,0.20)',
                background: 'rgba(26,111,212,0.04)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 6vw, 5rem)',
                  lineHeight: 0.9,
                  color: 'var(--color-text)',
                  marginBottom: '1.5rem',
                }}
              >
                YOU&apos;RE IN.
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'rgba(245,245,245,0.60)',
                lineHeight: 1.85,
                marginBottom: '2.5rem',
              }}>
                We&apos;ve received your message — we&apos;ll take a look and get back to you within 24 hours.
                Check your inbox for a confirmation.
              </p>

              {/* WhatsApp follow-up */}
              <a
                href={WHATSAPP_FOLLOWUP}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.8rem 1.4rem',
                  border: '1px solid rgba(37,211,102,0.35)',
                  background: 'rgba(37,211,102,0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#25d366',
                  textDecoration: 'none',
                  transition: 'background 0.2s, border-color 0.2s',
                  marginBottom: '2rem',
                  width: '100%',
                  justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.12)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,0.55)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.06)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,0.35)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Prefer faster? Continue on WhatsApp →
              </a>

              <button
                onClick={() => setStatus('idle')}
                data-hover
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,245,0.30)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.30)')}
              >
                Send another message ↗
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Name + Email */}
                <motion.div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                  variants={item}
                >
                  <div>
                    <label htmlFor="cx-name" style={labelStyle}>Name *</label>
                    <input
                      id="cx-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={handle}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(26,111,212,0.18)')}
                    />
                  </div>
                  <div>
                    <label htmlFor="cx-email" style={labelStyle}>Email *</label>
                    <input
                      id="cx-email"
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handle}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(26,111,212,0.18)')}
                    />
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div variants={item}>
                  <label htmlFor="cx-phone" style={labelStyle}>Phone / WhatsApp (optional)</label>
                  <input
                    id="cx-phone"
                    name="phone"
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={form.phone}
                    onChange={handle}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(26,111,212,0.18)')}
                  />
                </motion.div>

                {/* Service */}
                <motion.div variants={item}>
                  <label htmlFor="cx-service" style={labelStyle}>Service</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      id="cx-service"
                      name="service"
                      value={form.service}
                      onChange={handle}
                      style={{ ...inputStyle, color: form.service ? 'var(--color-text)' : 'rgba(245,245,245,0.35)', cursor: 'none' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(26,111,212,0.18)')}
                    >
                      {SERVICES.map(s => (
                        <option key={s.value} value={s.value} style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,111,212,0.5)', pointerEvents: 'none', fontSize: '0.7rem' }}>▼</span>
                  </div>
                </motion.div>

                {/* Brief */}
                <motion.div variants={item}>
                  <label htmlFor="cx-brief" style={labelStyle}>What you&apos;re building *</label>
                  <textarea
                    id="cx-brief"
                    name="brief"
                    required
                    rows={5}
                    placeholder="What are you trying to build? What's the goal?"
                    value={form.brief}
                    onChange={handle}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(26,111,212,0.18)')}
                  />
                </motion.div>

                {/* Budget + Timeline */}
                <motion.div
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                  variants={item}
                >
                  <div>
                    <label htmlFor="cx-budget" style={labelStyle}>Do you have a budget in mind?</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="cx-budget"
                        name="budget"
                        value={form.budget}
                        onChange={handle}
                        style={{ ...inputStyle, color: form.budget ? 'var(--color-text)' : 'rgba(245,245,245,0.35)', cursor: 'none' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(26,111,212,0.18)')}
                      >
                        {BUDGETS.map(b => (
                          <option key={b.value} value={b.value} style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                            {b.label}
                          </option>
                        ))}
                      </select>
                      <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,111,212,0.5)', pointerEvents: 'none', fontSize: '0.7rem' }}>▼</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cx-timeline" style={labelStyle}>When are you looking to start?</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        id="cx-timeline"
                        name="timeline"
                        value={form.timeline}
                        onChange={handle}
                        style={{ ...inputStyle, color: form.timeline ? 'var(--color-text)' : 'rgba(245,245,245,0.35)', cursor: 'none' }}
                        onFocus={e => (e.target.style.borderColor = 'rgba(26,111,212,0.55)')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(26,111,212,0.18)')}
                      >
                        {TIMELINES.map(t => (
                          <option key={t.value} value={t.value} style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(26,111,212,0.5)', pointerEvents: 'none', fontSize: '0.7rem' }}>▼</span>
                    </div>
                  </div>
                </motion.div>

                {/* Error */}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#ff4444',
                      letterSpacing: '0.05em',
                      padding: '0.75rem 1rem',
                      border: '1px solid rgba(255,68,68,0.25)',
                      background: 'rgba(255,68,68,0.05)',
                    }}
                  >
                    {errorMsg}
                  </motion.p>
                )}

                {/* Friction line */}
                <motion.p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    lineHeight: 1.7,
                    color: 'rgba(245,245,245,0.28)',
                    borderLeft: '2px solid rgba(26,111,212,0.2)',
                    paddingLeft: '0.85rem',
                  }}
                  variants={item}
                >
                  We typically take on projects where we can add real value — if it&apos;s a fit, we&apos;ll map the next steps together.
                </motion.p>

                {/* Submit */}
                <motion.div variants={item}>
                  <NxButton
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full"
                  >
                    {status === 'sending' ? 'SENDING…' : 'SEND INQUIRY'}
                  </NxButton>
                </motion.div>

                <motion.p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,245,0.25)',
                    textAlign: 'center',
                  }}
                  variants={item}
                >
                  We respond within 24 hours · First conversation is always free
                </motion.p>

              </div>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}
