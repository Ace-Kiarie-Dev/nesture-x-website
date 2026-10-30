'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getHomeFeaturedOriginals } from '@/data/nxOriginals';
import { getProjectDestination } from '@/lib/getProjectDestination';
import { cx } from '@/components/redesign/cx';

// Same slides, order, links and status as the old hero carousel.
const SLIDES = getHomeFeaturedOriginals();
const N = SLIDES.length;

const CARD_MS = 5000; // one card passes the middle every 5s
const STEP_MS = 600; // prev / next
const SETTLE_MS = 380; // after a drag
const RISE = 150; // the middle of the arc sits this much higher than the ends
const BASE_Y = 360; // card centre at the ends, px from the top of the stage (top: 360px in home.css)
const RAIL_DROP = 100; // the dashed rail runs this far below the card centres
const SVG_H = 480; // rail canvas height; overflow is visible, so it only needs to cover the rail
const WIDE_MQ = '(min-width: 1100px)';
const REDUCED_MQ = '(prefers-reduced-motion: reduce)';

const frac = (v: number) => v - Math.floor(v);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// Half the arc's width: cards wrap from one end to the other out of sight.
const halfSpan = (vw: number) => Math.min(600, Math.max(380, vw * 0.3));
// Card i's place on the path, -1 (left end) to 1 (right end). progress 0.5 centres card 0.
const pathU = (progress: number, i: number) => 2 * frac(progress - i / N) - 1;
const nearestIndex = (progress: number) => (((Math.round((progress - 0.5) * N)) % N) + N) % N;
const snap = (progress: number) => Math.round((progress - 0.5) * N) / N + 0.5;
const cardZ = (au: number) => 100 - Math.round(au * 50);
// Starting places for the server HTML (card 0 centred), so the arc is laid out before JS runs.
const START = SLIDES.map((_, i) => pathU(0.5, i));

function railPath(width: number, H: number, from: number, to: number) {
  // A slice of the parabola y = base - RISE * (1 - (x/H)^2) is itself a quadratic Bezier.
  const cx0 = width / 2;
  const base = BASE_Y + RAIL_DROP;
  const y = (x: number) => base - RISE * (1 - (x * x) / (H * H));
  const dy = (x: number) => (2 * RISE * x) / (H * H);
  const a = -from;
  const b = to;
  const c = (a + b) / 2;
  const cy = y(a) + dy(a) * (c - a);
  return {
    d: `M ${cx0 + a} ${y(a)} Q ${cx0 + c} ${cy} ${cx0 + b} ${y(b)}`,
    ends: [
      [cx0 + a, y(a)],
      [cx0 + b, y(b)],
    ],
  };
}

export default function HeroArc() {
  const rootRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const [wide, setWide] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [centre, setCentre] = useState(0);
  const [rowSel, setRowSel] = useState(0);
  const [rail, setRail] = useState<{ w: number; d: string; ends: number[][] } | null>(null);

  // Everything the frame loop touches lives in refs, so it never re-renders per frame.
  const s = useRef({
    progress: 0.5,
    anim: null as null | { from: number; to: number; start: number; dur: number },
    drag: null as null | { id: number; x0: number; p0: number; moved: boolean },
    justDragged: false,
    hover: false,
    focus: false,
    onScreen: true,
    tabHidden: false,
    paused: false,
    reduced: false,
    wide: true,
    H: 500,
    // The mask's resolved stops (px from the hero centre), measured on resize: where it is
    // fully transparent on the left / right, and the width of each fade band.
    maskL: 300,
    maskR: 300,
    maskF: 100,
    centre: 0,
    focusOnChange: false,
  });

  // Write every card's place on the path from the current progress: two CSS variables
  // (--u, --au) that home.css turns into translate / rotate / scale. No layout reads.
  const apply = useCallback(() => {
    const st = s.current;
    if (!st.wide) return;
    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const u = pathU(st.progress, i);
      const au = Math.abs(u);
      el.style.setProperty('--u', u.toFixed(4));
      el.style.setProperty('--au', au.toFixed(4));
      el.style.zIndex = String(cardZ(au));
      // Cards at under half opacity in the mask's fade bands (or past them) take no pointer:
      // no hover, no clicks on something you can barely see.
      const x = u * st.H;
      const opacity = Math.min((x + st.maskL) / st.maskF, (st.maskR - x) / st.maskF);
      el.style.pointerEvents = opacity >= 0.5 ? 'auto' : 'none';
    }
    const c = nearestIndex(st.progress);
    if (c !== st.centre) {
      st.centre = c;
      setCentre(c);
    }
  }, []);

  const go = useCallback(
    (delta: number) => {
      const st = s.current;
      const from = st.progress;
      const to = snap(st.anim ? st.anim.to : from) + delta / N;
      if (st.reduced || !st.wide) {
        st.anim = null;
        st.progress = to;
        apply();
      } else {
        st.anim = { from, to, start: performance.now(), dur: STEP_MS };
      }
    },
    [apply],
  );

  // Media queries: arc vs row, reduced motion.
  useEffect(() => {
    const wq = window.matchMedia(WIDE_MQ);
    const rq = window.matchMedia(REDUCED_MQ);
    const sync = () => {
      s.current.wide = wq.matches;
      s.current.reduced = rq.matches;
      setWide(wq.matches);
      setReduced(rq.matches);
      if (!wq.matches) {
        // Row mode: CSS lays the cards out; drop the arc's per-card pointer switch.
        for (const el of cardRefs.current) if (el) el.style.pointerEvents = '';
      }
    };
    sync();
    wq.addEventListener('change', sync);
    rq.addEventListener('change', sync);
    return () => {
      wq.removeEventListener('change', sync);
      rq.removeEventListener('change', sync);
    };
  }, []);

  // Geometry: measured on resize only (never inside the frame loop).
  useEffect(() => {
    if (!wide) return;
    const hero = rootRef.current?.closest('.nxhp-hero');
    const layer = layerRef.current;
    if (!hero || !layer) return;
    // Resolve a length from the mask's CSS variables by measuring a throwaway probe.
    const probe = (value: string) => {
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;visibility:hidden;height:0;width:${value}`;
      layer.appendChild(el);
      const px = el.getBoundingClientRect().width;
      el.remove();
      return px;
    };
    const measure = () => {
      const st = s.current;
      const lr = layer.getBoundingClientRect();
      st.H = halfSpan(window.innerWidth);
      st.maskL = probe('var(--nxhp-arc-l)');
      st.maskR = probe('var(--nxhp-arc-r)');
      st.maskF = Math.max(1, probe('var(--nxhp-arc-fade)'));
      // The rail's end dots sit where the mask turns fully opaque.
      const { d, ends } = railPath(lr.width, st.H, Math.max(60, st.maskL - st.maskF), Math.max(60, st.maskR - st.maskF));
      setRail({ w: lr.width, d, ends });
      apply();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(hero);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [wide, apply]);

  // The loop: one progress value, advanced in requestAnimationFrame while the hero is on
  // screen and the tab is visible. Hover, focus, the pause button and reduced motion stop
  // the auto advance; prev / next and drag settling still animate.
  useEffect(() => {
    if (!wide) return;
    const st = s.current;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 0;
      last = now;
      if (st.anim) {
        const t = Math.min(1, (now - st.anim.start) / st.anim.dur);
        st.progress = st.anim.from + (st.anim.to - st.anim.from) * easeInOut(t);
        if (t >= 1) st.anim = null;
        apply();
      } else if (!st.drag && !st.paused && !st.hover && !st.focus && !st.reduced) {
        st.progress += dt / (CARD_MS * N);
        apply();
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || !st.onScreen || st.tabHidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      st.onScreen = e.isIntersecting;
      if (st.onScreen) start();
      else stop();
    });
    if (rootRef.current) io.observe(rootRef.current);
    const onVis = () => {
      st.tabHidden = document.hidden;
      if (st.tabHidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVis);
    apply();
    start();
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [wide, apply]);

  useEffect(() => {
    s.current.paused = paused;
  }, [paused]);

  // Keyboard stepping keeps focus on the centred card as it changes.
  useEffect(() => {
    if (!s.current.focusOnChange) return;
    s.current.focusOnChange = false;
    linkRefs.current[centre]?.focus({ preventScroll: true });
  }, [centre]);

  // Row mode: the card nearest the row's centre is the selected (scaled-up) one.
  useEffect(() => {
    if (wide) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        setRowSel(best);
      });
    };
    onScroll();
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [wide]);

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!wide || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    s.current.focusOnChange = linkRefs.current.includes(document.activeElement as HTMLAnchorElement);
    go(e.key === 'ArrowRight' ? 1 : -1);
  };

  // Drag / swipe on the arc scrubs the progress; release settles on the nearest card.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!wide || e.button !== 0) return;
    const st = s.current;
    st.anim = null;
    st.drag = { id: e.pointerId, x0: e.clientX, p0: st.progress, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    const dr = st.drag;
    if (!dr || dr.id !== e.pointerId) return;
    const dx = e.clientX - dr.x0;
    if (!dr.moved && Math.abs(dx) > 6) {
      dr.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (dr.moved) {
      st.progress = dr.p0 + dx / (2 * st.H);
      apply();
    }
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    const dr = st.drag;
    if (!dr || dr.id !== e.pointerId) return;
    st.drag = null;
    if (!dr.moved) return;
    st.justDragged = true;
    setTimeout(() => (st.justDragged = false), 0);
    const to = snap(st.progress);
    if (st.reduced) {
      st.progress = to;
      apply();
    } else {
      st.anim = { from: st.progress, to, start: performance.now(), dur: SETTLE_MS };
    }
  };

  const live = SLIDES[wide ? centre : rowSel];
  const autoplaying = wide && !paused && !reduced;

  return (
    <section
      ref={rootRef}
      className="nxhp-arc"
      role="region"
      aria-roledescription="carousel"
      aria-label="NX Originals"
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') s.current.hover = true;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') s.current.hover = false;
      }}
      onFocus={() => (s.current.focus = true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) s.current.focus = false;
      }}
    >
      <p className="nxhp-arc-label nx-glass">NX Originals · Built in-house</p>

      <div
        className="nxhp-arc-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (s.current.justDragged) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div ref={layerRef} className="nxhp-arc-layer">
          {wide && rail && (
            <svg className="nxhp-arc-rail" viewBox={`0 0 ${rail.w} ${SVG_H}`} width={rail.w} height={SVG_H} aria-hidden="true" focusable="false">
              <path d={rail.d} />
              {rail.ends.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" />
              ))}
            </svg>
          )}

          <ul ref={trackRef} className="nxhp-arc-track">
            {SLIDES.map((slide, i) => {
              const dest = getProjectDestination(slide.link, slide.slug);
              const current = wide ? i === centre : true;
              return (
                <li
                  key={slide.id}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={cx('nxhp-arc-item', !wide && i === rowSel && 'is-sel')}
                  style={
                    {
                      '--nxhp-accent': slide.accent,
                      '--u': START[i],
                      '--au': Math.abs(START[i]),
                      zIndex: cardZ(Math.abs(START[i])),
                    } as CSSProperties
                  }
                  aria-hidden={current ? undefined : true}
                >
                  {/* Hover / focus lift lives on this wrapper, so it never fights the path transform on the item. */}
                  <div className="nxhp-arc-lift">
                    <Link
                      ref={(el) => {
                        linkRefs.current[i] = el;
                      }}
                      href={dest.href}
                      {...(dest.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      tabIndex={current ? 0 : -1}
                      draggable={false}
                      className="nxhp-arc-card nx-clay"
                    >
                      <span className="nxhp-arc-tab" aria-hidden="true" />
                      <span className="nxhp-arc-shot">
                        <Image
                          src={slide.imageSrc}
                          alt=""
                          fill
                          draggable={false}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          sizes="(min-width: 1100px) 180px, 300px"
                        />
                      </span>
                      <span className="nxhp-arc-body">
                        <span className={cx('nxhp-arc-chip', slide.status.toLowerCase() === 'live' && 'is-live')}>
                          {slide.status}
                        </span>
                        <span className="nxhp-arc-name">{slide.title}</span>
                        <span className="nxhp-arc-tagline">{slide.description}</span>
                      </span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="nxhp-arc-controls">
        <button type="button" className="nxhp-arc-btn nx-inset" onClick={() => go(-1)} aria-label="Previous NX Original">
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className="nxhp-arc-btn nxhp-arc-pause nx-inset"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Play carousel' : 'Pause carousel'}
        >
          {paused ? (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
              <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>
        <button type="button" className="nxhp-arc-btn nx-inset" onClick={() => go(1)} aria-label="Next NX Original">
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {/* Announces the centred card. Quiet while it auto-advances, polite otherwise. */}
      <p className="nxhp-sr-only" aria-live={autoplaying ? 'off' : 'polite'} aria-atomic="true">
        {live.title}, {(wide ? centre : rowSel) + 1} of {N}
      </p>

    </section>
  );
}
