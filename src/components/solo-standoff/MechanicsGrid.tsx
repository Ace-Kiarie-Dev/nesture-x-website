'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const ART = '/images/solo-standoff';

type Mechanic = {
  id: string;
  title: string;
  body: string;
  /** Sprite drawn in the scene; the portal is drawn in CSS instead */
  src?: string;
};

const MECHANICS: Mechanic[] = [
  {
    id: 'mirror',
    title: 'Mirror',
    body: 'Bounces a shot round the corner. Angle it right and one bullet does two jobs.',
    src: `${ART}/props/prop_mirror_blade.webp`,
  },
  {
    id: 'wall',
    title: 'Wall',
    body: 'Stops a bullet dead. Sometimes the best shot is the one you block.',
    src: `${ART}/props/prop_wall_block.webp`,
  },
  {
    id: 'barrel',
    title: 'Barrel',
    body: 'Shoot it and it explodes, taking out everything next to it.',
    src: `${ART}/props/prop_barrel.webp`,
  },
  {
    id: 'portal',
    title: 'Portal',
    body: 'In one side, out the other. Bullets travel through the pair.',
  },
  {
    id: 'turntable',
    title: 'Turntable',
    body: 'Spins whoever stands on it to face a new way.',
    src: `${ART}/props/prop_turntable.webp`,
  },
  {
    id: 'thug',
    title: 'Thug',
    body: 'Your targets. Every one has to go down.',
    src: `${ART}/characters/skull_thug_down.webp`,
  },
  {
    id: 'armored',
    title: 'Armored thug',
    body: 'Takes two hits. The first one only cracks the armor.',
    src: `${ART}/characters/armored_thug_down.webp`,
  },
  {
    id: 'hostage',
    title: 'Hostage',
    body: 'Never hit a hostage. One stray bullet and the mission fails.',
    src: `${ART}/characters/hostage_down.webp`,
  },
];

// Restart the card's CSS animations: drop the class, force a reflow, add it back.
function play(card: HTMLElement | null) {
  if (!card) return;
  card.classList.remove('is-playing');
  void card.offsetWidth;
  card.classList.add('is-playing');
}

function Scene({ m }: { m: Mechanic }) {
  if (m.id === 'portal') {
    return (
      <>
        <span className="ss-portal ss-portal--a" />
        <span className="ss-portal ss-portal--b" />
        <span className="ss-scene-bullet" />
      </>
    );
  }

  return (
    <>
      <span className={`ss-scene-art ss-scene-art--${m.id}`}>
        <Image src={m.src!} alt="" width={240} height={240} sizes="140px" draggable={false} />
        {m.id === 'armored' && (
          <svg className="ss-crack" viewBox="0 0 100 100" aria-hidden="true">
            <polyline points="30,30 44,44 38,52 55,62 50,70 66,82" />
            <polyline points="44,44 56,40 62,46" />
          </svg>
        )}
      </span>
      {m.id === 'turntable' && (
        <svg className="ss-turn-arrow" viewBox="-6 -10 18 20" aria-hidden="true">
          <path d="M12 0 -6 -10 -2 0 -6 10Z" fill="currentColor" />
        </svg>
      )}
      {m.id === 'barrel' && <span className="ss-burst" />}
      {(m.id === 'wall' || m.id === 'mirror') && <span className="ss-scene-spark" />}
      {m.id !== 'turntable' && <span className="ss-scene-bullet" />}
    </>
  );
}

export default function MechanicsGrid() {
  const gridRef = useRef<HTMLUListElement>(null);

  // Touch screens have no hover: play each card once as it scrolls into view.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !window.matchMedia('(hover: none)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          play(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 },
    );
    grid.querySelectorAll('.ss-mech').forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <ul className="ss-mech-grid" ref={gridRef}>
      {MECHANICS.map((m) => (
        <li
          key={m.id}
          className={`ss-mech ss-mech--${m.id}`}
          onPointerEnter={(e) => e.pointerType === 'mouse' && play(e.currentTarget)}
          onClick={(e) => play(e.currentTarget)}
        >
          <button type="button" className="ss-scene" aria-label={`Play the ${m.title.toLowerCase()} animation`}>
            <Scene m={m} />
          </button>
          <h3 className="ss-h3">{m.title}</h3>
          <p>{m.body}</p>
        </li>
      ))}
    </ul>
  );
}
