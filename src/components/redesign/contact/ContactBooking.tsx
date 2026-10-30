import { ClayButton, GlassPanel } from '@/components/redesign';

// Slim nudge to the booking flow (untouched). No big CTA panel on this page: the hero
// and the form already make the ask.
export default function ContactBooking() {
  return (
    <section className="nxct-booking-sec" aria-labelledby="nxct-booking-title">
      <GlassPanel className="nxct-booking" style={{ padding: 'clamp(24px, 3vw, 36px) clamp(24px, 4vw, 48px)' }}>
        <div className="nxct-booking-copy">
          <h2 id="nxct-booking-title" className="nxct-booking-title">
            Prefer to talk it through?
          </h2>
          <p className="nx-body">Book a consultation and we&apos;ll go through your idea together.</p>
        </div>
        <ClayButton href="/booking" className="nxct-booking-btn">
          Book a consultation
        </ClayButton>
      </GlassPanel>
    </section>
  );
}
