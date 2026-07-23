// Shared by DigitalProductsGrid.tsx and the /portfolio/status/[slug] route so
// client-site projects without a slug in nxOriginals.ts get a consistent,
// derived one instead of two ad-hoc implementations drifting apart.
export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
