'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SHOTS = [
  { file: '01_home', caption: 'Pick your mission' },
  { file: '02_gameplay', caption: 'Plan every shot — Level 14, Last Words' },
  { file: '03_props_tray', caption: 'Build the setup — Level 12, Angles' },
  { file: '04_mission_clear', caption: 'Clear it in par — Bank Shot, three stars' },
  { file: '05_daily', caption: 'A new puzzle every day' },
  { file: '06_missions_map', caption: '70 missions across the city' },
];

export default function ScreenshotCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setAtStart(track.scrollLeft <= 4);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Move by one card; scroll-snap settles it on the next frame.
  function step(dir: 1 | -1) {
    const track = trackRef.current;
    const card = track?.querySelector('li');
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: dir * (card.clientWidth + gap), behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <div className="ss-shots">
      <ul
        ref={trackRef}
        className="ss-shots-track"
        tabIndex={0}
        aria-label="Screenshots. Use the arrow keys to scroll."
      >
        {SHOTS.map((shot, i) => (
          <li key={shot.file} className="ss-shot">
            <figure>
              <div className="ss-shot-frame">
                <Image
                  src={`/images/solo-standoff/screenshots/${shot.file}.webp`}
                  alt={`Solo Standoff screenshot: ${shot.caption}`}
                  width={520}
                  height={1172}
                  sizes="(min-width: 768px) 260px, 62vw"
                  loading="lazy"
                />
              </div>
              <figcaption>
                <span className="ss-shot-n">{String(i + 1).padStart(2, '0')}</span>
                {shot.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div className="ss-shots-nav">
        <button type="button" className="ss-btn ss-btn--icon" onClick={() => step(-1)} disabled={atStart} aria-label="Previous screenshot">
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <button type="button" className="ss-btn ss-btn--icon" onClick={() => step(1)} disabled={atEnd} aria-label="Next screenshot">
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
