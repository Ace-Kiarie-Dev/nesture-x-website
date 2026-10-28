'use client';

import { useState } from 'react';
import { CONTACT } from '@/constants';

// The contact form's logic, shared by the homepage section (sections/Contact.tsx) and
// /contact (redesign/contact/ContactForm.tsx). Moved here unchanged from Contact.tsx:
// same fields, same POST to /api/contact, same states. Validation is the API's (name,
// email and brief required); nothing is checked on the client.

export interface FormState {
  name: string;
  email: string;
  phone: string;
  service: string;
  brief: string;
  budget: string;
  timeline: string;
}

export type Status = 'idle' | 'sending' | 'success' | 'error';

export type RequiredField = 'name' | 'email' | 'brief';

export const SERVICES = [
  { value: '', label: 'What are you looking to build?' },
  { value: 'Website', label: 'Website' },
  { value: 'Web App', label: 'Web App' },
  { value: 'Branding', label: 'Branding' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

export const BUDGETS = [
  { value: '', label: 'Budget range (optional)' },
  { value: 'Under 50K', label: 'Under 50K' },
  { value: '50K – 150K', label: '50K – 150K' },
  { value: '150K – 500K', label: '150K – 500K' },
  { value: '500K+', label: '500K+' },
  { value: 'Not sure yet', label: 'Not sure yet' },
];

export const TIMELINES = [
  { value: '', label: 'Timeline (optional)' },
  { value: 'ASAP', label: 'ASAP' },
  { value: '2–4 weeks', label: '2–4 weeks' },
  { value: '1–2 months', label: '1–2 months' },
  { value: 'Flexible', label: 'Flexible' },
];

export const WHATSAPP_URL = `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(
  "Hi, I'm interested in working with Nesture-X. I'd like to discuss a project."
)}`;

export const WHATSAPP_FOLLOWUP = `https://wa.me/${CONTACT.phone}?text=${encodeURIComponent(
  "Hi, I just submitted a project request on your site and wanted to follow up directly."
)}`;

const INITIAL: FormState = {
  name: '', email: '', phone: '',
  service: '', brief: '', budget: '', timeline: '',
};

export function useContactForm() {
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

  // After a failed send, empty required fields get the error ring.
  const isInvalid = (field: RequiredField) => status === 'error' && !form[field].trim();

  return { form, status, setStatus, errorMsg, handle, submit, isInvalid };
}
