import { Band, ClayButton, GlassPanel, SectionHeading } from '@/components/redesign';

export default function ServicesPartnership() {
  return (
    <Band aria-labelledby="nxsv-partner-title">
      <GlassPanel className="nxsv-partner nxsv-reveal" style={{ padding: 'clamp(28px, 5vw, 64px)' }}>
        <SectionHeading
          id="nxsv-partner-title"
          eyebrow="Partnership mindset"
          title="WE GROW WHEN YOU GROW."
          outline="WHEN YOU GROW."
        />
        <p className="nx-body nxsv-partner-text">
          Some of our clients are also our equity partners. If your idea is early and the fit is right, ask us about
          building alongside you.
        </p>
        <ClayButton href="/contact">Talk partnership</ClayButton>
      </GlassPanel>
    </Band>
  );
}
