import localFont from 'next/font/local';
import { JsonLd } from '@/lib/jsonLd';
import ProductLanding from '@/components/product-landing/ProductLanding';
import { productJsonLd, productMetadata } from '@/components/product-landing/productSeo';
import { TENDER_LEO } from '@/data/product-landings/tender-leo';

// Montserrat and Inter, loaded on this route rather than in the root layout.
// Self-hosted from src/fonts (latin, OFL).
const montserrat = localFont({
  src: [
    { path: '../../fonts/montserrat/montserrat-latin-wght-normal.woff2', weight: '400 900', style: 'normal' },
    { path: '../../fonts/montserrat/montserrat-latin-wght-italic.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-montserrat',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Montserrat Fallback'],
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

export const metadata = productMetadata(TENDER_LEO);

export default function TenderLeoPage() {
  return (
    <>
      <JsonLd data={productJsonLd(TENDER_LEO)} />
      <ProductLanding config={TENDER_LEO} fontClassName={`${montserrat.variable} ${inter.variable}`} />
    </>
  );
}
