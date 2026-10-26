"use client";
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState, type CSSProperties } from "react";

/*
  Stickman Theme Switch (neumorphic)
  Light → dark: click the sun, the stick figure walks to the hole, hops and drops in. Lights out.
  Dark → light: click the moon, he leaps out of the hole, lands, walks back to the knob. Lights on.
  The theme only changes when the story says so, through onThemeChange.
  Controlled (theme + onThemeChange) or uncontrolled (defaultTheme). External theme changes snap, no animation.
  Reduced motion: theme flips instantly.
*/

export type SwitchTheme = "light" | "dark";

export interface StickmanThemeSwitchHandle {
  toggle: () => void;
}

export interface StickmanThemeSwitchProps {
  theme?: SwitchTheme;
  defaultTheme?: SwitchTheme;
  onThemeChange?: (theme: SwitchTheme) => void;
  /** Width in px. Height follows (280:110). Everything scales with it. */
  width?: number;
  className?: string;
}

// Scene coordinates (viewBox 280 × 110)
const GROUND = 68;
const HOLE_X = 215;
const HOME_X = 55; // knob centre: he lives behind the knob and steps out from it
const BELOW = -60; // lift value that puts him fully inside the hole

const PALETTE: Record<SwitchTheme, Record<string, string>> = {
  light: { panel: "#e6e9f3", hi: "#ffffff", lo: "#c3c8d6", fig: "#2b2f45", hole: "#c4c9d8", rim: "#d3d7e3" },
  dark: { panel: "#1f2330", hi: "#2b3042", lo: "#12141c", fig: "#f2f4f8", hole: "#0a0c12", rim: "#171a24" },
};

type Figure = { x: number; lift: number; phase: number; walk: number; arms: number; face: 1 | -1 };

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const StickmanThemeSwitch = forwardRef<StickmanThemeSwitchHandle, StickmanThemeSwitchProps>(
  function StickmanThemeSwitch({ theme, defaultTheme = "light", onThemeChange, width = 280, className = "" }, ref) {
    const clipId = `above-${useId().replace(/:/g, "")}`;
    const [inner, setInner] = useState<SwitchTheme>(theme ?? defaultTheme);
    const current = theme ?? inner;
    const isDark = current === "dark";

    const [pressed, setPressed] = useState(false);
    const busy = useRef(false);
    const alive = useRef(true);
    const fig = useRef<Figure>({ x: HOME_X, lift: isDark ? BELOW : 0, phase: 0, walk: 0, arms: 0, face: 1 });
    const parts = useRef<Record<string, SVGElement | null>>({});

    const draw = useCallback(() => {
      const p = parts.current;
      const { x, lift, phase, walk, arms, face } = fig.current;
      const g = GROUND - lift;
      const bob = Math.abs(Math.sin(phase)) * 1.2 * walk;
      const hip = { x, y: g - 14 - bob };
      const shoulder = { x, y: g - 26 - bob };
      const leg = Math.sin(phase) * 0.55 * walk;
      const swing = -Math.sin(phase) * 0.5 * walk;
      const limb = (o: { x: number; y: number }, angle: number, len: number) => ({
        x: o.x + Math.sin(angle) * len * face,
        y: o.y + Math.cos(angle) * len,
      });
      const spread = arms * 1.25;
      const aL = limb(shoulder, swing + spread, 11);
      const aR = limb(shoulder, -swing - spread, 11);
      const lL = limb(hip, leg + arms * 0.35, 14);
      const lR = limb(hip, -leg - arms * 0.35, 14);
      const set = (el: SVGElement | null | undefined, attrs: Record<string, number>) => {
        if (!el) return;
        for (const k in attrs) el.setAttribute(k, String(attrs[k]));
      };
      set(p.head, { cx: x, cy: g - 34 - bob });
      set(p.body, { x1: x, y1: g - 29 - bob, x2: hip.x, y2: hip.y });
      set(p.armL, { x1: shoulder.x, y1: shoulder.y, x2: aL.x, y2: aL.y });
      set(p.armR, { x1: shoulder.x, y1: shoulder.y, x2: aR.x, y2: aR.y });
      set(p.legL, { x1: hip.x, y1: hip.y, x2: lL.x, y2: lL.y });
      set(p.legR, { x1: hip.x, y1: hip.y, x2: lR.x, y2: lR.y });
    }, []);

    const tween = useCallback(
      (ms: number, fn: (t: number) => void) =>
        new Promise<void>((resolve) => {
          const start = performance.now();
          const step = (now: number) => {
            if (!alive.current) return resolve();
            const t = Math.min(1, (now - start) / ms);
            fn(t);
            draw();
            if (t < 1) requestAnimationFrame(step);
            else resolve();
          };
          requestAnimationFrame(step);
        }),
      [draw],
    );

    const pause = (ms: number) => new Promise<void>((r) => setTimeout(() => r(), ms));

    const walkTo = useCallback(
      async (target: number, ms: number) => {
        const f = fig.current;
        const from = f.x;
        f.face = target > from ? 1 : -1;
        await tween(ms, (t) => {
          f.x = from + (target - from) * t;
          f.phase = (t * ms) / 1000 * 11;
          f.walk = Math.min(1, t * 6, (1 - t) * 6);
        });
        f.walk = 0;
      },
      [tween],
    );

    const commit = useCallback(
      (next: SwitchTheme) => {
        if (theme === undefined) setInner(next);
        onThemeChange?.(next);
      },
      [theme, onThemeChange],
    );

    const toggle = useCallback(async () => {
      if (busy.current) return;
      const goingDark = current === "light";
      const f = fig.current;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        Object.assign(f, { x: HOME_X, lift: goingDark ? BELOW : 0, walk: 0, arms: 0, face: 1 });
        draw();
        commit(goingDark ? "dark" : "light");
        return;
      }

      busy.current = true;
      setPressed(true);
      setTimeout(() => setPressed(false), 180);

      if (goingDark) {
        // Walk to the hole, hop, drop in, lights out.
        await walkTo(HOLE_X - 20, 1750);
        const from = f.x;
        await tween(520, (t) => {
          f.x = from + 20 * t;
          const hop = t < 0.62 ? Math.sin(Math.PI * Math.min(1, t * 1.6)) * 16 : 0;
          const drop = t > 0.45 ? (t - 0.45) * 90 : 0;
          f.lift = hop - drop;
          f.arms = Math.sin(Math.PI * t);
        });
        Object.assign(f, { lift: BELOW, arms: 0 });
        draw();
        await pause(150);
        if (alive.current) commit("dark");
      } else {
        // Leap out, land, walk back to the knob, lights on.
        Object.assign(f, { x: HOLE_X, face: -1 });
        await tween(620, (t) => {
          f.x = HOLE_X - 26 * ease(t);
          f.lift = -40 + 40 * t + Math.sin(Math.PI * t) * 26;
          f.arms = Math.sin(Math.PI * t);
        });
        Object.assign(f, { lift: 0, arms: 0 });
        await tween(120, (t) => {
          f.lift = -Math.sin(Math.PI * t) * 1.5; // little landing squat
        });
        await walkTo(HOME_X, 1650);
        f.face = 1;
        draw();
        await pause(120);
        if (alive.current) commit("light");
      }
      busy.current = false;
    }, [current, commit, draw, tween, walkTo]);

    useImperativeHandle(ref, () => ({ toggle }), [toggle]);

    useEffect(() => {
      alive.current = true;
      return () => {
        alive.current = false;
      };
    }, []);

    // External theme changes (system, other toggles) snap the figure into place without animating.
    useEffect(() => {
      if (busy.current) return;
      Object.assign(fig.current, { x: HOME_X, lift: isDark ? BELOW : 0, walk: 0, arms: 0, face: 1 });
      draw();
    }, [isDark, draw]);

    const c = PALETTE[current];
    const em = width / 280 * 16;
    const vars = {
      "--panel": c.panel,
      "--hi": c.hi,
      "--lo": c.lo,
      "--fig": c.fig,
      "--hole": c.hole,
      "--rim": c.rim,
    } as CSSProperties;

    const partRef = (name: string) => (el: SVGElement | null) => {
      parts.current[name] = el;
    };

    return (
      <div
        className={`relative shrink-0 ${className}`}
        style={{
          ...vars,
          width,
          aspectRatio: "280 / 110",
          fontSize: em,
          borderRadius: "2.2em",
          background: "var(--panel)",
          boxShadow: "0.6em 0.6em 1.2em var(--lo), -0.6em -0.6em 1.2em var(--hi)",
          transition: "background 0.45s, box-shadow 0.45s",
        }}
      >
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label="Dark mode"
          onClick={toggle}
          className="absolute flex items-center justify-center rounded-full border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          style={{
            left: "8.9%",
            top: "22.7%",
            width: "21.4%",
            aspectRatio: "1",
            cursor: "pointer",
            zIndex: 1, // above the scene, so the figure hides behind the knob
            background: "var(--panel)",
            boxShadow: pressed
              ? "inset 0.3em 0.3em 0.6em var(--lo), inset -0.3em -0.3em 0.6em var(--hi)"
              : "0.35em 0.35em 0.7em var(--lo), -0.35em -0.35em 0.7em var(--hi)",
            transition: "background 0.45s, box-shadow 0.2s",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className="absolute"
            style={{
              width: "45%",
              opacity: isDark ? 0 : 1,
              transform: isDark ? "rotate(90deg) scale(0.6)" : "none",
              transition: "opacity 0.35s, transform 0.45s",
            }}
            fill="none"
            stroke="#f5a623"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4.5" fill="#f5a623" />
            <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className="absolute"
            style={{
              width: "42%",
              opacity: isDark ? 1 : 0,
              transform: isDark ? "none" : "rotate(-60deg)",
              transition: "opacity 0.35s, transform 0.45s",
              filter: "drop-shadow(0 0 6px #38bdf8)",
            }}
            aria-hidden="true"
          >
            <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="#38bdf8" />
          </svg>
        </button>

        <svg viewBox="0 0 280 110" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <clipPath id={clipId}>
              {/* Everything below the hole's centre line is hidden, so he disappears into it */}
              <rect x="0" y="-50" width="280" height={GROUND + 50 + 0.5} />
            </clipPath>
          </defs>
          <ellipse cx={HOLE_X} cy={GROUND} rx="23" ry="7.5" fill="var(--rim)" style={{ transition: "fill 0.45s" }} />
          <ellipse cx={HOLE_X} cy={GROUND + 0.6} rx="20" ry="5.8" fill="var(--hole)" style={{ transition: "fill 0.45s" }} />
          <g
            clipPath={`url(#${clipId})`}
            stroke="var(--fig)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            style={{ transition: "stroke 0.3s" }}
          >
            <circle ref={partRef("head")} r="4.6" fill="var(--fig)" stroke="none" />
            <line ref={partRef("body")} />
            <line ref={partRef("armL")} />
            <line ref={partRef("armR")} />
            <line ref={partRef("legL")} />
            <line ref={partRef("legR")} />
          </g>
        </svg>
      </div>
    );
  },
);
