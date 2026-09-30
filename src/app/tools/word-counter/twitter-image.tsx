import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { OG_PAGES } from '@/lib/og-pages';

const page = OG_PAGES.wordCounter;

export const alt = page.alt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage(page);
}
