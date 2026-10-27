import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { SectionHeading } from '@/components/redesign';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    description:
      "We interrogate the brief. What's the actual problem? What does success look like? We don't start building until we know.",
  },
  {
    number: '02',
    title: 'Design',
    description:
      'Strategy meets aesthetics. Every design decision has a reason behind it — from colour choices to user flows.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Clean, production-grade code. Responsive. Fast. Secure. With payment integrations, backends, and APIs that work as designed.',
  },
  {
    number: '04',
    title: 'Launch & Grow',
    description:
      "We deploy, monitor, and stay engaged. We grow when you grow — that's not a slogan, it's how our equity partnerships work.",
  },
];

const ROCKET = ASSETS_3D['misc-rocket'];

export default function HomeProcess() {
  return (
    <section className="nxhp-sec" aria-labelledby="nxhp-process-title">
      <SectionHeading
        id="nxhp-process-title"
        eyebrow="How We Work"
        title="THE PROCESS"
        outline="PROCESS"
        className="nxhp-reveal"
      />

      <ol className="nxhp-steps">
        {STEPS.map((step, i) => (
          <li key={step.number} className="nxhp-step nx-clay nxhp-reveal" style={{ '--i': i } as CSSProperties}>
            <span className="nxhp-step-num nx-outline" aria-hidden="true">
              {step.number}
            </span>
            <p className="nxhp-card-title">{step.title}</p>
            <p className="nxhp-card-text">{step.description}</p>
            {i === STEPS.length - 1 && (
              <Image
                src={ROCKET.src}
                alt=""
                width={ROCKET.width}
                height={ROCKET.height}
                sizes="110px"
                className="nxhp-step-rocket"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
