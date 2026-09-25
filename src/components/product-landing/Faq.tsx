'use client';

import { useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Shared FAQ accordion for product landing pages. One item open at a time,
// WAI-ARIA accordion keyboard support. Styling comes in through `classes`.

export interface FaqItem {
  q: string;
  a: React.ReactNode;
}

export interface FaqClasses {
  list: string;
  item: string;
  question: string;
  chevron: string;
  answer: string;
  answerInner: string;
}

export interface FaqProps {
  items: FaqItem[];
  classes: FaqClasses;
  /** Index open on first render; null for all closed. */
  defaultOpen?: number | null;
}

export default function Faq({ items, classes, defaultOpen = 0 }: FaqProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow/Home/End move focus between questions (WAI-ARIA accordion pattern).
  // Enter and Space toggle natively because each header is a <button>.
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = items.length - 1;
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
    <div className={classes.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.q} className={classes.item} data-open={isOpen}>
            <h3>
              <button
                ref={el => { buttons.current[i] = el; }}
                id={btnId}
                type="button"
                className={classes.question}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={e => onKeyDown(e, i)}
              >
                {item.q}
                <ChevronDown size={20} className={classes.chevron} aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={classes.answer}
              inert={!isOpen}
            >
              <div className={classes.answerInner}>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
