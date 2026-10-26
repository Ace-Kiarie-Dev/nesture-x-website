import Link from 'next/link';
import { activeSocialLinks } from '@/constants';
import { SocialIcon } from '@/components/layout/SocialIcons';

const SOCIAL_LINKS = activeSocialLinks();

const LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
  { label: 'Free tools', href: '/tools' },
  { label: 'Privacy policy', href: '/privacy-policy' },
  { label: 'SHINKUSEN', href: 'https://shinkusen.co.ke', external: true },
];

// Redesigned site footer: an inset panel. Opt-in per route (see ClientShell).
export default function SiteFooter() {
  return (
    <footer className="nx-footer-wrap">
      <div className="nx-footer nx-inset">
        <Link href="/" className="nx-logo" aria-label="Nesture-X home">
          NESTURE<span>-X</span>
        </Link>

        <nav aria-label="Footer">
          <ul className="nx-footer-links">
            {LINKS.map((link) => (
              <li key={link.label}>
                {link.external ? (
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="nx-footer-link">
                    {link.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link href={link.href} className="nx-footer-link">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="nx-footer-end">
          {SOCIAL_LINKS.length > 0 && (
            <ul className="nx-footer-social">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.network}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`Nesture-X on ${link.label}`}
                    title={link.label}
                    className="nx-footer-social-link"
                  >
                    <SocialIcon network={link.network} />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="nx-footer-copy">© 2025 NESTURE-X. NAIROBI, KENYA.</p>
        </div>
      </div>
    </footer>
  );
}
