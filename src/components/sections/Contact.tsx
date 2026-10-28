'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ClayButton } from '@/components/redesign';
import { ASSETS_3D } from '@/lib/assets3d';
import { CONTACT } from '@/constants';
import { BUDGETS, SERVICES, TIMELINES, WHATSAPP_FOLLOWUP, WHATSAPP_URL, useContactForm, type RequiredField } from '@/lib/useContactForm';
import './Contact.css';

const CHAT = ASSETS_3D['contact-chat'];

// ─── Animation ─────────────────────────────────────────────────────────────────

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
  const { form, status, setStatus, errorMsg, handle, submit, isInvalid } = useContactForm();

  // After a failed send, empty required fields get the error ring and point at the message.
  const invalid = (field: RequiredField) =>
    isInvalid(field) ? { 'aria-invalid': true, 'aria-describedby': 'cx-error' } : {};

  return (
    <section id="contact" className="nxc nx-grid-bg" aria-labelledby="cx-title">
      <div className="nxc-wrap">

        {/* ── Left — headline + details ── */}
        <motion.div
          className="nxc-intro"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p className="nx-eyebrow" variants={item}>
            Get In Touch
          </motion.p>

          <motion.h2 id="cx-title" className="nxc-title" variants={item}>
            LET&apos;S BUILD SOMETHING THAT <span className="nx-outline nxc-title-2">ACTUALLY WORKS.</span>
          </motion.h2>

          <motion.p className="nx-body" variants={item}>
            Got an idea? Half an idea? Just exploring?<br />
            Start the conversation — we&apos;ll figure it out together.
          </motion.p>

          {/* Contact details */}
          <motion.dl className="nxc-details nx-inset" variants={item}>
            {[
              { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { label: 'Phone', value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}` },
              { label: 'Location', value: CONTACT.location, href: null },
            ].map(({ label, value, href }) => (
              <div key={label} className="nxc-detail">
                <dt>{label}</dt>
                <dd>{href ? <a href={href}>{value}</a> : value}</dd>
              </div>
            ))}
          </motion.dl>

          {/* WhatsApp CTA */}
          <motion.div variants={item}>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="nxc-whatsapp">
              <WhatsAppIcon size={16} />
              Message on WhatsApp
            </a>
          </motion.div>

          <Image
            src={CHAT.src}
            alt=""
            width={CHAT.width}
            height={CHAT.height}
            sizes="(min-width: 1100px) 220px, 160px"
            className="nxc-art"
          />
        </motion.div>

        {/* ── Right — form ── */}
        <motion.div
          className="nxc-panel nx-clay"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {status === 'success' ? (
            <motion.div className="nxc-success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="nxc-success-title">YOU&apos;RE IN.</p>
              <p className="nx-body">
                We&apos;ve received your message — we&apos;ll take a look and get back to you within 24 hours.
                Check your inbox for a confirmation.
              </p>

              {/* WhatsApp follow-up */}
              <a href={WHATSAPP_FOLLOWUP} target="_blank" rel="noopener noreferrer" className="nxc-whatsapp nxc-whatsapp--wide">
                <WhatsAppIcon size={14} />
                Prefer faster? Continue on WhatsApp →
              </a>

              <button type="button" onClick={() => setStatus('idle')} className="nxc-again">
                Send another message ↗
              </button>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate className="nxc-form">

              {/* Name + Email */}
              <motion.div className="nxc-row" variants={item}>
                <div className="nx-field">
                  <label htmlFor="cx-name">Name *</label>
                  <input
                    id="cx-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={handle}
                    className="nx-input"
                    {...invalid('name')}
                  />
                </div>
                <div className="nx-field">
                  <label htmlFor="cx-email">Email *</label>
                  <input
                    id="cx-email"
                    name="email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handle}
                    className="nx-input"
                    {...invalid('email')}
                  />
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div className="nx-field" variants={item}>
                <label htmlFor="cx-phone">Phone / WhatsApp (optional)</label>
                <input
                  id="cx-phone"
                  name="phone"
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  value={form.phone}
                  onChange={handle}
                  className="nx-input"
                />
              </motion.div>

              {/* Service */}
              <motion.div className="nx-field" variants={item}>
                <label htmlFor="cx-service">Service</label>
                <div className="nx-select">
                  <select
                    id="cx-service"
                    name="service"
                    value={form.service}
                    onChange={handle}
                    className={form.service ? 'nx-input' : 'nx-input is-empty'}
                  >
                    {SERVICES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Brief */}
              <motion.div className="nx-field" variants={item}>
                <label htmlFor="cx-brief">What you&apos;re building *</label>
                <textarea
                  id="cx-brief"
                  name="brief"
                  required
                  rows={5}
                  placeholder="What are you trying to build? What's the goal?"
                  value={form.brief}
                  onChange={handle}
                  className="nx-input nx-textarea"
                  {...invalid('brief')}
                />
              </motion.div>

              {/* Budget + Timeline */}
              <motion.div className="nxc-row" variants={item}>
                <div className="nx-field">
                  <label htmlFor="cx-budget">Do you have a budget in mind?</label>
                  <div className="nx-select">
                    <select
                      id="cx-budget"
                      name="budget"
                      value={form.budget}
                      onChange={handle}
                      className={form.budget ? 'nx-input' : 'nx-input is-empty'}
                    >
                      {BUDGETS.map(b => (
                        <option key={b.value} value={b.value}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="nx-field">
                  <label htmlFor="cx-timeline">When are you looking to start?</label>
                  <div className="nx-select">
                    <select
                      id="cx-timeline"
                      name="timeline"
                      value={form.timeline}
                      onChange={handle}
                      className={form.timeline ? 'nx-input' : 'nx-input is-empty'}
                    >
                      {TIMELINES.map(t => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>

              {/* Error */}
              {status === 'error' && (
                <motion.p id="cx-error" role="alert" className="nx-form-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {errorMsg}
                </motion.p>
              )}

              {/* Friction line */}
              <motion.p className="nxc-note" variants={item}>
                We typically take on projects where we can add real value — if it&apos;s a fit, we&apos;ll map the next steps together.
              </motion.p>

              {/* Submit */}
              <motion.div variants={item}>
                <ClayButton
                  type="submit"
                  disabled={status === 'sending'}
                  aria-busy={status === 'sending'}
                  className="nxc-submit"
                >
                  {status === 'sending' && <span className="nxc-spinner" aria-hidden="true" />}
                  {status === 'sending' ? 'SENDING…' : 'SEND INQUIRY'}
                </ClayButton>
              </motion.div>

              <motion.p className="nxc-footnote" variants={item}>
                We respond within 24 hours · First conversation is always free
              </motion.p>

            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}

function WhatsAppIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
