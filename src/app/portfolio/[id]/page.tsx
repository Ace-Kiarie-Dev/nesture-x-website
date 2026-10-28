import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd, breadcrumbList } from '@/lib/jsonLd';
import { isIndexablePortfolioItem, portfolioDescription, portfolioTitle } from '@/lib/portfolioSeo';
import { DESIGN_CARDS, DESIGN_ITEMS, categoryOf, thumbFor } from '@/lib/portfolio-data';
import ProjectView from '@/components/redesign/portfolio/ProjectView';
import '@/components/redesign/portfolio/portfolio.css';

export async function generateStaticParams() {
  return DESIGN_ITEMS.map(i => ({ id: i.id }));
}

// Share image: the project's own artwork (a PDF's cover), resized by the image
// optimiser so crawlers never fetch a multi-MB original. GIFs go as they are.
function ogImage(item: (typeof DESIGN_ITEMS)[number]) {
  const img = thumbFor(item);
  if (!img) return undefined;
  const url = img.unoptimized ? img.src : `/_next/image?url=${encodeURIComponent(img.src)}&w=1200&q=75`;
  const width = Math.min(1200, img.width);
  return { url, width, height: Math.round((width * img.height) / img.width), alt: portfolioTitle(item) };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = DESIGN_ITEMS.find(i => i.id === id);
  if (!item) return {};
  const title = portfolioTitle(item);
  const description = portfolioDescription(item);
  const image = ogImage(item);
  return {
    title,
    description,
    alternates: {
      canonical: `/portfolio/${id}`,
    },
    // Without an image, the /portfolio OG card (opengraph-image.tsx) still applies.
    ...(image
      ? {
          openGraph: {
            siteName: 'Nesture-X',
            locale: 'en_KE',
            type: 'website',
            title: `${title} | Nesture-X`,
            description,
            url: `/portfolio/${id}`,
            images: [image],
          },
          twitter: { card: 'summary_large_image', images: [image.url] },
        }
      : {}),
    // "Various Clients" pages stay on the site and in the grid, but out of the index.
    ...(isIndexablePortfolioItem(item) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = DESIGN_ITEMS.findIndex(i => i.id === id);
  if (index === -1) notFound();
  const item = DESIGN_ITEMS[index];

  const category = categoryOf(item);
  // Same category, same order as the grid: the pager's neighbours and its counter.
  const siblings = DESIGN_CARDS.filter(c => c.category === category);
  const at = siblings.findIndex(c => c.key === item.id);
  const neighbour = (i: number) => (siblings[i] ? { id: siblings[i].key, title: siblings[i].title } : null);
  const more = siblings.filter(c => c.key !== item.id).slice(0, 12);

  return (
    <main className="nxpf nxpf-project">
      <JsonLd
        data={breadcrumbList([
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
          { name: portfolioTitle(item), path: `/portfolio/${id}` },
        ])}
      />
      <div className="nxpf-wrap">
        <ProjectView
          item={item}
          more={more}
          prev={neighbour(at - 1)}
          next={neighbour(at + 1)}
          position={at + 1}
          total={siblings.length}
        />
      </div>
    </main>
  );
}
