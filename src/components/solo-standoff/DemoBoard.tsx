'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// A 5x5 slice of a real rooftop: the agent fires east along the bottom row,
// the / mirror sends the shot north, and it drops both thugs in one tap.
// Board maths follow the game (src/game/drawBoard.ts): sprite feet sit 0.4
// tiles below the tile centre.

const SIZE = 5;
const TILE = 100 / SIZE; // % of the board
// The game draws sprites at 1.32 tiles; a little larger reads better at web size.
const SPRITE = 1.5;
const FEET = 0.4;
const ART = '/images/solo-standoff';

type Piece = {
  id: string;
  row: number;
  col: number;
  src: string;
  alt: string;
  kind: 'sprite' | 'prop';
  /** Prop width in tiles */
  scale?: number;
};

const PIECES: Piece[] = [
  { id: 'barrel', row: 0, col: 1, src: `${ART}/props/prop_barrel.webp`, alt: 'Barrel', kind: 'prop', scale: 0.82 },
  { id: 'wall', row: 2, col: 0, src: `${ART}/props/prop_wall_block.webp`, alt: 'Wall', kind: 'prop', scale: 0.9 },
  { id: 'thug2', row: 1, col: 4, src: `${ART}/characters/thug_down.webp`, alt: 'Thug', kind: 'sprite' },
  { id: 'hostage', row: 2, col: 2, src: `${ART}/characters/hostage_down.webp`, alt: 'Hostage', kind: 'sprite' },
  { id: 'thug', row: 2, col: 4, src: `${ART}/characters/skull_thug_down.webp`, alt: 'Thug', kind: 'sprite' },
  { id: 'mirror', row: 4, col: 4, src: `${ART}/props/prop_mirror_blade.webp`, alt: 'Mirror', kind: 'prop', scale: 0.96 },
  { id: 'agent', row: 4, col: 0, src: `${ART}/characters/agent_right.webp`, alt: 'Agent facing east', kind: 'sprite' },
];

// Shot timeline, ms. One tile of travel takes TILE_MS.
const TILE_MS = 140;
const T_MIRROR = 3.6 * TILE_MS;
const T_THUG = T_MIRROR + 2 * TILE_MS;
const T_THUG2 = T_THUG + TILE_MS;
const T_CLEAR = T_THUG2 + 650;

const centre = (n: number) => (n + 0.5) * TILE;
// Bullets fly at gun height, a little above the tile centre.
const GUN = -0.2 * TILE;

type Phase = 'ready' | 'firing' | 'clear';
type Spark = { id: number; row: number; col: number };

function Star({ delay, animate }: { delay: number; animate: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="ss-demo-star"
      aria-hidden="true"
      initial={animate ? { scale: 0, rotate: -40 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: 'spring', stiffness: 420, damping: 14 }}
    >
      <path
        d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2l-5.9 3.2 1.3-6.5L2.5 9.3l6.6-.8L12 2.5Z"
        fill="currentColor"
        stroke="#3a2306"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export default function DemoBoard() {
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>('ready');
  const [taps, setTaps] = useState(0);
  const [down, setDown] = useState<Record<string, boolean>>({});
  const [mirrorFlash, setMirrorFlash] = useState(0);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const at = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const hit = (id: string, row: number, col: number) => {
    setDown((d) => ({ ...d, [id]: true }));
    setSparks((s) => [...s, { id: Date.now() + col * 10 + row, row, col }]);
  };

  function fire() {
    if (phase !== 'ready') return;
    setTaps(1);
    if (reduceMotion) {
      setDown({ thug: true, thug2: true });
      setPhase('clear');
      return;
    }
    setPhase('firing');
    at(T_MIRROR, () => setMirrorFlash((n) => n + 1));
    at(T_THUG, () => hit('thug', 2, 4));
    at(T_THUG2, () => hit('thug2', 1, 4));
    at(T_CLEAR, () => setPhase('clear'));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase('ready');
    setTaps(0);
    setDown({});
    setSparks([]);
  }

  const status =
    phase === 'clear'
      ? 'Mission clear. One tap, three stars.'
      : phase === 'firing'
        ? 'Shot fired.'
        : 'Ready. Tap the agent or press Fire.';

  return (
    <div className="ss-phone">
      <div className="ss-phone-screen">
        <div className="ss-hud" aria-label="Mission status">
          <span className="ss-hud-chip">
            <small>Mission</small>12
          </span>
          <span className="ss-hud-chip">
            <small>Par</small>1 tap
          </span>
          <span className="ss-hud-chip ss-hud-chip--amber">
            <small>Taps</small>
            {taps}
          </span>
        </div>

        <div className="ss-board" role="group" aria-label="Demo level, 5 by 5 rooftop">
          {Array.from({ length: SIZE * SIZE }, (_, i) => (
            <span key={i} className={`ss-tile ${(Math.floor(i / SIZE) + i) % 2 ? 'ss-tile--alt' : ''}`} aria-hidden="true" />
          ))}

          {/* Floor arrow in front of the agent, squashed into perspective like the game */}
          <svg
            className="ss-floor-arrow"
            viewBox="-6 -10 18 20"
            aria-hidden="true"
            style={{ left: `${centre(0) + 0.36 * TILE}%`, top: `${centre(4) + 0.22 * TILE}%` }}
          >
            <path d="M12 0 -6 -10 -2 0 -6 10Z" fill="currentColor" />
          </svg>

          {PIECES.map((p) => {
            const isDown = !!down[p.id];
            const w = p.kind === 'sprite' ? SPRITE * TILE : (p.scale ?? 1) * TILE;
            const left = centre(p.col) - w / 2;
            const top =
              p.kind === 'sprite'
                ? centre(p.row) + FEET * TILE - w
                : centre(p.row) - w / 2;
            return (
              <motion.div
                key={p.id}
                className={`ss-piece ss-piece--${p.id}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${w}%`,
                  zIndex: (p.kind === 'prop' && p.id === 'mirror' ? 0 : 10) + p.row * 10,
                }}
                animate={
                  isDown
                    ? { rotate: -78, y: '22%', x: '-6%', opacity: 0.4 } // fall inward, away from the board edge
                    : { rotate: 0, y: 0, x: 0, opacity: 1 }
                }
                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18 }}
              >
                <Image src={p.src} alt={p.alt} width={200} height={200} sizes="96px" draggable={false} />
                {p.id === 'mirror' && mirrorFlash > 0 && (
                  <motion.span
                    key={mirrorFlash}
                    className="ss-mirror-flash"
                    initial={{ opacity: 1, scale: 0.4 }}
                    animate={{ opacity: 0, scale: 1.4 }}
                    transition={{ duration: 0.35 }}
                    aria-hidden="true"
                  />
                )}
              </motion.div>
            );
          })}

          {/* The agent is the trigger, exactly as in the game */}
          <button
            type="button"
            className="ss-agent-hit"
            style={{ left: `${centre(0) - TILE / 2}%`, top: `${centre(4) - TILE}%`, width: `${TILE}%`, height: `${TILE * 1.5}%` }}
            onClick={fire}
            disabled={phase !== 'ready'}
            aria-label="Tap the agent to fire east"
          />

          {phase === 'firing' && (
            <motion.span
              className="ss-bullet"
              aria-hidden="true"
              style={{ x: '-50%', y: '-50%' }}
              initial={{ left: `${centre(0) + 0.4 * TILE}%`, top: `${centre(4) + GUN}%`, rotate: 0 }}
              animate={{
                left: [`${centre(0) + 0.4 * TILE}%`, `${centre(4)}%`, `${centre(4)}%`, `${centre(4)}%`],
                top: [`${centre(4) + GUN}%`, `${centre(4) + GUN}%`, `${centre(2) + GUN}%`, `${centre(1) + GUN}%`],
                rotate: [0, 0, -90, -90],
                opacity: [1, 1, 1, 0],
              }}
              transition={{
                duration: T_THUG2 / 1000,
                ease: 'linear',
                times: [0, T_MIRROR / T_THUG2, T_THUG / T_THUG2, 1],
                rotate: {
                  duration: T_THUG2 / 1000,
                  ease: 'linear',
                  times: [0, T_MIRROR / T_THUG2, (T_MIRROR + 20) / T_THUG2, 1],
                },
              }}
            />
          )}

          {phase === 'firing' && (
            <motion.span
              className="ss-muzzle"
              aria-hidden="true"
              style={{ left: `${centre(0) + 0.42 * TILE}%`, top: `${centre(4) + GUN}%`, x: '-50%', y: '-50%' }}
              initial={{ opacity: 1, scale: 1.2 }}
              animate={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.18 }}
            />
          )}

          {sparks.map((s) => (
            <motion.span
              key={s.id}
              className="ss-spark"
              aria-hidden="true"
              style={{ left: `${centre(s.col)}%`, top: `${centre(s.row) + GUN}%`, x: '-50%', y: '-50%' }}
              initial={{ opacity: 1, scale: 0.3 }}
              animate={{ opacity: 0, scale: 1.8 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          ))}

          <AnimatePresence>
            {phase === 'clear' && (
              <motion.div
                className="ss-clear"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.p
                  className="ss-clear-stamp"
                  initial={reduceMotion ? false : { scale: 1.9, rotate: -14, opacity: 0 }}
                  animate={{ scale: 1, rotate: -7, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 16 }}
                >
                  Mission clear
                </motion.p>
                <div className="ss-clear-stars" aria-hidden="true">
                  <Star delay={0.25} animate={!reduceMotion} />
                  <Star delay={0.4} animate={!reduceMotion} />
                  <Star delay={0.55} animate={!reduceMotion} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="ss-btn ss-btn--amber ss-demo-fire"
          onClick={phase === 'clear' ? reset : fire}
          disabled={phase === 'firing'}
        >
          {phase === 'clear' ? 'Play it again' : 'Fire'}
        </button>
        <p className="ss-demo-hint">One bullet. Two thugs. Leave the hostage alone.</p>
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}
