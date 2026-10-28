import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { permanentRedirect } from 'next/navigation';
import PortfolioHero from '@/components/redesign/portfolio/PortfolioHero';
import PortfolioGrid from '@/components/redesign/portfolio/PortfolioGrid';
import PortfolioChoices from '@/components/redesign/portfolio/PortfolioChoices';
import DigitalGrid from '@/components/redesign/portfolio/DigitalGrid';
import BackLink from '@/components/redesign/portfolio/BackLink';
import TrustStrip from '@/components/redesign/portfolio/TrustStrip';
import HeroRibbons from '@/components/redesign/HeroRibbons';
import {
  DESIGN_CARDS,
  DIGITAL_CARDS,
  categoryLabel,
  digitalCardsOf,
  parseCategory,
  type DigitalType,
} from '@/lib/portfolio-data';
import '@/components/redesign/portfolio/portfolio.css';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Two-step flow, on the URLs other pages already link to:
//   /portfolio                         entry: Design work | Digital products
//   /portfolio?view=design[&category]  masonry grid with tabs
//   /portfolio?view=digital            Web apps | Mobile apps
//   /portfolio?view=digital&type=web   that type's products
type Screen =
  | { kind: 'entry' }
  | { kind: 'design'; category: ReturnType<typeof parseCategory> }
  | { kind: 'digital' }
  | { kind: 'digital-type'; type: DigitalType };

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function screenOf(params: Record<string, string | string[] | undefined>): Screen {
  const view = one(params.view);
  if (view === 'design') return { kind: 'design', category: parseCategory(params.category) };
  if (view === 'digital') {
    const type = one(params.type);
    return type === 'web' || type === 'mobile' ? { kind: 'digital-type', type } : { kind: 'digital' };
  }
  return { kind: 'entry' };
}

const TYPE_LABEL: Record<DigitalType, string> = { web: 'Web apps', mobile: 'Mobile apps' };

// The entry screen is the indexable one; sub-views are canonical to themselves and
// kept out of the index (their links are still followed).
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const screen = screenOf(await searchParams);
  if (screen.kind === 'entry') {
    return {
      title: 'Portfolio: Websites, Apps, Logos & Design Work',
      description:
        'Explore Nesture-X work for Kenyan businesses: websites, web apps, logos, business cards, company profiles, flyers, and social media design.',
      alternates: { canonical: '/portfolio' },
    };
  }
  const subView = (title: string, description: string, canonical: string): Metadata => ({
    title,
    description,
    alternates: { canonical },
    robots: { index: false, follow: true },
  });
  if (screen.kind === 'design') {
    const cat = screen.category === 'all' ? '' : categoryLabel(screen.category);
    return subView(
      cat ? `${cat}: Design Work | Portfolio` : 'Design Work | Portfolio',
      'Logos, business cards, company profiles, social media, flyers and more, designed by Nesture-X in Nairobi.',
      `/portfolio?view=design${screen.category === 'all' ? '' : `&category=${screen.category}`}`,
    );
  }
  if (screen.kind === 'digital') {
    return subView(
      'Digital Products | Portfolio',
      'Web apps and mobile apps built by Nesture-X: NX Originals and live client sites.',
      '/portfolio?view=digital',
    );
  }
  return subView(
    `${TYPE_LABEL[screen.type]}: Digital Products | Portfolio`,
    screen.type === 'web'
      ? 'Web apps and websites built by Nesture-X: NX Originals and live client sites.'
      : 'Mobile apps built by Nesture-X, from live on Google Play to in development.',
    `/portfolio?view=digital&type=${screen.type}`,
  );
}

// Rendered per request (it reads searchParams), so every screen and a shared
// ?view=design&category= link arrive complete in the server HTML.
export default async function PortfolioPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  // Category links shared before the two-step flow returned (no view) still land.
  const bareCategory = one(params.category);
  if (!params.view && bareCategory) {
    permanentRedirect(`/portfolio?view=design&category=${encodeURIComponent(bareCategory)}`);
  }

  const screen = screenOf(params);
  let hero: { lede: string; count: number };
  let body: ReactNode;

  switch (screen.kind) {
    case 'entry':
      hero = { lede: 'Two ways to see what we build. Pick one.', count: DESIGN_CARDS.length + DIGITAL_CARDS.length };
      body = (
        <PortfolioChoices
          label="Portfolio sections"
          choices={[
            {
              href: '/portfolio?view=design',
              title: 'Design work',
              line: 'Logos, business cards, company profiles, social media and print.',
              count: DESIGN_CARDS.length,
              art: 'port-palette',
            },
            {
              href: '/portfolio?view=digital',
              title: 'Digital products',
              line: 'Web apps and mobile apps: NX Originals and live client sites.',
              count: DIGITAL_CARDS.length,
              art: 'svc-phone',
            },
          ]}
        />
      );
      break;
    case 'design':
      hero = { lede: 'Logos, print, social and web design. Pick a category and have a look.', count: DESIGN_CARDS.length };
      body = (
        <>
          <BackLink href="/portfolio" label="Portfolio" />
          <PortfolioGrid cards={DESIGN_CARDS} initialCategory={screen.category} />
        </>
      );
      break;
    case 'digital':
      hero = { lede: 'Web apps and mobile apps we design, build and ship.', count: DIGITAL_CARDS.length };
      body = (
        <>
          <BackLink href="/portfolio" label="Portfolio" />
          <PortfolioChoices
            label="Digital products"
            choices={[
              {
                href: '/portfolio?view=digital&type=web',
                title: 'Web apps',
                line: 'NX Originals and live client websites.',
                count: digitalCardsOf('web').length,
                art: 'code-window-cutout',
              },
              {
                href: '/portfolio?view=digital&type=mobile',
                title: 'Mobile apps',
                line: 'NX Originals, from live on Google Play to in development.',
                count: digitalCardsOf('mobile').length,
                art: 'svc-phone',
              },
            ]}
          />
        </>
      );
      break;
    case 'digital-type':
      hero = { lede: 'Web apps and mobile apps we design, build and ship.', count: DIGITAL_CARDS.length };
      body = (
        <>
          <BackLink href="/portfolio?view=digital" label="Digital products" />
          <DigitalGrid cards={digitalCardsOf(screen.type)} title={TYPE_LABEL[screen.type]} />
        </>
      );
      break;
  }

  return (
    <main className="nxpf">
      <div className="nxpf-hero-wrap nx-hero-ribbons-host">
        <HeroRibbons className="nx-hero-ribbons" />
        <PortfolioHero lede={hero.lede} count={hero.count} />
      </div>
      <div className="nxpf-wrap">
        {body}
        <TrustStrip />
      </div>
    </main>
  );
}
