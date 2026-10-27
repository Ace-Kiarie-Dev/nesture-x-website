"use client";
import { useEffect, useRef } from "react";
import Matter from "matter-js";

/*
  Gravity Text
  - Load:         letters drop and pile up
  - Rest:         after assembleDelay, they lift off one by one (random order) and drift back into the word
  - Click / tap:  assembled → collapse and drop. In a pile → put themselves back together now
  - Double click: explode outward from the click point, then pile up and reassemble on their own
  - Drag:         grab and throw loose letters
  Reduced motion: just shows the word.
*/

export interface GravityTextProps {
  text?: string;
  /** Stage height. Any CSS height, e.g. 360 or "100%". */
  height?: number | string;
  className?: string;
  /** Class per letter, or a function for per-word styling (e.g. accent the second word). */
  letterClassName?: string | ((char: string, index: number, wordIndex: number) => string);
  /** Ms the letters lie in the pile before they start putting themselves back. */
  assembleDelay?: number;
  /** Ms each letter takes to fly back into place. */
  assembleDuration?: number;
  /** Ms between letters starting their trip back. */
  assembleStagger?: number;
  gravity?: number;
  explodeForce?: number;
  /** Allow grabbing and throwing letters. Note: on touch screens this blocks page scroll inside the stage. */
  draggable?: boolean;
}

type Item = {
  index: number;
  body: Matter.Body;
  el: HTMLSpanElement;
  w: number;
  h: number;
  tx: number;
  ty: number;
  tween: { fromX: number; fromY: number; fromA: number; start: number; begun: boolean } | null;
};

type State = "falling" | "assembling" | "assembled";

const { Engine, Runner, Bodies, Body, Composite, Events, Mouse, MouseConstraint } = Matter;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const normalizeAngle = (a: number) => {
  const twoPi = Math.PI * 2;
  return ((((a + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI;
};
const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function GravityText({
  text = "GRAVITY",
  height = 360,
  className = "",
  letterClassName = "text-6xl font-bold",
  assembleDelay = 2000,
  assembleDuration = 1100,
  assembleStagger = 140,
  gravity = 1.1,
  explodeForce = 16,
  draggable = true,
}: GravityTextProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layoutRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const chars = Array.from(text);
  let word = 0;
  const wordIndexes = chars.map((c) => (c === " " ? word++ : word));
  const classFor = (c: string, i: number) =>
    typeof letterClassName === "function" ? letterClassName(c, i, wordIndexes[i]) : letterClassName;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let disposed = false;
    let state: State = "falling";
    let items: Item[] = [];
    let walls: Matter.Body[] = [];
    let assembleTimer = 0;
    let clickTimer = 0;
    let pointerDown = { x: 0, y: 0 };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const engine = Engine.create();
    engine.gravity.y = gravity;
    const runner = Runner.create();

    const buildWalls = () => {
      Composite.remove(engine.world, walls);
      const W = stage.clientWidth;
      const H = stage.clientHeight;
      const opts = { isStatic: true };
      walls = [
        Bodies.rectangle(W / 2, H + 50, W * 3, 100, opts),
        Bodies.rectangle(-50, H / 2, 100, H * 6, opts),
        Bodies.rectangle(W + 50, H / 2, 100, H * 6, opts),
      ];
      Composite.add(engine.world, walls);
    };

    // Targets come from an invisible copy of the text laid out normally, so it wraps and centres like real text.
    const measureTargets = () => {
      items.forEach((item) => {
        const el = layoutRefs.current[item.index];
        if (!el) return;
        item.w = el.offsetWidth;
        item.h = el.offsetHeight;
        item.tx = el.offsetLeft + item.w / 2;
        item.ty = el.offsetTop + item.h / 2;
      });
    };

    const sync = () => {
      items.forEach(({ body, el, w, h }) => {
        el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
      });
    };

    const scheduleAssemble = () => {
      window.clearTimeout(assembleTimer);
      assembleTimer = window.setTimeout(() => assemble(), 1400 + assembleDelay);
    };

    const assemble = () => {
      if (state !== "falling") return;
      window.clearTimeout(assembleTimer);
      state = "assembling";
      const now = performance.now();
      shuffle(items).forEach((item, order) => {
        item.tween = { fromX: 0, fromY: 0, fromA: 0, start: now + order * assembleStagger, begun: false };
      });
    };

    const release = (kind: "drop" | "explode", point?: { x: number; y: number }) => {
      if (reduceMotion) return;
      state = "falling";
      items.forEach(({ body }, i) => {
        items[i].tween = null;
        if (body.isStatic) Body.setStatic(body, false);
        body.isSensor = false;
        if (kind === "explode" && point) {
          const dx = body.position.x - point.x;
          const dy = body.position.y - point.y;
          const dist = Math.max(30, Math.hypot(dx, dy));
          const power = explodeForce * (0.6 + Math.random() * 0.6);
          Body.setVelocity(body, { x: (dx / dist) * power, y: (dy / dist) * power - 6 });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.5);
        } else {
          Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: -1 - Math.random() * 2 });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12);
        }
      });
      scheduleAssemble();
    };

    // Moves letters along their trip home. Tweening letters are sensors so they glide through the pile.
    const stepTweens = () => {
      if (state !== "assembling") return;
      const now = performance.now();
      let allDone = true;
      items.forEach((item) => {
        const tw = item.tween;
        if (!tw) return;
        allDone = false;
        const t = (now - tw.start) / assembleDuration;
        if (t < 0) return;
        const { body } = item;
        if (!tw.begun) {
          tw.begun = true;
          Body.setStatic(body, true);
          body.isSensor = true;
          Body.setAngle(body, normalizeAngle(body.angle));
          tw.fromX = body.position.x;
          tw.fromY = body.position.y;
          tw.fromA = body.angle;
        }
        const p = Math.min(1, t);
        const e = easeInOutCubic(p);
        const lift = Math.sin(Math.PI * p) * 40;
        Body.setPosition(body, {
          x: tw.fromX + (item.tx - tw.fromX) * e,
          y: tw.fromY + (item.ty - tw.fromY) * e - lift,
        });
        Body.setAngle(body, tw.fromA * (1 - e));
        if (p >= 1) {
          Body.setPosition(body, { x: item.tx, y: item.ty });
          Body.setAngle(body, 0);
          body.isSensor = false;
          item.tween = null;
        }
      });
      if (allDone) state = "assembled";
    };

    // Single tap vs double tap, works for mouse and touch. Drags don't count as clicks.
    const onPointerDown = (e: PointerEvent) => {
      pointerDown = { x: e.clientX, y: e.clientY };
      if (state === "falling") scheduleAssemble(); // playing with the pile delays the reassembly
    };
    const onClick = (e: MouseEvent) => {
      if (Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y) > 6) return;
      if (clickTimer) {
        window.clearTimeout(clickTimer);
        clickTimer = 0;
        const rect = stage.getBoundingClientRect();
        release("explode", { x: e.clientX - rect.left, y: e.clientY - rect.top });
        return;
      }
      clickTimer = window.setTimeout(() => {
        clickTimer = 0;
        if (state === "falling") assemble();
        else release("drop");
      }, 260);
    };

    let mouse: Matter.Mouse | null = null;
    const init = () => {
      if (disposed) return;
      buildWalls();

      items = chars
        .map((c, index) => ({ c, index }))
        .filter(({ c }) => c !== " ")
        .map(({ index }) => ({
          index,
          body: Bodies.rectangle(0, 0, 1, 1),
          el: letterRefs.current[index]!,
          w: 0,
          h: 0,
          tx: 0,
          ty: 0,
          tween: null,
        }));
      measureTargets();

      items.forEach((item, order) => {
        const startY = reduceMotion ? item.ty : -item.h - order * 45;
        item.body = Bodies.rectangle(item.tx, startY, item.w * 0.92, item.h * 0.82, {
          restitution: 0.35,
          friction: 0.3,
          frictionAir: 0.01,
          chamfer: { radius: 4 },
          angle: reduceMotion ? 0 : (Math.random() - 0.5) * 0.6,
          isStatic: reduceMotion,
        });
        Composite.add(engine.world, item.body);
        item.el.style.visibility = "visible";
      });

      if (reduceMotion) {
        state = "assembled";
        sync();
        return;
      }

      if (draggable) {
        mouse = Mouse.create(stage);
        const m = mouse as unknown as Record<string, EventListener>;
        stage.removeEventListener("mousewheel", m.mousewheel);
        stage.removeEventListener("DOMMouseScroll", m.mousewheel);
        const grab = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, render: { visible: false } },
        });
        Composite.add(engine.world, grab);
      }

      Events.on(engine, "beforeUpdate", stepTweens);
      Events.on(engine, "afterUpdate", sync);
      Runner.run(runner, engine);
      scheduleAssemble();
    };

    // Re-fit walls and targets when the stage resizes. Assembled letters snap to their new spots.
    const resizeObserver = new ResizeObserver(() => {
      if (!items.length) return;
      buildWalls();
      measureTargets();
      if (state === "assembled") {
        items.forEach((item) => Body.setPosition(item.body, { x: item.tx, y: item.ty }));
        sync();
      }
    });
    resizeObserver.observe(stage);

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("click", onClick);

    // Wait for web fonts so letter sizes are measured correctly.
    (document.fonts?.ready ?? Promise.resolve()).then(init);

    return () => {
      disposed = true;
      window.clearTimeout(assembleTimer);
      window.clearTimeout(clickTimer);
      resizeObserver.disconnect();
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("click", onClick);
      if (mouse) {
        // Exactly the listeners matter-js attaches in Mouse.setElement
        const m = mouse as unknown as Record<string, EventListener>;
        const attached: [string, string][] = [
          ["mousemove", "mousemove"],
          ["mousedown", "mousedown"],
          ["mouseup", "mouseup"],
          ["touchmove", "mousemove"],
          ["touchstart", "mousedown"],
          ["touchend", "mouseup"],
        ];
        attached.forEach(([type, handler]) => stage.removeEventListener(type, m[handler]));
      }
      Runner.stop(runner);
      Events.off(engine, "beforeUpdate", stepTweens);
      Events.off(engine, "afterUpdate", sync);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      items.forEach(({ el }) => {
        el.style.visibility = "hidden";
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, assembleDelay, assembleDuration, assembleStagger, gravity, explodeForce, draggable]);

  return (
    <div
      ref={stageRef}
      className={`relative w-full select-none overflow-hidden ${draggable ? "cursor-grab active:cursor-grabbing touch-none" : "cursor-pointer"} ${className}`}
      style={{ height }}
      role="img"
      aria-label={text}
    >
      {/* Invisible layout copy, used to measure where each letter belongs */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 flex flex-wrap content-center items-center justify-center px-4"
      >
        {chars.map((c, i) => (
          <span
            key={`layout-${i}`}
            ref={(el) => {
              layoutRefs.current[i] = el;
            }}
            className={`inline-block leading-none whitespace-pre ${classFor(c, i)}`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* The physical letters */}
      {chars.map((c, i) =>
        c === " " ? null : (
          <span
            key={`letter-${i}`}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 inline-block leading-none will-change-transform ${classFor(c, i)}`}
            style={{ visibility: "hidden" }}
          >
            {c}
          </span>
        ),
      )}
    </div>
  );
}

