// REMOVE before merging feat/redesign to dev.
// Temporary visual check for the hybrid redesign kit: tokens, nx- classes,
// components and 3D assets on dark, slate and light. Not linked, not in the sitemap.
import type { Metadata } from 'next';
import Image from 'next/image';
import { Band, Chip, ClayButton, ClayCard, Eyebrow, GlassPanel, SectionHeading } from '@/components/redesign';
import { ASSETS_3D, type Asset3dKey } from '@/lib/assets3d';

export const metadata: Metadata = {
  title: 'Redesign kit',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

type Surface = { name: string; theme: 'dark' | 'light'; bg: string };

const SURFACES: Surface[] = [
  { name: 'Dark', theme: 'dark', bg: 'var(--nx-bg)' },
  { name: 'Slate', theme: 'dark', bg: 'var(--nx-band)' },
  { name: 'Light', theme: 'light', bg: 'var(--nx-bg)' },
];

// The six core colours, with each theme's value for the label.
const COLOURS = [
  { token: '--nx-bg', dark: '#0a0a0a', light: '#f3f6fb' },
  { token: '--nx-band', dark: '#141b2b', light: '#e3eaf5' },
  { token: '--nx-blue', dark: '#1a6fd4', light: '#1a6fd4' },
  { token: '--nx-accent', dark: '#3d8ef0', light: '#1558ad' },
  { token: '--nx-navy', dark: '#0d1b3e', light: '#0d1b3e' },
  { token: '--nx-ice', dark: '#b8cef0', light: '#34466b' },
];

const ASSET_KEYS = Object.keys(ASSETS_3D) as Asset3dKey[];

function Panel({ surface, children }: { surface: Surface; children: React.ReactNode }) {
  return (
    <div data-theme={surface.theme} className="rounded-[28px] p-5 sm:p-8" style={{ background: surface.bg, color: 'var(--nx-text)' }}>
      <p className="nx-chip mb-6">{surface.name}</p>
      {children}
    </div>
  );
}

function Swatches({ surface }: { surface: Surface }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {COLOURS.map((c) => (
        <li key={c.token} className="flex flex-col gap-2">
          <span
            className="block h-20 rounded-[20px]"
            style={{ background: `var(${c.token})`, boxShadow: 'inset 0 0 0 1px rgba(128,128,128,0.35)' }}
          />
          <code className="text-[12px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--nx-body)' }}>
            {c.token}
            <br />
            {surface.theme === 'light' ? c.light : c.dark}
          </code>
        </li>
      ))}
    </ul>
  );
}

function Specimens() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading eyebrow="Section heading" title="We build things that work" outline="that work" />
      <p className="nx-body max-w-[60ch]">
        .nx-body: Space Grotesk 17px at 1.65 line-height. Websites, web apps and mobile apps with M-Pesa built in,
        plus branding, design and print.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <ClayButton href="/redesign-kit">Primary link</ClayButton>
        <ClayButton variant="ghost" href="/redesign-kit">Ghost link</ClayButton>
        <ClayButton>Button</ClayButton>
        <ClayButton variant="ghost">Ghost button</ClayButton>
        <ClayButton disabled>Disabled</ClayButton>
      </div>

      <div className="flex flex-wrap gap-3">
        <Chip>.nx-chip</Chip>
        <Chip variant="blue">.nx-chip-blue</Chip>
        <Chip>Next.js</Chip>
        <Chip variant="blue">M-Pesa</Chip>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ClayCard>
          <Eyebrow>ClayCard</Eyebrow>
          <p className="nx-body mt-4">.nx-clay, radius 34px, 160° gradient with inset light and drop shadow.</p>
        </ClayCard>
        <GlassPanel>
          <Eyebrow>GlassPanel</Eyebrow>
          <p className="nx-body mt-4">.nx-glass, blur 18px with a hairline border.</p>
        </GlassPanel>
        <div className="nx-inset p-6 sm:p-8">
          <Eyebrow>.nx-inset</Eyebrow>
          <p className="nx-body mt-4">A pressed-in well for inputs, stats and chips.</p>
        </div>
      </div>

      <div className="nx-grid-bg h-40 rounded-[28px] p-6" style={{ boxShadow: 'inset 0 0 0 1px var(--nx-glass-border)' }}>
        <span className="nx-eyebrow">.nx-grid-bg</span>
      </div>
    </div>
  );
}

function AssetGrid() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {ASSET_KEYS.map((key) => {
        const a = ASSETS_3D[key];
        return (
          <li key={key} className="flex flex-col items-center gap-2">
            <Image
              src={a.src}
              width={a.width}
              height={a.height}
              alt={a.alt}
              sizes="(min-width: 1024px) 160px, (min-width: 640px) 22vw, 45vw"
              className="h-32 w-auto object-contain"
            />
            <code className="text-center text-[11px]" style={{ fontFamily: 'var(--font-mono)', color: 'var(--nx-body)' }}>
              {key}
              <br />
              {a.width}×{a.height}
              {a.alt ? '' : ' · decorative'}
            </code>
          </li>
        );
      })}
    </ul>
  );
}

export default async function RedesignKitPage({ searchParams }: { searchParams: Promise<{ phone?: string }> }) {
  // ?phone=1 is the copy shown inside the phone-width frame; it skips the frame itself.
  const { phone } = await searchParams;

  return (
    <main className="nx-grid-bg pb-24">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8">
        <header className="py-14">
          <SectionHeading as="h1" eyebrow="feat/redesign · temporary" title="Hybrid redesign kit" outline="kit" />
        </header>

        <Band variant="slate" id="colours">
          <SectionHeading eyebrow="Tokens" title="Six core colours" outline="colours" className="mb-10" />
          <div className="flex flex-col gap-6">
            {SURFACES.map((s) => (
              <Panel key={s.name} surface={s}>
                <Swatches surface={s} />
              </Panel>
            ))}
          </div>
        </Band>

        <Band variant="dark" id="classes">
          <SectionHeading eyebrow="Classes and components" title="Every piece on every surface" outline="surface" className="mb-10" />
          <div className="flex flex-col gap-6">
            {SURFACES.map((s) => (
              <Panel key={s.name} surface={s}>
                <Specimens />
              </Panel>
            ))}
          </div>
        </Band>

        <Band variant="slate" id="assets">
          <SectionHeading eyebrow="3D assets" title={`${ASSET_KEYS.length} WebP renders`} outline="renders" className="mb-10" />
          <div className="flex flex-col gap-6">
            {SURFACES.map((s) => (
              <Panel key={s.name} surface={s}>
                <AssetGrid />
              </Panel>
            ))}
          </div>
        </Band>

        {!phone && (
          <Band variant="dark" id="phone">
            <SectionHeading eyebrow="Phone width" title="375px check" outline="check" className="mb-10" />
            <iframe
              src="/redesign-kit?phone=1"
              title="Redesign kit at 375px wide"
              width={375}
              height={760}
              loading="lazy"
              className="mx-auto block max-w-full rounded-[28px] border-0"
              style={{ boxShadow: 'var(--nx-shadow-clay)' }}
            />
          </Band>
        )}
      </div>
    </main>
  );
}
