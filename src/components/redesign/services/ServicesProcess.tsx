import type { CSSProperties } from 'react';
import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import { PROCESS_STEPS } from '@/lib/services-data';
import { ClayCard, SectionHeading } from '@/components/redesign';

const ROCKET = ASSETS_3D['misc-rocket'];

export default function ServicesProcess() {
  return (
    <section className="nxsv-sec" aria-labelledby="nxsv-process-title">
      <div className="nxsv-proc-head nxsv-reveal">
        <SectionHeading
          id="nxsv-process-title"
          eyebrow="How it works"
          title="FOUR STEPS. NO SURPRISES."
          outline="NO SURPRISES."
          className="nxsv-proc-heading"
        />
        <Image
          src={ROCKET.src}
          alt=""
          width={ROCKET.width}
          height={ROCKET.height}
          sizes="(min-width: 1200px) 150px, 110px"
          className="nxsv-proc-rocket"
        />
      </div>

      <ol className="nxsv-steps">
        {PROCESS_STEPS.map((step, i) => (
          <ClayCard as="li" key={step.number} className="nxsv-step nxsv-reveal" style={{ '--i': i } as CSSProperties}>
            <span className="nxsv-step-num nx-outline" aria-hidden="true">
              {step.number}
            </span>
            <h3 className="nxsv-step-title">{step.title}</h3>
            <p className="nxsv-step-text">{step.text}</p>
          </ClayCard>
        ))}
      </ol>
    </section>
  );
}
