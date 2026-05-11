import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nesturex.com';
  const now = new Date();

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
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/portfolio`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/booking`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...toolEntries,
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.3 },
  ];
}
