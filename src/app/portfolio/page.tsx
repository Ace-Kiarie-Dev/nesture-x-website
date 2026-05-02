import PortfolioEntry from '@/components/sections/PortfolioEntry';

export const metadata = {
  title: 'Portfolio | Nesture-X',
  description: 'Browse design and development projects by Nesture-X — logos, branding, social media, web, print, and more.',
};

export default function PortfolioPage() {
  return (
    <main>
      <PortfolioEntry />
    </main>
  );
}
