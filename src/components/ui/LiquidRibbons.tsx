"use client";
import { useEffect, useId, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";

/*
  Liquid metal ribbons.
  - Each ribbon is re-drawn every frame from a few anchor points, so it flows and twists like liquid
  - Bright sparks travel along each ribbon's edge
  - Pointer bends nearby ribbons toward it; tap sends a surge that ripples out and speeds the sparks
  - Pauses itself when off screen or when the tab is hidden
  - Transparent: no background of its own, so the page behind shows through
*/

export type RibbonScheme = "gold" | "ice" | "emerald" | "violet" | "crimson";

interface RibbonPalette {
  label: string;
  swatch: string;
  a: [string, string, string, string, string, string];
  b: [string, string, string, string, string];
  hl1: string;
  hl2: string;
  bg: string;
}

export const RIBBON_SCHEMES: Record<RibbonScheme, RibbonPalette> = {
  gold: {
    label: "Gold",
    swatch: "#F5C518",
    a: ["#1a0e03", "#8a4f0c", "#f2b23d", "#fff0c4", "#c06f12", "#150b02"],
    b: ["#0a0a0c", "#55555d", "#e9e9ee", "#5a5a62", "#08080a"],
    hl1: "#ffe7a6",
    hl2: "#f4f4f7",
    bg: "#040405",
  },
  ice: {
    label: "Ice blue",
    swatch: "#4CD6FF",
    a: ["#020b14", "#0b3a66", "#2f8fe0", "#d8f4ff", "#1466b0", "#020812"],
    b: ["#08090c", "#4a5260", "#e3e8f0", "#505866", "#07080a"],
    hl1: "#bfeeff",
    hl2: "#eef2f8",
    bg: "#030507",
  },
  emerald: {
    label: "Emerald",
    swatch: "#34E3A0",
    a: ["#02100a", "#0b4a33", "#1fb57c", "#d9ffef", "#0f7a52", "#010a06"],
    b: ["#08090a", "#4c5452", "#e4ebe8", "#535b58", "#070808"],
    hl1: "#b8f7dc",
    hl2: "#eef4f1",
    bg: "#030504",
  },
  violet: {
    label: "Violet",
    swatch: "#A98BFF",
    a: ["#0a0414", "#36175e", "#8a5cf0", "#efe6ff", "#c94fd6", "#08020f"],
    b: ["#09080c", "#504c5c", "#e8e4f0", "#575262", "#08070a"],
    hl1: "#dccfff",
    hl2: "#f3f0f8",
    bg: "#040306",
  },
  crimson: {
    label: "Crimson",
    swatch: "#FF4D5E",
    a: ["#140204", "#5c0d18", "#e0384c", "#ffd9de", "#a3182c", "#0d0102"],
    b: ["#0a0a0b", "#55555b", "#e9e9ec", "#5a5a60", "#080809"],
    hl1: "#ffc2c9",
    hl2: "#f4f4f6",
    bg: "#050304",
  },
};

export const RIBBON_SCHEME_KEYS = Object.keys(RIBBON_SCHEMES) as RibbonScheme[];

type Pt = [number, number];

interface RibbonDef {
  grad: "a" | "b";
  pts: Pt[];
  amp: number;
  speed: number;
  phase: number;
  width: number;
  glow: number;
  glowOp: number;
  bodyOp: number;
  hl: "hl1" | "hl2";
  hlOff: number;
  hlOp: number;
  pulses: number;
  pulseSpeed: number;
}

const RIBBONS: RibbonDef[] = [
  { grad: "a", pts: [[-220, 430], [220, 250], [650, 520], [1150, 330], [1500, 200], [1900, 250]], amp: 42, speed: 0.42, phase: 0, width: 46, glow: 150, glowOp: 0.55, bodyOp: 0.9, hl: "hl1", hlOff: -24, hlOp: 0.65, pulses: 2, pulseSpeed: 150 },
  { grad: "a", pts: [[-160, 120], [300, 40], [760, 260], [1200, 420], [1850, 540]], amp: 30, speed: 0.55, phase: 1.7, width: 28, glow: 0, glowOp: 0, bodyOp: 0.7, hl: "hl1", hlOff: -12, hlOp: 0.55, pulses: 1, pulseSpeed: 210 },
  { grad: "b", pts: [[-240, 930], [180, 700], [620, 960], [1100, 780], [1500, 560], [1900, 650]], amp: 50, speed: 0.34, phase: 3.1, width: 54, glow: 170, glowOp: 0.5, bodyOp: 0.85, hl: "hl2", hlOff: -28, hlOp: 0.5, pulses: 2, pulseSpeed: 120 },
  { grad: "a", pts: [[120, 1130], [520, 900], [1020, 1040], [1450, 920], [1850, 880]], amp: 34, speed: 0.48, phase: 4.4, width: 36, glow: 0, glowOp: 0, bodyOp: 0.5, hl: "hl1", hlOff: -16, hlOp: 0.35, pulses: 1, pulseSpeed: 170 },
];

const A_STOPS = [0, 0.28, 0.5, 0.62, 0.78, 1];
const B_STOPS = [0, 0.35, 0.55, 0.72, 1];

function smoothPath(pts: Pt[]): string {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

interface RibbonEls {
  glow: SVGPathElement | null;
  body: SVGPathElement | null;
  hl: SVGPathElement | null;
  pulses: (SVGPathElement | null)[];
}

export interface LiquidRibbonsProps {
  scheme?: RibbonScheme;
  interactive?: boolean;
  quality?: "high" | "lite";
  speed?: number;
  paused?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function LiquidRibbons({
  scheme = "gold",
  interactive = true,
  quality = "high",
  speed = 1,
  paused = false,
  className = "",
  style,
  children,
}: LiquidRibbonsProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const els = useRef<RibbonEls[]>(
    RIBBONS.map((r) => ({ glow: null, body: null, hl: null, pulses: Array.from({ length: r.pulses }, () => null) }))
  );
  const speedRef = useRef(speed);
  const pausedRef = useRef(paused);
  const interactiveRef = useRef(interactive);
  // Synced after each render (not during it) so the running loop always reads the latest props.
  useLayoutEffect(() => {
    speedRef.current = speed;
    pausedRef.current = paused;
    interactiveRef.current = interactive;
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 800, y: 500, tx: 800, ty: 500, active: 0, tactive: 0 };
    const offsets = RIBBONS.map((r) => Array.from({ length: r.pulses }, () => Math.random() * 1000));
    let surge = 0;
    let surgeX = 800;
    let t = 0;
    let last = performance.now();
    let raf = 0;
    let running = false;
    let onScreen = true;

    const toSvg = (clientX: number, clientY: number) => {
      const m = svg.getScreenCTM();
      if (!m) return { x: 800, y: 500 };
      const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };

    const shape = (r: RibbonDef): Pt[] => {
      const ampMul = 1 + surge * 1.6;
      return r.pts.map(([x, baseY], i) => {
        let y = baseY;
        y += Math.sin(t * r.speed + r.phase + i * 1.35) * r.amp * ampMul;
        y += Math.sin(t * r.speed * 0.53 + r.phase * 2 + i * 0.7) * r.amp * 0.45;
        const dx = x - pointer.x;
        const bend = Math.exp(-(dx * dx) / (2 * 260 * 260)) * pointer.active;
        y += (pointer.y - y) * 0.28 * bend;
        const sdx = x - surgeX;
        y += Math.exp(-(sdx * sdx) / (2 * 380 * 380)) * surge * 90 * Math.sin(t * 6 + i);
        return [x, y];
      });
    };

    const draw = (dt: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.active += (pointer.tactive - pointer.active) * 0.06;
      surge *= Math.pow(0.25, dt);
      if (surge < 0.001) surge = 0;

      RIBBONS.forEach((r, ri) => {
        const e = els.current[ri];
        const pts = shape(r);
        const d = smoothPath(pts);
        e.glow?.setAttribute("d", d);
        e.body?.setAttribute("d", d);
        const hd = smoothPath(pts.map(([x, y]) => [x, y + r.hlOff] as Pt));
        e.hl?.setAttribute("d", hd);
        e.pulses.forEach((p, pi) => {
          if (!p) return;
          if (!pausedRef.current) {
            offsets[ri][pi] = (offsets[ri][pi] + dt * r.pulseSpeed * speedRef.current * (1 + surge * 3)) % 1000;
          }
          p.setAttribute("d", hd);
          p.setAttribute("stroke-dashoffset", (-((offsets[ri][pi] + pi * 500) % 1000)).toFixed(1));
          p.setAttribute("opacity", (0.55 + surge * 0.45).toFixed(2));
        });
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!pausedRef.current) t += dt * speedRef.current;
      draw(dt);
      if (running) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduce || !onScreen || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    draw(0);
    start();

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(wrap);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (e: PointerEvent) => {
      if (!interactiveRef.current) return;
      const p = toSvg(e.clientX, e.clientY);
      pointer.tx = p.x;
      pointer.ty = p.y;
      pointer.tactive = 1;
    };
    const onLeave = () => {
      pointer.tactive = 0;
    };
    const onDown = (e: PointerEvent) => {
      if (!interactiveRef.current) return;
      if (e.target instanceof Element && e.target.closest("button, a, input, select, textarea")) return;
      const p = toSvg(e.clientX, e.clientY);
      pointer.tx = p.x;
      pointer.ty = p.y;
      pointer.tactive = 1;
      surgeX = p.x;
      surge = Math.min(1.4, surge + 1);
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointerdown", onDown);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const pal = RIBBON_SCHEMES[scheme];
  const gradA = `lr-a-${uid}`;
  const gradB = `lr-b-${uid}`;
  const soft = `lr-soft-${uid}`;
  const softer = `lr-softer-${uid}`;
  const spark = `lr-spark-${uid}`;
  const high = quality === "high";

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", isolation: "isolate", background: "transparent", ...style }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <linearGradient id={gradA} x1="0" y1="0" x2="1" y2="0">
            {pal.a.map((c, i) => (
              <stop key={i} offset={A_STOPS[i]} stopColor={c} />
            ))}
          </linearGradient>
          <linearGradient id={gradB} x1="0" y1="0" x2="1" y2="0">
            {pal.b.map((c, i) => (
              <stop key={i} offset={B_STOPS[i]} stopColor={c} />
            ))}
          </linearGradient>
          <filter id={soft} x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation={high ? 9 : 5} />
          </filter>
          <filter id={softer} x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation={22} />
          </filter>
          <filter id={spark} x="-20%" y="-60%" width="140%" height="220%">
            <feGaussianBlur stdDeviation={3} />
          </filter>
        </defs>
        {RIBBONS.map((r, ri) => {
          const stroke = `url(#${r.grad === "a" ? gradA : gradB})`;
          const hlColor = pal[r.hl];
          return (
            <g key={ri}>
              {high && r.glow > 0 && (
                <path
                  ref={(el) => {
                    els.current[ri].glow = el;
                  }}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={r.glow}
                  strokeLinecap="round"
                  filter={`url(#${softer})`}
                  opacity={r.glowOp}
                />
              )}
              <path
                ref={(el) => {
                  els.current[ri].body = el;
                }}
                fill="none"
                stroke={stroke}
                strokeWidth={r.width}
                strokeLinecap="round"
                filter={`url(#${soft})`}
                opacity={r.bodyOp}
              />
              <path
                ref={(el) => {
                  els.current[ri].hl = el;
                }}
                fill="none"
                stroke={hlColor}
                strokeWidth={1.8}
                opacity={r.hlOp}
              />
              {Array.from({ length: r.pulses }, (_, pi) => (
                <path
                  key={pi}
                  ref={(el) => {
                    els.current[ri].pulses[pi] = el;
                  }}
                  fill="none"
                  stroke={hlColor}
                  strokeWidth={3}
                  strokeLinecap="round"
                  pathLength={1000}
                  strokeDasharray="70 930"
                  filter={high ? `url(#${spark})` : undefined}
                />
              ))}
            </g>
          );
        })}
      </svg>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,.12) 65%, rgba(0,0,0,.4) 100%)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div>
    </div>
  );
}
