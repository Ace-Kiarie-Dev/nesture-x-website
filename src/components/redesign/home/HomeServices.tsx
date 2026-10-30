'use client';

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { SERVICES } from '@/constants';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import { Band, ClayButton, SectionHeading } from '@/components/redesign';
import { cx } from '@/components/redesign/cx';

type Service = (typeof SERVICES)[number];

const ICONS: Record<Service['id'], Asset3dKey> = {
  web: 'code-window-cutout',
  mobile: 'svc-phone',
  design: 'pen-cutout',
  print: 'svc-print',
  marketing: 'megaphone-cutout',
};

export default function HomeServices() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabId = (svc: Service) => `${uid}-tab-${svc.id}`;
  const panelId = (svc: Service) => `${uid}-panel-${svc.id}`;

  // Tab pattern with automatic activation: arrows move and select, Home / End jump.
  // Both arrow axes work, since the list is vertical on wide screens and a row on phones.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[e.key];
    let next: number;
    if (step !== undefined) next = (active + step + SERVICES.length) % SERVICES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = SERVICES.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Band variant="slate" id="services" aria-labelledby="nxhp-services-title">
      <SectionHeading
        id="nxhp-services-title"
        eyebrow="What We Do"
        title="OUR SERVICES"
        outline="SERVICES"
        className="nxhp-reveal"
      />

      <div className="nxhp-svc">
        <div role="tablist" aria-label="Services" className="nxhp-svc-tabs" onKeyDown={onKeyDown}>
          {SERVICES.map((svc, i) => {
            const on = i === active;
            const icon = ASSETS_3D[ICONS[svc.id]];
            return (
              <button
                key={svc.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={tabId(svc)}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls={panelId(svc)}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className={cx('nxhp-svc-tab', on ? 'nx-inset is-on' : 'nx-clay')}
              >
                <span className="nxhp-svc-num">{svc.number}</span>
                <Image src={icon.src} alt="" width={icon.width} height={icon.height} sizes="40px" className="nxhp-svc-tab-icon" />
                <span className="nxhp-svc-tab-label">{svc.tab}</span>
              </button>
            );
          })}
        </div>

        {/* Every service is in the HTML; hidden panels use the hidden attribute. */}
        <div className="nxhp-svc-panels">
          {SERVICES.map((svc, i) => {
            const icon = ASSETS_3D[ICONS[svc.id]];
            return (
              <div
                key={svc.id}
                id={panelId(svc)}
                role="tabpanel"
                aria-labelledby={tabId(svc)}
                tabIndex={0}
                hidden={i !== active}
                className="nxhp-svc-panel nx-clay"
              >
                <div className="nxhp-svc-visual" style={{ '--nxhp-svc-bg': svc.gradient } as CSSProperties}>
                  <span className="nxhp-svc-ghost" aria-hidden="true">
                    {svc.visual}
                  </span>
                  <Image
                    src={icon.src}
                    alt=""
                    width={icon.width}
                    height={icon.height}
                    sizes="(min-width: 1200px) 260px, 180px"
                    className={cx('nxhp-svc-art', svc.id === 'web' && 'is-code')}
                  />
                </div>

                <div className="nxhp-svc-body">
                  <h3 className="nxhp-svc-title">{svc.headline}</h3>
                  <p className="nx-body nxhp-svc-desc">{svc.description}</p>
                  <ul className="nxhp-svc-features">
                    {svc.features.map((feature) => (
                      <li key={feature}>
                        <span className="nxhp-svc-bullet" aria-hidden="true">
                          →
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="nxhp-ctas">
                    <ClayButton href="/services">See Full Details</ClayButton>
                    <ClayButton href="#contact" variant="ghost">
                      Get a Quote
                    </ClayButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Band>
  );
}
