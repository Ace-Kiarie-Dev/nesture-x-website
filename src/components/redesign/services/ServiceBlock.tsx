import type { ReactNode } from 'react';
import Image from 'next/image';
import { ASSETS_3D } from '@/lib/assets3d';
import type { Service } from '@/lib/services-data';
import { Band, Chip, ClayButton, ClayCard, Eyebrow } from '@/components/redesign';
import { cx } from '@/components/redesign/cx';

type ServiceBlockProps = { service: Service; index: number };

// One service: 3D art over a blue glow beside a clay card. Odd blocks (s1, s3, s5) sit on
// the dark page with the art on the left; even blocks (s2, s4, s6) are slate bands with the
// art on the right. Phones stack art above card.
export default function ServiceBlock({ service, index }: ServiceBlockProps) {
  const even = index % 2 === 1;
  const asset = ASSETS_3D[service.asset];
  const titleId = `${service.id}-title`;

  const content: ReactNode = (
    <div className={cx('nxsv-svc nxsv-reveal', even && 'nxsv-svc--flip')}>
      <div className="nxsv-svc-art">
        <span className="nxsv-svc-glow" aria-hidden="true" />
        <Image
          src={asset.src}
          alt=""
          width={asset.width}
          height={asset.height}
          sizes="(min-width: 900px) 440px, 240px"
          className="nxsv-svc-img"
        />
      </div>

      <ClayCard className="nxsv-svc-card">
        <Eyebrow>{service.number} · Service</Eyebrow>
        <h2 id={titleId} className="nxsv-svc-title">
          {service.title}
        </h2>
        <p className="nxsv-svc-sub">{service.sub}</p>
        <p className="nx-body">{service.body}</p>
        <ul className="nxsv-chips" aria-label={`${service.title}: what's included`}>
          {service.chips.map((chip) => (
            <li key={chip}>
              <Chip>{chip}</Chip>
            </li>
          ))}
        </ul>
        <div className="nxsv-svc-foot">
          <ClayButton href="/contact" aria-label={`Ask about ${service.title}`}>
            Ask about this
          </ClayButton>
          <p className="nxsv-svc-seen">Seen in: {service.seenIn.join(', ')}</p>
        </div>
      </ClayCard>
    </div>
  );

  return even ? (
    <Band id={service.id} aria-labelledby={titleId} className="nxsv-svc-band">
      {content}
    </Band>
  ) : (
    <section id={service.id} aria-labelledby={titleId} className="nxsv-sec nxsv-svc-sec">
      {content}
    </section>
  );
}
