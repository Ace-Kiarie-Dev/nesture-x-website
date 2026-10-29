import Image from 'next/image';
import SiteNav from '@/components/redesign/SiteNav';
import SiteFooter from '@/components/redesign/SiteFooter';
import GravityTextLazy from '@/components/effects/GravityTextLazy';
import { ClayButton, Eyebrow } from '@/components/redesign';
import { ASSETS_3D } from '@/lib/assets3d';
import './not-found.css';

const COMPASS = ASSETS_3D['misc-compass'];

// Every unmatched URL lands here, including ones under /admin and /legal that get no
// shell chrome, so the page brings SiteNav and SiteFooter itself and .nx-404 hides
// ClientShell's copies where there are any (hybrid.css). Next adds the noindex tag for 404s.
export default function NotFound() {
  return (
    <div className="nx-404 nx-grid-bg">
      <SiteNav />
      <main className="nx404">
        <div className="nx404-wrap">
          <div className="nx404-copy">
            <Eyebrow>404</Eyebrow>
            <h1 className="nx-sr-only">Page not found</h1>
            <div className="nx404-gt">
              <GravityTextLazy
                text="PAGE NOT FOUND"
                announce={false}
                height="var(--nx404-gt-h)"
                className="nx-gt-top nx-gt-left"
                letterClassName="nx404-letter nx-outline"
              />
            </div>
            <p className="nx-body nx404-line">That page fell apart. Let&apos;s get you back.</p>
            <ClayButton href="/">Back to home</ClayButton>
          </div>
          <Image
            src={COMPASS.src}
            alt=""
            width={COMPASS.width}
            height={COMPASS.height}
            priority
            sizes="(min-width: 1024px) 300px, 180px"
            className="nx404-art"
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
