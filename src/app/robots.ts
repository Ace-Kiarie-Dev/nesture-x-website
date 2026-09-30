import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /legal/*/privacy stays crawlable on purpose: those pages carry a
      // noindex tag, and crawlers can only see it if they can fetch the page.
      disallow: ['/admin', '/admin/', '/api/'],
    },
    sitemap: 'https://nesturex.com/sitemap.xml',
  };
}
