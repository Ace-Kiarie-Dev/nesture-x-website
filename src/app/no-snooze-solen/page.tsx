import localFont from 'next/font/local';
import ReactDOM from 'react-dom';
import { JsonLd } from '@/lib/jsonLd';
import ProductLanding from '@/components/product-landing/ProductLanding';
import { productJsonLd, productMetadata } from '@/components/product-landing/productSeo';
import { NO_SNOOZE_SOLEN } from '@/data/product-landings/no-snooze-solen';
import './solen.css';

// Headings: Clash Display (Indian Type Foundry, Fontshare Free Font EULA). The EULA
// allows web use but not redistributing the font files, so they are not in this repo:
// the page loads Fontshare's hosted CSS (weights 500 and 600, font-display: swap).
// 'Clash Display Fallback' in src/fonts/fallbacks.css is metric-matched so nothing
// moves when it swaps in.
const CLASH_DISPLAY_CSS = 'https://api.fontshare.com/v2/css?f[]=clash-display@500,600&display=swap';

// Body: Outfit, self-hosted from src/fonts (latin, OFL).
const outfit = localFont({
  src: [
    { path: '../../fonts/outfit/outfit-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-outfit',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Outfit Fallback'],
});

export const metadata = productMetadata(NO_SNOOZE_SOLEN);

export default function NoSnoozeSolenPage() {
  ReactDOM.preconnect('https://api.fontshare.com');
  ReactDOM.preconnect('https://cdn.fontshare.com', { crossOrigin: 'anonymous' });

  return (
    <>
      <link rel="stylesheet" href={CLASH_DISPLAY_CSS} precedence="default" />
      <JsonLd data={productJsonLd(NO_SNOOZE_SOLEN)} />
      <ProductLanding config={NO_SNOOZE_SOLEN} fontClassName={outfit.variable} />
    </>
  );
}
