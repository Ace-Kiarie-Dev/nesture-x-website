'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const PRIVACY_HREF = '/legal/betledger/privacy';

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'Is BetLedger a betting app?',
    a: "No. BetLedger is a tracking tool. You record bets you've placed elsewhere so you can see your real results. We don't take bets or handle money.",
  },
  {
    q: 'Who is BetLedger for?',
    a: 'Anyone aged 18 or over who wants an honest record of their sports betting and a clear view of where their money goes.',
  },
  {
    q: 'Is it free?',
    a: "Pricing details will be shared at launch. Join the waitlist and you'll be the first to know.",
  },
  {
    q: 'When is it launching?',
    a: "BetLedger is currently in testing. Join the waitlist and we'll let you know the moment it's live on Google Play.",
  },
  {
    q: 'Is my data private?',
    a: (
      <>
        Your bet records are yours. Our{' '}
        <Link href={PRIVACY_HREF} className="bl-link">Privacy Policy</Link>
        {' '}explains exactly what we collect and how it&apos;s used.
      </>
    ),
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow/Home/End move focus between questions (WAI-ARIA accordion pattern).
  // Enter and Space toggle natively because each header is a <button>.
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = FAQS.length - 1;
    const next =
      e.key === 'ArrowDown' ? (i === last ? 0 : i + 1) :
      e.key === 'ArrowUp'   ? (i === 0 ? last : i - 1) :
      e.key === 'Home'      ? 0 :
      e.key === 'End'       ? last :
      null;
    if (next === null) return;
    e.preventDefault();
    buttons.current[next]?.focus();
  }

  return (
    <div className="bl-faq-list">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.q} className="bl-faq-item bl-glass bl-lift" data-open={isOpen}>
            <h3>
              <button
                ref={el => { buttons.current[i] = el; }}
                id={btnId}
                type="button"
                className="bl-faq-q"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={e => onKeyDown(e, i)}
              >
                {item.q}
                <ChevronDown size={20} className="bl-faq-chevron" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="bl-faq-a"
              inert={!isOpen}
            >
              <div className="bl-faq-a-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
