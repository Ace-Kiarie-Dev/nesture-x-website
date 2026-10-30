import type { CSSProperties } from 'react';
import { ClayCard, SectionHeading } from '@/components/redesign';

const VALUES = [
  {
    title: 'Solutions over products',
    body: "We don't ship deliverables, we solve problems. Every brief is interrogated until we understand the real challenge. A logo isn't just a logo, it's a brand presence. A website isn't just a website, it's a growth tool.",
  },
  {
    title: 'Ideas deserve to live',
    body: 'Every client walks in with a vision, some clear, some half-formed. We are the bridge between imagination and reality, and we take ideas seriously, however early.',
  },
  {
    title: 'Craft without compromise',
    body: "Whether it's a business card or a full-stack web app, the attention to detail, responsiveness and finish is the same. We build things we're proud to put our name on.",
  },
  {
    title: 'Partnership mindset',
    body: "We don't disappear after delivery. We invest in our clients' growth, sometimes literally, through equity partnerships. We grow when they grow.",
  },
  {
    title: 'Rooted in Nairobi, global in reach',
    body: 'Proudly Kenyan: M-Pesa, mobile-first, the hustle. But our standards, our tools and our ambition are global. We build for Africa with a world-class bar.',
  },
];

// Bento: the first value is the big card (two rows tall on desktop), four beside it.
export default function AboutValues() {
  return (
    <section className="nxab-sec" aria-labelledby="nxab-values-title">
      <SectionHeading
        id="nxab-values-title"
        eyebrow="What we stand for"
        title="FIVE THINGS WE DON'T BEND ON."
        outline="WE DON'T BEND ON."
        className="nxab-reveal"
      />
      <ol className="nxab-values">
        {VALUES.map((v, i) => (
          <ClayCard as="li" key={v.title} className="nxab-value nxab-reveal" style={{ '--i': i } as CSSProperties}>
            <span className="nxab-value-num nx-outline" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="nxab-value-title">{v.title}</h3>
            <p className="nxab-value-text">{v.body}</p>
          </ClayCard>
        ))}
      </ol>
    </section>
  );
}
