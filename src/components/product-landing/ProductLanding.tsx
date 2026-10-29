import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';
import WaitlistForm, { type WaitlistFormClasses } from './WaitlistForm';
import Faq, { type FaqClasses } from './Faq';
import type { ProductImage, ProductLandingConfig } from './types';
import './product-landing.css';

// Shared product landing page. Everything product-specific comes from the config: copy,
// images, and the brand (colours, fonts, corners) as CSS variables on the wrapper, so
// product-landing.css never names a product colour. The page's own app/<slug>/page.tsx
// loads the fonts and passes their variable classes in.

const PRIVACY_HREF = '/privacy-policy';

const FORM_CLASSES: WaitlistFormClasses = {
  form:      'pl-form',
  row:       'pl-form-row',
  inputWrap: 'pl-input-wrap',
  input:     'pl-input',
  button:    'pl-btn',
  spinner:   'pl-spinner',
  error:     'pl-form-error',
  note:      'pl-form-note',
  success:   'pl-form-success',
};

const FAQ_CLASSES: FaqClasses = {
  list:        'pl-faq-list',
  item:        'pl-faq-item',
  question:    'pl-faq-q',
  chevron:     'pl-faq-chevron',
  answer:      'pl-faq-a',
  answerInner: 'pl-faq-a-inner',
};

function Signup({ config, note }: { config: ProductLandingConfig; note?: string }) {
  return (
    <>
      <WaitlistForm
        projectSlug={config.slug}
        projectName={config.name}
        buttonLabel="NOTIFY ME AT LAUNCH"
        placeholder="Enter your email"
        successMessage="You're on the list. Check your inbox for a confirmation."
        duplicateMessage={`You're already on the list. We'll let you know when ${config.name} launches.`}
        note={note}
        classes={FORM_CLASSES}
      />
      <Link href={PRIVACY_HREF} className="pl-text-link">Privacy policy</Link>
    </>
  );
}

// A phone frame drawn in CSS around a screenshot. Capped at the screenshot's own width
// so it is never upscaled at 1x.
function Phone({ image, className = '', sizes, preload = false }: {
  image: ProductImage;
  className?: string;
  sizes: string;
  preload?: boolean;
}) {
  return (
    <div className={`pl-phone ${className}`} style={{ maxWidth: image.width + 16 }}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        preload={preload}
        className="pl-phone-screen"
      />
    </div>
  );
}

// Same cap for a laptop: the screenshot's width plus the screen's 10px padding each side.
function Laptop({ image, sizes, preload = false }: { image: ProductImage; sizes: string; preload?: boolean }) {
  return (
    <div className="pl-laptop" style={{ maxWidth: image.width + 20 }}>
      <div className="pl-laptop-screen">
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} preload={preload} />
      </div>
      <span className="pl-laptop-base" aria-hidden="true" />
    </div>
  );
}

// Key art in place of screens, capped at its own width.
function HeroImage({ image }: { image: ProductImage }) {
  return (
    <div className="pl-hero-image" style={{ maxWidth: image.width }}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 960px) 560px, 92vw"
        preload
      />
    </div>
  );
}

export default function ProductLanding({ config, fontClassName = '' }: {
  config: ProductLandingConfig;
  /** next/font variable classes for the fonts the theme names. */
  fontClassName?: string;
}) {
  const { theme, hero, promise, features, steps, screens, values, faq, final } = config;
  const c = theme.colors;
  const vars = {
    '--pl-bg': c.bg,
    '--pl-surface': c.surface,
    '--pl-tint': c.tint,
    '--pl-text': c.text,
    '--pl-muted': c.muted,
    '--pl-primary': c.primary,
    '--pl-on-primary': c.onPrimary,
    '--pl-action': c.action ?? c.primary,
    '--pl-accent': c.accent,
    '--pl-highlight': c.highlight,
    '--pl-border': c.border,
    '--pl-danger': c.danger,
    '--pl-font-heading': theme.fontHeading,
    '--pl-font-body': theme.fontBody,
    '--pl-radius': theme.radius,
    '--pl-radius-lg': theme.radiusLg,
  } as React.CSSProperties;
  const mobile = config.platform === 'mobile';
  const [front, back] = hero.screens ?? [];

  return (
    <div className={`theme-pl pl-under-nav ${config.themeClass ?? ''} ${fontClassName} flex-1`} style={vars}>
      <main>
        {/* ── 1. Hero ───────────────────────────────────────────────────── */}
        <section className="pl-section pl-hero" aria-labelledby="pl-hero-title">
          <div className="pl-container pl-hero-grid">
            <div className="pl-hero-copy">
              <div className="pl-lockup">
                <Image
                  src={config.brand.logo.src}
                  alt=""
                  width={config.brand.logo.width}
                  height={config.brand.logo.height}
                  sizes="64px"
                  className="pl-lockup-mark"
                  preload
                />
                <span className="pl-lockup-name">{config.name}</span>
              </div>
              <span className="pl-pill"><span className="pl-pill-dot" aria-hidden="true" />{hero.status}</span>
              <p className="pl-eyebrow">{hero.eyebrow}</p>
              <h1 id="pl-hero-title" className="pl-h1">{hero.headline}</h1>
              <p className="pl-subline">{hero.subline}</p>
              <p className="pl-lead">{hero.intro}</p>
              <div className="pl-signup">
                <Signup config={config} note={hero.formNote} />
              </div>
            </div>

            <div className="pl-hero-visual">
              {hero.image ? (
                <HeroImage image={hero.image} />
              ) : mobile ? (
                <div className="pl-phone-stack">
                  {back && <Phone image={back} className="pl-phone--back" sizes="220px" />}
                  {front && <Phone image={front} className="pl-phone--front" sizes="260px" preload />}
                </div>
              ) : (
                front && <Laptop image={front} sizes="(min-width: 960px) 560px, 92vw" preload />
              )}
            </div>
          </div>
        </section>

        {/* ── 2. Promise or problem ─────────────────────────────────────── */}
        {promise.kind === 'quote' ? (
          <section className="pl-band">
            <figure className="pl-container pl-quote">
              <blockquote>
                <p>&ldquo;{promise.text}&rdquo;</p>
              </blockquote>
              <span className="pl-rule" aria-hidden="true" />
              <figcaption>{promise.cite}</figcaption>
            </figure>
          </section>
        ) : (
          <section className="pl-band" aria-labelledby="pl-promise-title">
            <div className="pl-container pl-statement">
              <p className="pl-eyebrow">{promise.eyebrow}</p>
              <h2 id="pl-promise-title" className="pl-h2">{promise.title}</h2>
              <p>{promise.body}</p>
            </div>
          </section>
        )}

        {/* ── 3. Features ───────────────────────────────────────────────── */}
        <section className="pl-section" aria-labelledby="pl-features-title">
          <div className="pl-container">
            <div className="pl-section-head">
              <p className="pl-eyebrow">{features.eyebrow}</p>
              <h2 id="pl-features-title" className="pl-h2">{features.title}</h2>
            </div>
            <ul className="pl-features" role="list">
              {features.items.map(({ Icon, title, body }) => (
                <li key={title} className="pl-card pl-feature">
                  <span className="pl-icon-tile" aria-hidden="true"><Icon size={24} /></span>
                  <h3 className="pl-h3">{title}</h3>
                  <p>{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 4. How it works ───────────────────────────────────────────── */}
        <section className="pl-section pl-section--tint" aria-labelledby="pl-steps-title">
          <div className="pl-container">
            <div className="pl-section-head">
              <p className="pl-eyebrow">{steps.eyebrow}</p>
              <h2 id="pl-steps-title" className="pl-h2">{steps.title}</h2>
            </div>
            <ol className="pl-steps">
              {steps.items.map((step, i) => (
                <li key={step.title} className="pl-step">
                  <span className="pl-step-num" aria-hidden="true">{i + 1}</span>
                  <h3 className="pl-h3">{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── 5. Screens ────────────────────────────────────────────────── */}
        {screens && (
        <section className="pl-section" aria-labelledby="pl-screens-title">
          <div className="pl-container">
            <div className="pl-section-head pl-center">
              <p className="pl-eyebrow">{screens.eyebrow}</p>
              <h2 id="pl-screens-title" className="pl-h2">{screens.title}</h2>
            </div>
            <ul className={mobile ? 'pl-screens' : 'pl-screens pl-screens--web'} role="list">
              {screens.items.map(({ image, caption }) => (
                <li key={image.src}>
                  <figure className="pl-screen">
                    {mobile ? (
                      <Phone image={image} sizes="260px" />
                    ) : (
                      <Laptop image={image} sizes="(min-width: 960px) 560px, 92vw" />
                    )}
                    <figcaption>{caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
        )}

        {/* ── 6. Values ─────────────────────────────────────────────────── */}
        <section className="pl-section pl-section--tint" aria-labelledby="pl-values-title">
          <div className="pl-container pl-values">
            <div>
              <p className="pl-eyebrow">{values.eyebrow}</p>
              <h2 id="pl-values-title" className="pl-h2">{values.title}</h2>
            </div>
            <div>
              <ul className="pl-checklist" role="list">
                {values.items.map((item) => (
                  <li key={item}>
                    <span className="pl-check" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>
                    {item}
                  </li>
                ))}
              </ul>
              {values.closing && <p className="pl-closing">{values.closing}</p>}
            </div>
          </div>
        </section>

        {/* ── 7. FAQ ────────────────────────────────────────────────────── */}
        <section className="pl-section" aria-labelledby="pl-faq-title">
          <div className="pl-container pl-container--sm">
            <div className="pl-section-head pl-center">
              <p className="pl-eyebrow">{faq.eyebrow}</p>
              <h2 id="pl-faq-title" className="pl-h2">{faq.title}</h2>
            </div>
            <Faq items={faq.items} classes={FAQ_CLASSES} />
          </div>
        </section>

        {/* ── 8. Launch list ────────────────────────────────────────────── */}
        <section id="waitlist" className="pl-section pl-final" aria-labelledby="pl-final-title">
          <div className="pl-container pl-container--md">
            <div className="pl-final-card">
              {config.brand.icon && (
                <Image
                  src={config.brand.icon.src}
                  alt=""
                  width={config.brand.icon.width}
                  height={config.brand.icon.height}
                  sizes="88px"
                  className="pl-final-icon"
                />
              )}
              <h2 id="pl-final-title" className="pl-h2">{final.title}</h2>
              <p className="pl-lead">{final.body}</p>
              <div className="pl-signup pl-signup--center">
                <Signup config={config} />
              </div>
            </div>
            <p className="pl-built">
              {config.builtBy}{' '}
              <Link href="/portfolio" className="pl-built-link">See more Nesture-X work</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
