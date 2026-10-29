'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ASSETS_3D } from '@/lib/assets3d';
import { ClayButton, ClayCard } from '@/components/redesign';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import Honeypot from '@/components/ui/Honeypot';
import {
  BUDGETS,
  SERVICES,
  TIMELINES,
  WHATSAPP_FOLLOWUP,
  WHATSAPP_URL,
  useContactForm,
  type RequiredField,
} from '@/lib/useContactForm';

const ENVELOPE = ASSETS_3D['envelope-cutout'];

// Inline messages for the API's existing rule (name, email and brief required). Shown
// under a field only after a failed send left it empty; nothing new is validated.
const FIELD_ERROR: Record<RequiredField, string> = {
  name: 'Add your name so we know who to reply to.',
  email: 'Add your email so we can reply.',
  brief: 'Tell us a little about what you are building.',
};

// /contact's form: the same logic as the homepage section (useContactForm), restyled.
// The success message replaces the form in the same grid cell, so the card keeps the
// form's height and nothing below moves.
export default function ContactForm() {
  const { form, status, setStatus, errorMsg, handle, submit, isInvalid } = useContactForm();
  const nameRef = useRef<HTMLInputElement>(null);
  const sent = status === 'success';

  const fieldProps = (field: RequiredField) =>
    isInvalid(field) ? { 'aria-invalid': true, 'aria-describedby': `nxct-${field}-error` } : {};
  const fieldError = (field: RequiredField) =>
    isInvalid(field) ? (
      <p id={`nxct-${field}-error`} className="nxct-field-error">
        {FIELD_ERROR[field]}
      </p>
    ) : null;

  const again = () => {
    setStatus('idle');
    requestAnimationFrame(() => nameRef.current?.focus());
  };

  return (
    <ClayCard className="nxct-form-card" style={{ padding: 'clamp(24px, 4vw, 44px)' }}>
      <div id="message" className="nxct-stack">
        <form onSubmit={submit} noValidate className="nxct-form" aria-labelledby="nxct-form-title" inert={sent} aria-hidden={sent || undefined}>
          <Honeypot />
          <h2 id="nxct-form-title" className="nxct-form-title">
            Send us a message
          </h2>

          <div className="nxct-row">
            <div className="nx-field">
              <label htmlFor="ct-name">
                Name <span className="nxct-req" aria-hidden="true">*</span>
              </label>
              <input
                ref={nameRef}
                id="ct-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={handle}
                className="nx-input"
                {...fieldProps('name')}
              />
              {fieldError('name')}
            </div>
            <div className="nx-field">
              <label htmlFor="ct-email">
                Email <span className="nxct-req" aria-hidden="true">*</span>
              </label>
              <input
                id="ct-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handle}
                className="nx-input"
                {...fieldProps('email')}
              />
              {fieldError('email')}
            </div>
          </div>

          <div className="nx-field">
            <label htmlFor="ct-phone">Phone / WhatsApp (optional)</label>
            <input
              id="ct-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+254 7XX XXX XXX"
              value={form.phone}
              onChange={handle}
              className="nx-input"
            />
          </div>

          {/* Same "service" values as the select it replaces; nothing picked sends "". */}
          <fieldset className="nx-field nxct-chips">
            <legend>What are you looking to build?</legend>
            <div className="nxct-chip-row">
              {SERVICES.filter((s) => s.value).map((s) => (
                <label key={s.value} className="nxct-chip">
                  <input type="radio" name="service" value={s.value} checked={form.service === s.value} onChange={handle} />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="nx-field">
            <label htmlFor="ct-brief">
              What you&apos;re building <span className="nxct-req" aria-hidden="true">*</span>
            </label>
            <textarea
              id="ct-brief"
              name="brief"
              required
              rows={5}
              placeholder="What are you trying to build? What's the goal?"
              value={form.brief}
              onChange={handle}
              className="nx-input nx-textarea"
              {...fieldProps('brief')}
            />
            {fieldError('brief')}
          </div>

          <div className="nxct-row">
            <div className="nx-field">
              <label htmlFor="ct-budget">Do you have a budget in mind?</label>
              <div className="nx-select">
                <select
                  id="ct-budget"
                  name="budget"
                  value={form.budget}
                  onChange={handle}
                  className={form.budget ? 'nx-input' : 'nx-input is-empty'}
                >
                  {BUDGETS.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="nx-field">
              <label htmlFor="ct-timeline">When are you looking to start?</label>
              <div className="nx-select">
                <select
                  id="ct-timeline"
                  name="timeline"
                  value={form.timeline}
                  onChange={handle}
                  className={form.timeline ? 'nx-input' : 'nx-input is-empty'}
                >
                  {TIMELINES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Announced as it appears; the typed input stays as it was. */}
          <div aria-live="assertive" className="nxct-live">
            {status === 'error' && (
              <p role="alert" className="nx-form-error">
                {errorMsg} Your message is still here, so you can try again
                {' '}or{' '}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  message us on WhatsApp
                </a>
                .
              </p>
            )}
          </div>

          <div className="nxct-submit-row">
            <ClayButton type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className="nxct-submit">
              {status === 'sending' && <span className="nxct-spinner" aria-hidden="true" />}
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </ClayButton>
            <p className="nxct-note">
              We respond within 24 hours. The first conversation is always free. Your details are handled
              as described in our{' '}
              <Link href="/privacy-policy">privacy policy</Link>.
            </p>
          </div>
        </form>

        <div className="nxct-success" role="status" hidden={!sent}>
          {sent && (
            <>
              <Image src={ENVELOPE.src} alt="" width={ENVELOPE.width} height={ENVELOPE.height} sizes="200px" className="nxct-success-img" />
              <p className="nxct-success-title">Message sent. We&apos;ll be in touch.</p>
              <p className="nx-body">
                We&apos;ll take a look and get back to you within 24 hours. Check your inbox for a confirmation.
              </p>
              <a href={WHATSAPP_FOLLOWUP} target="_blank" rel="noopener noreferrer" className="nxct-wa">
                <WhatsAppIcon size={16} />
                Prefer faster? Continue on WhatsApp
              </a>
              <button type="button" onClick={again} className="nxct-again">
                Send another message
              </button>
            </>
          )}
        </div>
      </div>
    </ClayCard>
  );
}
