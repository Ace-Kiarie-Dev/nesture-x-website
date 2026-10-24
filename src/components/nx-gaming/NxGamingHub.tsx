'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NX_GAMES, LIVE_GAMES, isLive, type Game } from '@/lib/nx-gaming/games';
import { SOCIAL } from '@/constants';

const COUNT = NX_GAMES.length;
const pad = (n: number) => String(n).padStart(2, '0');

// Minimum horizontal travel (px) for a touch drag on the stage to count as a swipe.
const SWIPE_PX = 40;

// Per-card layout for both breakpoints, handed to CSS as custom properties so the
// media query in nx-gaming.css picks one and the server render never depends on
// the viewport. Numbers come straight from the mockups.
function cardVars(game: Game, index: number, sel: number): CSSProperties {
  const on = index === sel;

  // Wide screens: all four fanned around the centre.
  const d = index - (COUNT - 1) / 2;
  const dx = d * 262;
  const dy = on ? -40 : Math.abs(d) * 22 - 6;
  const rotD = on ? 0 : d * 5;

  // Phone: a carousel that wraps, showing the selected card and one either side.
  let off = index - sel;
  if (off > COUNT / 2) off -= COUNT;
  if (off < -COUNT / 2) off += COUNT;
  const ao = Math.abs(off);

  return {
    '--tf-d': `translate(${dx}px, ${dy}px) rotate(${rotD}deg) scale(${on ? 1.07 : 0.96})`,
    '--z-d': on ? 20 : 10 - Math.abs(index - sel),
    '--filter-d': on ? 'none' : 'brightness(0.78) saturate(0.85)',
    '--shadow-d': on
      ? `12px 14px 30px rgba(6,9,18,0.7),-8px -8px 22px rgba(255,255,255,0.06),0 26px 70px -18px ${game.accent}aa`
      : '9px 11px 24px rgba(6,9,18,0.65),-6px -6px 18px rgba(255,255,255,0.05)',
    '--art-d': `${game.heroWidth.desktop}px`,

    '--tf-m': `translateX(${off * 176}px) translateY(${on ? -18 : 6}px) rotate(${off * 8}deg) scale(${on ? 1.04 : 0.86})`,
    '--z-m': 20 - ao,
    '--op-m': ao > 1 ? 0 : on ? 1 : 0.7,
    '--shadow-m': on
      ? `10px 12px 26px rgba(6,9,18,0.7),-7px -7px 18px rgba(255,255,255,0.06),0 22px 60px -16px ${game.accent}aa`
      : '7px 9px 20px rgba(6,9,18,0.65),-5px -5px 14px rgba(255,255,255,0.05)',
    '--art-m': `${game.heroWidth.mobile}px`,

    background: game.bg,
  } as CSSProperties;
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Pager({ sel, go, className }: { sel: number; go: (i: number) => void; className: string }) {
  return (
    <div className={`nxg-pager ${className}`}>
      <button type="button" className="nxg-btn-soft" onClick={() => go(sel - 1)} aria-label="Previous game">
        ← Prev
      </button>
      <span className="nxg-pager-count">
        {pad(sel + 1)} / {pad(COUNT)}
      </span>
      <button type="button" className="nxg-btn-soft" onClick={() => go(sel + 1)} aria-label="Next game">
        Next →
      </button>
    </div>
  );
}

export default function NxGamingHub() {
  const [sel, setSel] = useState(0);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Set when the selection moved by arrow key, so focus follows it.
  const focusOnChange = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  // A swipe that ends on a card would also fire its click; this swallows that click.
  const swiped = useRef(false);

  const go = (i: number) => setSel(((i % COUNT) + COUNT) % COUNT);
  const cur = NX_GAMES[sel];

  useEffect(() => {
    if (!focusOnChange.current) return;
    focusOnChange.current = false;
    cardRefs.current[sel]?.focus();
  }, [sel]);

  const onStageKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1, ArrowDown: 1 }[e.key];
    if (step === undefined && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    focusOnChange.current = true;
    if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(COUNT - 1);
    else go(sel + (step ?? 0));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    swiped.current = false;
    swipeStart.current = e.pointerType === 'mouse' ? null : { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
      swiped.current = true;
      go(sel + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <main>
      <section className="nxg-stage-section">
        <div className="nxg-wrap nxg-hero">
          <p className="nxg-eyebrow">
            <span className="nxg-eyebrow-dot" aria-hidden="true" />
            NX Gaming · Nairobi
            <span className="nxg-eyebrow-dot" aria-hidden="true" />
          </p>
          <h1 className="nxg-title">
            Pick a game.
            <br />
            <span>Press start.</span>
          </h1>
          <p className="nxg-lede">Free browser games built by Nesture-X. No sign-up, nothing to install.</p>
          <div className="nxg-unlocked nxg-label">
            <span>Unlocked</span>
            <span className="nxg-pips" aria-hidden="true">
              {NX_GAMES.map((game) => (
                <span key={game.slug} className={`nxg-pip${isLive(game) ? ' is-on' : ''}`} />
              ))}
            </span>
            <span>
              {LIVE_GAMES.length} / {COUNT}
            </span>
          </div>
        </div>

        <div
          id="games"
          className="nxg-stage"
          role="group"
          aria-label="Select a game"
          onKeyDown={onStageKey}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          <div
            className="nxg-stage-glow"
            aria-hidden="true"
            style={{ background: `radial-gradient(closest-side,${cur.accent}55,rgba(0,0,0,0))` }}
          />
          {NX_GAMES.map((game, i) => {
            const on = i === sel;
            const live = isLive(game);
            let off = Math.abs(i - sel);
            if (off > COUNT / 2) off = COUNT - off;
            return (
              <button
                key={game.slug}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                type="button"
                className={`nxg-card${on ? ' is-sel' : ''}${off > 1 ? ' is-hidden-m' : ''}`}
                style={cardVars(game, i, sel)}
                onClick={() => {
                  if (swiped.current) swiped.current = false;
                  else go(i);
                }}
                aria-pressed={on}
                aria-label={`${game.name}, ${live ? 'live' : 'locked'}`}
                tabIndex={on ? 0 : -1}
              >
                <span className="nxg-card-glow" aria-hidden="true" style={{ background: game.glow }} />
                <span className="nxg-chip nxg-chip-slot" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                <span className={`nxg-chip nxg-chip-status${live ? '' : ' is-locked'}`} aria-hidden="true">
                  {!live && <LockIcon />}
                  {live ? 'LIVE' : 'LOCKED'}
                </span>
                <span className="nxg-art">
                  <Image
                    src={game.hero.src}
                    alt=""
                    width={game.hero.width}
                    height={game.hero.height}
                    sizes={`(min-width: 1080px) ${game.heroWidth.desktop}px, ${game.heroWidth.mobile}px`}
                    preload={i < 2}
                    draggable={false}
                  />
                </span>
                <span className="nxg-card-foot" aria-hidden="true">
                  <span className="nxg-card-name">{game.name}</span>
                  <span className="nxg-card-kind nxg-label">{game.kind}</span>
                </span>
              </button>
            );
          })}
        </div>

        <Pager sel={sel} go={go} className="nxg-pager-m" />
      </section>

      <section className="nxg-wrap nxg-info-section">
        <div className="nxg-panel nxg-info" aria-live="polite">
          <div className="nxg-info-main">
            <div className="nxg-info-head">
              <h2 className="nxg-info-name">{cur.name}</h2>
              <span className="nxg-label">
                {cur.kind} · {isLive(cur) ? 'Live' : 'Locked'}
              </span>
            </div>
            <ul className="nxg-tags">
              {cur.tags.map((tag) => (
                <li key={tag} className="nxg-tag nxg-label">
                  {tag}
                </li>
              ))}
            </ul>
            <p className="nxg-blurb">{cur.blurb}</p>
          </div>
          <div className="nxg-info-cta">
            {isLive(cur) ? (
              <>
                {/* Plain <a>: the games are static pages outside the Next app, so a full load is wanted. */}
                <a href={cur.href} className="nxg-btn-blue nxg-start">
                  <svg viewBox="0 0 10 12" width="10" height="12" aria-hidden="true">
                    <path d="M0 0l10 6-10 6z" fill="#ffffff" />
                  </svg>
                  <span className="nxg-blink">Press start</span>
                </a>
                <span className="nxg-cta-note nxg-label">
                  <span className="nxg-controls-d">{cur.controls.desktop}</span>
                  <span className="nxg-controls-m">{cur.controls.mobile}</span>
                </span>
              </>
            ) : (
              <>
                <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="nxg-btn-soft nxg-follow">
                  Follow @nesture_x to unlock
                </a>
                <span className="nxg-cta-note nxg-label">Locked · coming soon</span>
              </>
            )}
          </div>
        </div>
        <Pager sel={sel} go={go} className="nxg-pager-d" />
      </section>

      <section className="nxg-wrap nxg-why-section">
        <div className="nxg-panel nxg-why">
          <div className="nxg-why-copy">
            <p className="nxg-eyebrow">Why games</p>
            <h2 className="nxg-h2">We make games the way we make websites.</h2>
            <p className="nxg-copy">
              Every game here is designed and coded in-house by Peter Kiarie and the Nesture-X team. Same attention to
              detail, same mobile-first thinking, same Nairobi roots as our client work.
            </p>
          </div>
          <div className="nxg-why-side">
            <ul className="nxg-points">
              <li>Your scores and progress stay on your device.</li>
              <li>Plain HTML, CSS and JavaScript. Fast to load, easy on your data.</li>
              <li>2048 installs as an app and plays offline. More games will follow.</li>
            </ul>
            <div className="nxg-book-row">
              <Link href="/booking" className="nxg-btn-blue nxg-book">
                Book a Consultation →
              </Link>
              <span className="nxg-book-note">Need something built?</span>
            </div>
          </div>
        </div>
      </section>

      <section className="nxg-wrap nxg-about">
        <div className="nxg-about-inner">
          <h2>Free online games by NX Gaming</h2>
          <p>
            NX Gaming makes free browser games that run on phones, tablets and desktops. Play 2048, a sliding tile
            puzzle with boards from 3×3 to 6×6, or Flappy Horror, a Halloween arcade game where a little ghost dodges
            zombie hands. No account needed, and your best scores are saved in your browser.
          </p>
        </div>
      </section>
    </main>
  );
}
