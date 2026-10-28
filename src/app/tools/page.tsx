import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlignLeft, QrCode, type LucideIcon } from 'lucide-react';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';
import { Eyebrow, SectionHeading } from '@/components/redesign';
import HeroRibbons from '@/components/redesign/HeroRibbons';
import CtaPanel from '@/components/redesign/CtaPanel';

// Metadata lives in app/tools/layout.tsx (kept as it was). Server component: the hub
// ships no tool code; each tool loads its own heavy libraries lazily on its own page.

type Tool = {
  name: string;
  href: string;
  description: string;
  /** Mono chip: what the tool works with. */
  type: string;
  art?: Asset3dKey;
  icon?: LucideIcon;
};

// Same tools, names, links and descriptions as the previous hub.
const TOOLS: Tool[] = [
  { name: 'Image Studio', href: '/tools/image-studio', type: 'Image', art: 'port-easel', description: 'Convert, compress, resize, transform and adjust images. Full power, one tool.' },
  { name: 'PDF Studio', href: '/tools/pdf-studio', type: 'PDF', art: 'svc-print', description: 'Compress, merge, split, rotate and protect PDF files.' },
  { name: 'QR Code Generator', href: '/tools/qr-generator', type: 'QR', icon: QrCode, description: 'Generate QR codes with custom colours, logo overlay, and SVG/PNG export.' },
  { name: 'Invoice Generator', href: '/tools/invoice-generator', type: 'Invoice', art: 'tool-receipt', description: 'Create professional PDF invoices with logo, tax, discount and M-Pesa payment details.' },
  { name: 'Color Palette Generator', href: '/tools/color-palette', type: 'Colour', art: 'port-palette', description: 'Generate palettes and export as CSS variables, Tailwind config, JSON or PNG.' },
  { name: 'Logo Text Previewer', href: '/tools/logo-text-preview', type: 'Fonts', art: 'pen-cutout', description: 'Preview your brand name across fonts and layouts before commissioning a logo.' },
  { name: 'M-Pesa Validator', href: '/tools/mpesa-validator', type: 'M-Pesa', art: 'contact-mpesa', description: 'Validate M-Pesa Till numbers, Paybill numbers and phone numbers instantly.' },
  { name: 'UTM Link Builder', href: '/tools/utm-builder', type: 'UTM', art: 'svc-seo', description: 'Build UTM tracking links with presets, live preview and bulk CSV export.' },
  { name: 'Word & Character Counter', href: '/tools/word-counter', type: 'Text', icon: AlignLeft, description: 'Count words, characters, sentences, reading time and keyword density.' },
  { name: 'Password Generator', href: '/tools/password-generator', type: 'Password', art: 'svc-lock', description: 'Generate cryptographically secure passwords or passphrases in bulk.' },
  { name: 'Base64 Encoder/Decoder', href: '/tools/base64-encoder', type: 'Base64', art: 'code-window-cutout', description: 'Encode and decode text or files to Base64, with data URI and URL-safe mode.' },
];

const BOX = ASSETS_3D['tool-box'];

export default function ToolsPage() {
  return (
    <main className="nxtl">
      <div className="nxtl-hero-wrap nx-hero-ribbons-host">
        <HeroRibbons className="nx-hero-ribbons" />
        <section className="nxtl-hero" aria-labelledby="nxtl-hero-title">
          <div className="nxtl-hero-copy">
            <Eyebrow>Free tools</Eyebrow>
            <h1 id="nxtl-hero-title" className="nxtl-hero-title" aria-label="Free tools.">
              <span className="nxtl-hero-line" aria-hidden="true">
                FREE
              </span>
              <span className="nxtl-hero-line nx-outline" aria-hidden="true">
                TOOLS.
              </span>
            </h1>
            <p className="nxtl-hero-lede">Useful tools, no account needed. Built by Nesture-X.</p>
          </div>
          <div className="nxtl-hero-art" aria-hidden="true">
            <span className="nxtl-hero-glow" />
            <Image
              src={BOX.src}
              alt=""
              width={BOX.width}
              height={BOX.height}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1100px) 440px, (min-width: 768px) 300px, 220px"
              className="nxtl-hero-img"
            />
          </div>
        </section>
      </div>

      <div className="nxtl-wrap">
        <section className="nxtl-sec" aria-labelledby="nxtl-grid-title">
          <SectionHeading id="nxtl-grid-title" eyebrow={`${TOOLS.length} tools`} title="PICK A TOOL." outline="TOOL." className="nxtl-grid-head" />
          <ul className="nxtl-grid">
            {TOOLS.map((tool, i) => {
              const art = tool.art ? ASSETS_3D[tool.art] : null;
              const Icon = tool.icon;
              return (
                <li key={tool.href} style={{ '--i': i } as CSSProperties}>
                  <Link href={tool.href} className="nxtl-card nx-clay">
                    <span className="nxtl-card-art" aria-hidden="true">
                      <span className="nxtl-card-glow" />
                      {art ? (
                        <Image src={art.src} alt="" width={art.width} height={art.height} sizes="140px" className="nxtl-card-img" />
                      ) : Icon ? (
                        <span className="nxtl-card-icon">
                          <Icon size={48} strokeWidth={1.6} />
                        </span>
                      ) : null}
                    </span>
                    <span className="nxtl-card-chip">{tool.type}</span>
                    <span className="nxtl-card-name">{tool.name}</span>
                    <span className="nxtl-card-desc">{tool.description}</span>
                    <span className="nxtl-card-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="nxtl-sec nxtl-sec--cta" aria-labelledby="nxtl-cta-title">
          <CtaPanel
            titleId="nxtl-cta-title"
            title="NEED SOMETHING CUSTOM BUILT?"
            text="We build bespoke web tools, internal dashboards, and workflow automations for businesses across Kenya and beyond. Let's talk about what you need."
            primary={{ href: '/contact', label: 'Get in touch' }}
            secondary={{ href: '/booking', label: 'Book a consultation' }}
            art="tool-gear"
            artAlt=""
          />
        </section>
      </div>
    </main>
  );
}
