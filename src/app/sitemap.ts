import { MetadataRoute } from 'next';
import portfolioData from '@/data/portfolio.json';
import type { PortfolioItem } from '@/components/sections/Portfolio';
import { isIndexablePortfolioItem } from '@/lib/portfolioSeo';

// Bump when the static pages' content changes. A fixed date (not the build
// time) keeps lastModified meaningful to search engines.
const SITE_UPDATED = '2026-09-30';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nesturex.com';

  const toolRoutes = [
    'image-studio',
    'pdf-studio',
    'qr-generator',
    'invoice-generator',
    'color-palette',
    'logo-text-preview',
    'mpesa-validator',
    'utm-builder',
    'word-counter',
    'password-generator',
    'base64-encoder',
  ];

  const toolEntries = toolRoutes.map((route) => ({
    url: `${base}/tools/${route}`,
    lastModified: SITE_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Portfolio items carry no dates, so lastModified is omitted. "Various
  // Clients" items are noindexed and stay out of the sitemap.
  const portfolioEntries = (portfolioData as PortfolioItem[])
    .filter(isIndexablePortfolioItem)
    .map((item) => ({
      url: `${base}/portfolio/${item.id}`,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }));

  return [
    { url: base, lastModified: SITE_UPDATED, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${base}/about`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/services`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/portfolio`, lastModified: SITE_UPDATED, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/contact`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/booking`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/tools`, lastModified: SITE_UPDATED, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${base}/betledger`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/sorapesa`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/kikota`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/matatu-dash`, lastModified: SITE_UPDATED, changeFrequency: 'monthly' as const, priority: 0.7 },
    ...toolEntries,
    ...portfolioEntries,
    { url: `${base}/privacy-policy`, lastModified: SITE_UPDATED, changeFrequency: 'yearly' as const, priority: 0.3 },
  ];
}
