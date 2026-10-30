import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import { ClayButton, SectionHeading } from '@/components/redesign';

const SOLUTIONS: { title: string; description: string; icon: Asset3dKey }[] = [
  {
    title: 'Custom Business Systems',
    description:
      "Running your business on spreadsheets and WhatsApp? We build the custom system that runs it — like Kikota, our gym-management SaaS.",
    icon: 'svc-cloud',
  },
  {
    title: 'Payment Integration',
    description:
      'Take payments the way Kenya actually pays. M-Pesa STK Push, end to end — plus secure card payments when you need them.',
    icon: 'svc-phone',
  },
  {
    title: 'Booking & Scheduling',
    description:
      'Let clients book you automatically — live availability, slot management, and confirmations handled without the back-and-forth.',
    icon: 'calendar-cutout',
  },
  {
    title: 'E-Commerce',
    description:
      'Sell online, end to end — storefront, cart, checkout, and order management. Built and proven on SHINKUSEN.',
    icon: 'svc-cart',
  },
  {
    title: 'Secure Access',
    description:
      'Logins and protected admin areas done right — role-based access and secure authentication for you and your team.',
    icon: 'svc-lock',
  },
  {
    title: 'Brand & Web Presence',
    description:
      'Identity, design, and a site that proves you belong — the full brand presence, not just a page on the internet.',
    icon: 'svc-print',
  },
];

export default function HomeSolve() {
  return (
    <section className="nxhp-sec" aria-labelledby="nxhp-solve-title">
      <SectionHeading
        id="nxhp-solve-title"
        eyebrow="What We Solve"
        title="SOLUTIONS, NOT JUST SOFTWARE."
        outline="NOT JUST SOFTWARE."
        className="nxhp-reveal"
      />
      <p className="nxhp-intro nx-body nxhp-reveal">
        You don&apos;t need a stack — you need the problem solved. Here&apos;s what we build for businesses.
      </p>

      <ul className="nxhp-solve-grid">
        {SOLUTIONS.map((s, i) => {
          const icon = ASSETS_3D[s.icon];
          return (
            <li key={s.title} className="nxhp-solve-card nx-clay nxhp-reveal" style={{ '--i': i % 3 } as CSSProperties}>
              <span className="nxhp-arrow nx-inset" aria-hidden="true">
                →
              </span>
              <Image
                src={icon.src}
                alt=""
                width={icon.width}
                height={icon.height}
                sizes="96px"
                className="nxhp-solve-icon"
              />
              <p className="nxhp-card-title">{s.title}</p>
              <p className="nxhp-card-text">{s.description}</p>
            </li>
          );
        })}
      </ul>

      <div className="nxhp-solve-strip nx-glass nxhp-reveal">
        <p className="nxhp-solve-strip-text">
          <span className="nxhp-solve-strip-q">Have a problem that doesn&apos;t fit a box?</span>{' '}
          <span className="nxhp-solve-strip-a">That&apos;s our favourite kind.</span>
        </p>
        <ClayButton href="/booking">Book a Consultation →</ClayButton>
      </div>
    </section>
  );
}
