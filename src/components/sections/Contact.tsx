'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ClayButton } from '@/components/redesign';
import { ASSETS_3D } from '@/lib/assets3d';
import { CONTACT } from '@/constants';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
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
