'use client';

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import HeroRibbons from '@/components/redesign/HeroRibbons';
import GravityTextLazy from '@/components/effects/GravityTextLazy';
import Image from 'next/image';
import Link from 'next/link';
import { NX_GAMES, LIVE_GAMES, LIVE_PERKS, isLive, type Game } from '@/lib/nx-gaming/games';
import { SOCIAL } from '@/constants';
import { ASSETS_3D } from '@/lib/assets3d';
import { Band, Chip, ClayButton, Eyebrow, SectionHeading } from '@/components/redesign';

const COUNT = NX_GAMES.length;

// White "GA…ING" letters: only ever place the logo on a dark surface.
const LOGO = { src: '/images/NX-Gaming/nx-gaming-logo.webp', width: 720, height: 107 };
const pad = (n: number) => String(n).padStart(2, '0');

// Transparent cutout: the plain controller render has a white background.
const CONTROLLER = ASSETS_3D['controller-cutout'];

// The hero cast: the two locked games' characters.
const CAST = {
  front: NX_GAMES.find((g) => g.slug === 'solo-standoff')!,
  back: NX_GAMES.find((g) => g.slug === 'matatu-dash')!,
};

// Same breakpoint as nx-gaming.css: the fanned stage from here up, the swipe row below.
const FAN_MQ = '(min-width: 1100px)';
const REDUCED_MQ = '(prefers-reduced-motion: reduce)';

// "START." is live: GravityText letters (drop, pile, click, double click, drag) on their
// own stage over the word, mounted after load + idle. Until then, and under reduced motion,
// the static word shows with the same tipped letters as before (nx-gaming.css).

// Card art is ~250px tall on the fan and ~220px in the swipe row.
const artSizes = (game: Game) =>
  `(min-width: 1100px) ${Math.round((268 * game.hero.width) / game.hero.height)}px, ${Math.round(
    (220 * game.hero.width) / game.hero.height,
  )}px`;

// Fan layout (wide screens): each card's resting tilt and drop come from its slot, so
// the fan keeps its shape; the selected card overrides them in CSS. --d orders the
// stacking around the selection.
function fanVars(game: Game, index: number, sel: number): CSSProperties {
  const slot = index - (COUNT - 1) / 2;
  return {
    '--r': `${slot * 5}deg`,
    '--y': `${Math.abs(slot) * 16}px`,
    '--d': Math.abs(index - sel),
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

function Pager({ sel, go }: { sel: number; go: (i: number) => void }) {
  return (
    <div className="nxh-pager nx-inset">
      <button type="button" className="nxh-pager-btn" onClick={() => go(sel - 1)} aria-label="Previous game">
        ← Prev
      </button>
      <span className="nxh-pager-count">
        {pad(sel + 1)} / {pad(COUNT)}
      </span>
      <button type="button" className="nxh-pager-btn" onClick={() => go(sel + 1)} aria-label="Next game">
        Next →
      </button>
    </div>
  );
}

// The selected game's emblem: a round crop of its hero art with an accent ring and a
// LIVE dot or padlock. All four crops are stacked so a selection change is a CSS
// cross-fade. Decorative: the title names the game.
function Emblem({ cur }: { cur: Game }) {
  const live = isLive(cur);
  return (
    <span
      className={`nxh-emblem${live ? '' : ' is-locked'}`}
      style={{ '--nxh-accent': cur.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="nxh-emblem-art">
        {NX_GAMES.map((game) => (
          <Image
            key={game.slug}
            className={game === cur ? 'is-on' : undefined}
            src={game.hero.src}
            alt=""
            width={game.hero.width}
            height={game.hero.height}
            sizes="68px"
            draggable={false}
            style={{
              objectPosition: game.emblem.focus,
              transformOrigin: game.emblem.focus,
              transform: `scale(${game.emblem.zoom})`,
            }}
          />
        ))}
      </span>
      <span className="nxh-emblem-status">{live ? <span className="nxh-live-dot" /> : <LockIcon />}</span>
    </span>
  );
}

// An info panel link. As a sizer it keeps the same box but is a plain span: no link
// to prefetch or crawl, nothing to focus.
function Action({
  sizer,
  href,
  kind,
  className,
  children,
}: {
  sizer: boolean;
  href: string;
  kind: 'route' | 'page' | 'external';
  className: string;
  children: ReactNode;
}) {
  if (sizer) return <span className={className}>{children}</span>;
  if (kind === 'route')
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  return kind === 'external' ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

// Left side of the info panel. sizer renders the same layout without the emblem art,
// only to reserve height.
function InfoMain({ game, sizer = false }: { game: Game; sizer?: boolean }) {
  const live = isLive(game);
  return (
    <div className="nxh-info-main">
      {sizer ? <span className="nxh-emblem" /> : <Emblem cur={game} />}
      <div className="nxh-info-head">
        <h2 className="nxh-info-name">{game.name}</h2>
        <span className="nxh-label">
          {game.kind} · {live ? 'Live' : 'Coming soon'}
        </span>
      </div>
      <ul className="nxh-tags">
        <li>
          <Chip variant="blue">{game.kind}</Chip>
        </li>
        {[...game.tags, ...(live ? LIVE_PERKS : [])].map((tag) => (
          <li key={tag}>
            <Chip>{tag}</Chip>
          </li>
        ))}
      </ul>
      <p className="nxh-blurb nx-body">{game.blurb}</p>
    </div>
  );
}

// Right side of the info panel: the play button, or for a locked game a disabled one
// plus the existing links to its page, Instagram and the launch list.
function InfoCta({ game, sizer = false }: { game: Game; sizer?: boolean }) {
  if (isLive(game)) {
    return (
      <div className="nxh-info-cta">
        {/* Plain <a>: the games are static pages outside the Next app, so a full load is wanted. */}
        <Action sizer={sizer} href={game.href} kind="page" className="nx-clay-btn nxh-start">
          <svg viewBox="0 0 10 12" width="10" height="12" aria-hidden="true">
            <path d="M0 0l10 6-10 6z" fill="currentColor" />
          </svg>
          <span className="nxh-blink">Press start</span>
        </Action>
        <span className="nxh-cta-note nxh-label">
          <span className="nxh-controls-d">{game.controls.desktop}</span>
          <span className="nxh-controls-m">{game.controls.mobile}</span>
        </span>
      </div>
    );
  }
  return (
    <div className="nxh-info-cta">
      {sizer ? (
        <span className="nx-clay-btn nxh-start">Coming soon</span>
      ) : (
        <button type="button" className="nx-clay-btn nxh-start" disabled>
          <LockIcon />
          Coming soon
        </button>
      )}
      <div className="nxh-cta-more">
        <Action sizer={sizer} href={game.pageHref} kind="route" className="nx-clay-btn nx-clay-btn-ghost nx-clay-btn--sm">
          Explore {game.name} →
        </Action>
        <Action sizer={sizer} href={SOCIAL.instagram} kind="external" className="nx-clay-btn nx-clay-btn-ghost nx-clay-btn--sm">
          Follow @nesture_x
        </Action>
        {game.notifyHref && (
          <Action sizer={sizer} href={game.notifyHref} kind="route" className="nx-clay-btn nx-clay-btn-ghost nx-clay-btn--sm">
            Get notified
          </Action>
        )}
      </div>
    </div>
  );
}

export default function NxGamingHub() {
  const [sel, setSel] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // Set when the selection moved by arrow key, so focus follows it.
  const focusOnChange = useRef(false);
  // Set when the swipe row's scroll picked the selection, so it isn't scrolled back.
  const fromScroll = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (i: number) => setSel(((i % COUNT) + COUNT) % COUNT);
  const cur = NX_GAMES[sel];

  // Swipe row (below the fan breakpoint): keep the selected card centred.
  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRefs.current[sel];
    if (focusOnChange.current) {
      focusOnChange.current = false;
      card?.focus({ preventScroll: true });
    }
    if (fromScroll.current) {
      fromScroll.current = false;
      return;
    }
    if (!stage || !card || window.matchMedia(FAN_MQ).matches) return;
    stage.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - stage.clientWidth / 2,
      behavior: window.matchMedia(REDUCED_MQ).matches ? 'auto' : 'smooth',
    });
  }, [sel]);

  useEffect(() => () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
  }, []);

  // When a swipe settles, the card nearest the centre becomes the selection.
  const onStageScroll = () => {
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      const stage = stageRef.current;
      if (!stage || window.matchMedia(FAN_MQ).matches) return;
      const mid = stage.scrollLeft + stage.clientWidth / 2;
      let best = 0;
      cardRefs.current.forEach((card, i) => {
        const prev = cardRefs.current[best];
        if (!card || !prev) return;
        const d = Math.abs(card.offsetLeft + card.offsetWidth / 2 - mid);
        if (d < Math.abs(prev.offsetLeft + prev.offsetWidth / 2 - mid)) best = i;
      });
      if (best !== sel) {
        fromScroll.current = true;
        setSel(best);
      }
    }, 120);
  };

  const onStageKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -1, ArrowDown: 1 }[e.key];
    if (step === undefined && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    focusOnChange.current = true;
    if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(COUNT - 1);
    else go(sel + (step ?? 0));
  };

  return (
    <main className="nxh">
      <HeroRibbons className="nxh-ribbons" defer={false} />

      <div className="nxh-wrap">
        {/* ── Hero ── */}
        <section className="nxh-hero">
          <div className="nxh-hero-copy">
            <Eyebrow>NX Gaming · Nairobi</Eyebrow>
            <h1 className="nxh-title" aria-label="Pick a game. Press start.">
              <span className="nxh-title-line" aria-hidden="true">
                Pick a game.
              </span>
              <span className="nxh-title-line nx-outline" aria-hidden="true">
                Press{' '}
                <span className="nxh-fallen">
                  {/* Invisible copy that keeps the line's width; the stage sits on top of it. */}
                  <span className="nxh-start-size">
                    {'START.'.split('').map((ch, i) => (
                      <span key={i}>{ch}</span>
                    ))}
                  </span>
                  <span className="nxh-start-host">
                    <GravityTextLazy
                      text="START."
                      announce={false}
                      deferUntilIdle
                      height="1.85em"
                      className="nxh-start-stage nx-gt-bottom nx-gt-left"
                      letterClassName="nxh-start-letter"
                    />
                  </span>
                </span>
              </span>
            </h1>
            <p className="nxh-lede">Free browser games built by Nesture-X. No sign-up, nothing to install.</p>
            <div className="nxh-unlocked nx-clay">
              <span className="nxh-unlocked-label">Unlocked</span>
              <span className="nxh-unlocked-count">
                {LIVE_GAMES.length} / {COUNT}
              </span>
              <span className="nxh-dots" aria-hidden="true">
                {NX_GAMES.map((game) => (
                  <span key={game.slug} className={`nxh-dot${isLive(game) ? ' is-on' : ''}`} />
                ))}
              </span>
            </div>
          </div>

          <div className="nxh-cast" aria-hidden="true">
            <span className="nxh-cast-glow" />
            <Image
              className="nxh-cast-back"
              src={CAST.back.hero.src}
              alt=""
              width={CAST.back.hero.width}
              height={CAST.back.hero.height}
              sizes="(min-width: 1100px) 270px, 135px"
              preload
              draggable={false}
            />
            <Image
              className="nxh-cast-front"
              src={CAST.front.hero.src}
              alt=""
              width={CAST.front.hero.width}
              height={CAST.front.hero.height}
              sizes="(min-width: 1100px) 370px, 180px"
              preload
              draggable={false}
            />
          </div>
        </section>

        {/* ── Card stage ── */}
        <section className="nxh-stage-section" aria-label="Games">
          <div
            id="games"
            ref={stageRef}
            className="nxh-stage"
            role="group"
            aria-label="Select a game"
            onKeyDown={onStageKey}
            onScroll={onStageScroll}
          >
            {NX_GAMES.map((game, i) => {
              const on = i === sel;
              const live = isLive(game);
              return (
                <button
                  key={game.slug}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  type="button"
                  className={`nxh-card${on ? ' is-sel' : ''}`}
                  style={fanVars(game, i, sel)}
                  onClick={() => go(i)}
                  aria-pressed={on}
                  aria-label={`${game.name}, ${live ? 'live' : 'locked'}`}
                  tabIndex={on ? 0 : -1}
                >
                  <span className="nxh-card-glow" aria-hidden="true" style={{ background: game.glow }} />
                  <span className="nxh-card-chip nxh-card-slot" aria-hidden="true">
                    {pad(i + 1)}
                  </span>
                  <span className={`nxh-card-chip nxh-card-status${live ? '' : ' is-locked'}`} aria-hidden="true">
                    {!live && <LockIcon />}
                    {live ? 'LIVE' : 'LOCKED'}
                  </span>
                  <span className="nxh-art">
                    <Image
                      src={game.hero.src}
                      alt=""
                      width={game.hero.width}
                      height={game.hero.height}
                      sizes={artSizes(game)}
                      loading="eager"
                      draggable={false}
                    />
                  </span>
                  <span className="nxh-card-foot" aria-hidden="true">
                    <span className="nxh-card-name">{game.name}</span>
                    <span className="nxh-card-kind">{game.kind}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Info panel ── */}
        <section className="nxh-info nx-clay" aria-label="Selected game">
          {/* Every game's content shares one grid cell (the others hidden and inert), so the
              panel is always as tall as the tallest game and nothing below moves on a switch. */}
          <div className="nxh-stack" aria-live="polite">
            <div className="nxh-slide">
              <InfoMain game={cur} />
            </div>
            {NX_GAMES.map((game) => (
              <div key={game.slug} className="nxh-slide nxh-sizer" aria-hidden="true" inert>
                <InfoMain game={game} sizer />
              </div>
            ))}
          </div>
          <div className="nxh-info-side">
            <div className="nxh-stack">
              <div className="nxh-slide">
                <InfoCta game={cur} />
              </div>
              {NX_GAMES.map((game) => (
                <div key={game.slug} className="nxh-slide nxh-sizer" aria-hidden="true" inert>
                  <InfoCta game={game} sizer />
                </div>
              ))}
            </div>
            <Pager sel={sel} go={go} />
          </div>
        </section>

        {/* ── Why games ── */}
        <Band variant="slate" aria-labelledby="nxh-why-title" className="nxh-why-band">
          <div className="nxh-why">
            <div className="nxh-why-copy">
              <SectionHeading
                id="nxh-why-title"
                eyebrow="Why games"
                title="We make games the way we make websites."
                outline="the way we make websites."
              />
              <p className="nx-body">
                Every game here is designed and coded in-house by Peter Kiarie and the Nesture-X team. Same attention to
                detail, same mobile-first thinking, same Nairobi roots as our client work.
              </p>
              <div className="nxh-book-row">
                <ClayButton href="/booking">Book a Consultation →</ClayButton>
                <span className="nxh-book-note">Need something built?</span>
              </div>
            </div>
            <div className="nxh-why-side">
              <Image
                className="nxh-why-art"
                src={CONTROLLER.src}
                alt={CONTROLLER.alt}
                width={CONTROLLER.width}
                height={CONTROLLER.height}
                sizes="(min-width: 1100px) 300px, 220px"
              />
              <ul className="nxh-points">
                <li className="nx-clay">Your scores and progress stay on your device.</li>
                <li className="nx-clay">Plain HTML, CSS and JavaScript. Fast to load, easy on your data.</li>
                <li className="nx-clay">2048 installs as an app and plays offline. More games will follow.</li>
              </ul>
            </div>
          </div>
        </Band>

        {/* ── About ── */}
        <Band variant="dark" aria-labelledby="nxh-about-title">
          <div className="nxh-about">
            <span className="nxh-logo-chip">
              <Image src={LOGO.src} alt="" width={LOGO.width} height={LOGO.height} sizes="160px" />
            </span>
            <Eyebrow>Play free</Eyebrow>
            <h2 id="nxh-about-title" className="nxh-about-title">
              Free online games by NX Gaming
            </h2>
            <p className="nx-body">
              NX Gaming makes free browser games that run on phones, tablets and desktops. Play 2048, a sliding tile
              puzzle with boards from 3×3 to 6×6, or Flappy Horror, a Halloween arcade game where a little ghost dodges
              zombie hands. No account needed, and your best scores are saved in your browser.
            </p>
          </div>
        </Band>
      </div>
    </main>
  );
}
