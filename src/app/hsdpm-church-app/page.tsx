import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/lib/jsonLd';
import ProductLanding from '@/components/product-landing/ProductLanding';
import { productJsonLd, productMetadata } from '@/components/product-landing/productSeo';
import { HSDPM } from '@/data/product-landings/hsdpm';
import { HSDPM_LIVE } from '@/lib/productPages';

// Playfair Display and Inter, loaded on this route rather than in the root layout.
// Self-hosted from src/fonts (latin, OFL).
const playfair = localFont({
  src: [
    { path: '../../fonts/playfair-display/playfair-display-latin-wght-normal.woff2', weight: '400 900', style: 'normal' },
    { path: '../../fonts/playfair-display/playfair-display-latin-wght-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-playfair',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Playfair Display Fallback'],
});

const inter = localFont({
  src: [
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '600', style: 'normal' },
    { path: '../../fonts/inter/inter-latin-wght-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Inter Fallback'],
});

// Hidden while HSDPM_LIVE is false: the route 404s and gets no product metadata.
export const metadata = HSDPM_LIVE ? productMetadata(HSDPM) : {};

export default function HsdpmPage() {
  if (!HSDPM_LIVE) notFound();
  return (
    <>
      <JsonLd data={productJsonLd(HSDPM)} />
      <ProductLanding config={HSDPM} fontClassName={`${playfair.variable} ${inter.variable}`} />
    </>
  );
}
