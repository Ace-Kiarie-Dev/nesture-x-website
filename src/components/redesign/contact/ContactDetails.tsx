import type { ReactNode } from 'react';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { CONTACT, activeSocialLinks } from '@/constants';
import { SocialIcon } from '@/components/layout/SocialIcons';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { GlassPanel } from '@/components/redesign';

type Detail = { label: string; value: string; icon: ReactNode; href?: string; external?: boolean };

// One card per contact fact in constants. Location has no link in the repo (no map
// URL), so it is a plain card without an arrow.
const DETAILS: Detail[] = [
  { label: 'Email', value: CONTACT.email, icon: <Mail size={20} aria-hidden="true" />, href: `mailto:${CONTACT.email}` },
  { label: 'Phone', value: CONTACT.phoneDisplay, icon: <Phone size={20} aria-hidden="true" />, href: `tel:${CONTACT.phone}` },
  { label: 'WhatsApp', value: 'Chat with us', icon: <WhatsAppIcon size={20} />, href: CONTACT.whatsapp, external: true },
  { label: 'Location', value: CONTACT.location, icon: <MapPin size={20} aria-hidden="true" /> },
];

const SOCIALS = activeSocialLinks();

export default function ContactDetails() {
  return (
    <aside className="nxct-details" aria-labelledby="nxct-details-title">
      <h2 id="nxct-details-title" className="nxct-details-title">
        Reach us directly
      </h2>
      <GlassPanel as="div" className="nxct-cards" style={{ padding: 10 }}>
        <ul className="nxct-card-list">
          {DETAILS.map((d) => {
            const body = (
              <>
                <span className="nxct-card-icon">{d.icon}</span>
                <span className="nxct-card-text">
                  <span className="nxct-card-label">{d.label}</span>
                  <span className="nxct-card-value">{d.value}</span>
                </span>
                {d.href && <ArrowUpRight size={18} className="nxct-card-arrow" aria-hidden="true" />}
              </>
            );
            return (
              <li key={d.label}>
                {d.href ? (
                  <a
                    href={d.href}
                    className="nxct-card"
                    {...(d.external
                      ? { target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${d.label}: ${d.value} (opens in a new tab)` }
                      : {})}
                  >
                    {body}
                  </a>
                ) : (
                  <div className="nxct-card">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </GlassPanel>

      {SOCIALS.length > 0 && (
        <ul className="nxct-socials" aria-label="Nesture-X on social media">
          {SOCIALS.map((s) => (
            <li key={s.network}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="nxct-social nx-clay"
                aria-label={`Nesture-X on ${s.label} (opens in a new tab)`}
              >
                <SocialIcon network={s.network} size={20} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
