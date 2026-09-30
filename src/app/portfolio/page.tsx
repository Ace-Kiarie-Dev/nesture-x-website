import type { Metadata } from 'next';
import { connection } from 'next/server';
import PortfolioEntry from '@/components/sections/PortfolioEntry';

export const metadata: Metadata = {
  title: 'Portfolio: Websites, Apps, Logos & Design Work',
  description:
    'Explore Nesture-X work for Kenyan businesses: websites, web apps, logos, business cards, company profiles, flyers, and social media design.',
  alternates: {
    canonical: '/portfolio',
  },
};

export default async function PortfolioPage() {
  // Render per request so the server HTML shows whichever view the URL asks
  // for (?view=design sends the full grid, with links to every project),
  // instead of an empty shell that only fills in on the client.
  await connection();

  return (
    <main>
      {/* The split screen has no visible heading; this keeps the page's h1 and
          summary in the HTML without changing the design. */}
      <h1 className="sr-only">Our Portfolio</h1>
      <p className="sr-only">
        Design work and digital products by Nesture-X, a creative technology agency in Nairobi:
        websites, web and mobile apps, logos, company profiles, business cards, flyers, and social
        media design for Kenyan businesses.
      </p>
      <PortfolioEntry />
    </main>
  );
}
