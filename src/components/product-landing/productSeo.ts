import type { Metadata } from 'next';
import { SITE_URL, breadcrumbList } from '@/lib/jsonLd';
import type { ProductLandingConfig } from './types';

// Metadata and structured data for a ProductLanding page, in the same shape as the
// hand-built product pages (app/sorapesa/page.tsx and friends).

export function productMetadata(config: ProductLandingConfig): Metadata {
  const { seo, slug } = config;
  const shareTitle = `${seo.title} | Nesture-X`;
  const pageUrl = `${SITE_URL}/${slug}`;
  const ogImage = `${SITE_URL}${seo.ogImage.src}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: shareTitle,
      description: seo.description,
      url: pageUrl,
      siteName: 'Nesture-X',
      locale: 'en_KE',
      type: 'website',
      images: [{ url: ogImage, width: seo.ogImage.width, height: seo.ogImage.height, alt: seo.ogImage.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: seo.description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${slug}`,
    },
  };
}

// The app itself (no offers or ratings until it launches) and its breadcrumb.
export function productJsonLd(config: ProductLandingConfig): Record<string, unknown>[] {
  const { seo, slug, name } = config;
  const pageUrl = `${SITE_URL}/${slug}`;
  const app = {
    '@context': 'https://schema.org',
    '@type': config.platform === 'mobile' ? 'MobileApplication' : 'WebApplication',
    name,
    description: seo.description,
    url: pageUrl,
    image: `${SITE_URL}${seo.ogImage.src}`,
    ...(seo.operatingSystem ? { operatingSystem: seo.operatingSystem } : {}),
    applicationCategory: seo.applicationCategory,
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  const breadcrumb = breadcrumbList([
    { name: 'Home', path: '/' },
    { name, path: `/${slug}` },
  ]);
  return [app, breadcrumb];
}
