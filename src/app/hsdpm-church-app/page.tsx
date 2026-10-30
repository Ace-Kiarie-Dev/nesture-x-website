import localFont from 'next/font/local';
import { JsonLd } from '@/lib/jsonLd';
import ProductLanding from '@/components/product-landing/ProductLanding';
import { productJsonLd, productMetadata } from '@/components/product-landing/productSeo';
import { HSDPM } from '@/data/product-landings/hsdpm';

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

export const metadata = productMetadata(HSDPM);

export default function HsdpmPage() {
  return (
    <>
      <JsonLd data={productJsonLd(HSDPM)} />
      <ProductLanding config={HSDPM} fontClassName={`${playfair.variable} ${inter.variable}`} />
    </>
  );
}
