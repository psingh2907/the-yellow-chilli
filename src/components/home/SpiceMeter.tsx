"use client";

import { Flip } from "gsap/Flip";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useLayoutEffect, useRef, useState } from "react";
import { ChilliIcon } from "@/components/ui/Mark";
import { allItems, type Heat } from "@/data/menu";
import { cn } from "@/lib/cn";
import { lazyDraggable, type LazyDraggable } from "@/lib/draggable";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(Flip, Physics2DPlugin, ScrambleTextPlugin);

const LEVELS = [
  { label: "Mild", hint: "Creamy, gentle, kid-friendly.", color: "#2f9e57", headline: "Pick your heat." },
  { label: "Medium", hint: "Warm and rounded. Most of the menu lives here.", color: "#bd7d10", headline: "A little warmth." },
  { label: "Hot", hint: "Chilli you can feel. Keep the raita close.", color: "#e05a12", headline: "Now we're talking." },
  { label: "Fiery", hint: "Dragon Paneer, Angara, Kolhapuri, Schezwan. You were warned.", color: "#e2412f", headline: "Bas! Paani laao!" },
] as const;

// Needle angle for each level (the dial spans -90° … 90°).
const ANGLES = [-67.5, -22.5, 22.5, 67.5];
const PER_LEVEL = 6;
const SHOWN = 8;

const picks = ([0, 1, 2, 3] as Heat[]).flatMap((h) =>
  allItems
    .filter((i) => i.heat === h && i.category !== "drinks")
    .sort((a, b) => Number(!!b.signature) - Number(!!a.signature) || b.price - a.price)
    .slice(0, PER_LEVEL),
);

/** Dishes at the chosen heat first, then the nearest neighbours (dimmed). */
const forLevel = (level: number) =>
  [...picks].sort((a, b) => Math.abs(a.heat - level) - Math.abs(b.heat - level) || b.heat - a.heat).slice(0, SHOWN);

/**
 * The Spice-o-meter. Drag the needle (Draggable rotation + Inertia, snapping
 * to four levels), or tap a level. The dish list re-sorts with Flip, the
 * headline scrambles to match, and at "Fiery" the whole section shakes
 * (CustomWiggle) and chilli flames burst out (Physics2D).
 */
export function SpiceMeter() {
  const root = useRef<HTMLElement>(null);
  const needle = useRef<SVGGElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [level, setLevel] = useState<number>(1);
  const levelRef = useRef(1);
  const needleDrag = useRef<LazyDraggable | null>(null);

  const changeLevel = (next: number) => {
    if (next === levelRef.current) return;
    if (list.current) flipState.current = Flip.getState(list.current.querySelectorAll("[data-dish]"));
    levelRef.current = next;
    setLevel(next);
  };

  // Drag the needle.
  useGSAP(
    () => {
      if (!needle.current) return;
      gsap.set(needle.current, { rotation: ANGLES[1], svgOrigin: "200 200" });
      const toLevel = (rotation: number) => ANGLES.reduce((best, a, i) => (Math.abs(a - rotation) < Math.abs(ANGLES[best] - rotation) ? i : best), 0);
      needleDrag.current = lazyDraggable(needle.current, {
        type: "rotation",
        bounds: { minRotation: -90, maxRotation: 90 },
        inertia: true,
        snap: (value) => ANGLES[toLevel(value)],
        onDrag() {
          changeLevel(toLevel(this.rotation));
        },
        onThrowUpdate() {
          changeLevel(toLevel(this.rotation));
        },
      });
      return () => needleDrag.current?.kill();
    },
    { scope: root },
  );

  // After React re-renders the list: animate from the old layout (Flip),
  // then react to the level.
  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    if (flipState.current && list.current && !reduced) {
      Flip.from(flipState.current, {
        targets: list.current.querySelectorAll("[data-dish]"),
        duration: 0.7,
        ease: "groove",
        // Not absolute: the list keeps its height while cards move, so the
        // page below never jumps.
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "groove", stagger: 0.04, clearProps: "opacity,transform" }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.3 }),
      });
    }
    flipState.current = null;
    if (reduced || !root.current) return;

    if (!needleDrag.current?.active()) gsap.to(needle.current, { rotation: ANGLES[level], duration: 0.6, ease: "groove", overwrite: "auto" });
    gsap.to("[data-meter-title]", { duration: 0.8, scrambleText: { text: LEVELS[level].headline, chars: "मिर्चXO#", speed: 0.6 } });
    gsap.to(root.current, { "--heat": LEVELS[level].color, duration: 0.6 });

    if (level === 3) {
      gsap.fromTo(root.current.querySelector("[data-shake]"), { x: 0 }, { x: 10, duration: 0.8, ease: "heat" });
      const flames = gsap.utils.toArray<HTMLElement>("[data-flame]", root.current);
      flames.forEach((f) => {
        gsap.fromTo(
          f,
          { x: 0, y: 0, opacity: 1, rotation: 0, scale: gsap.utils.random(0.6, 1.3) },
          {
            duration: gsap.utils.random(1.2, 2),
            physics2D: { velocity: gsap.utils.random(350, 700), angle: gsap.utils.random(-150, -30), gravity: 900 },
            rotation: gsap.utils.random(-360, 360),
            opacity: 0,
            ease: "none",
          },
        );
      });
    }
  }, [level]);

  const shown = forLevel(level);

  return (
    <section
      ref={root}
      aria-labelledby="meter-title"
      className="relative overflow-hidden bg-cream py-24 text-ink md:py-32"
      style={{ ["--heat" as string]: LEVELS[1].color }}
    >
      <div data-shake className="container-x grid items-center gap-12 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative mx-auto w-full max-w-md">
          <p className="label text-center text-muted">The Spice-o-meter · drag the needle</p>
          <svg viewBox="0 0 400 240" className="mt-4 w-full touch-none overflow-visible" role="img" aria-label={`Heat level: ${LEVELS[level].label}`}>
            {LEVELS.map((l, i) => {
              const a0 = (-180 + i * 45) * (Math.PI / 180);
              const a1 = (-180 + (i + 1) * 45) * (Math.PI / 180);
              const R = 170;
              const r = 120;
              const p = (a: number, rad: number) => `${200 + Math.cos(a) * rad},${200 + Math.sin(a) * rad}`;
              return (
                <path
                  key={l.label}
                  d={`M${p(a0, R)} A${R},${R} 0 0 1 ${p(a1, R)} L${p(a1, r)} A${r},${r} 0 0 0 ${p(a0, r)} Z`}
                  fill={l.color}
                  opacity={i === level ? 1 : 0.28}
                  className="transition-opacity duration-300"
                />
              );
            })}
            <g ref={needle} data-cursor="Drag" className="cursor-grab">
              <path d="M200,200 L196,70 Q200,52 204,70 Z" fill="#1a1018" />
              <circle cx="200" cy="200" r="22" fill="#1a1018" />
              <circle cx="200" cy="200" r="9" fill="var(--heat)" />
              {/* A generous invisible handle for fingers. */}
              <rect x="170" y="40" width="60" height="170" fill="transparent" />
            </g>
          </svg>
          <div className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} data-flame className="absolute opacity-0">
                <ChilliIcon className="h-8 w-8" />
              </span>
            ))}
          </div>
          <div role="radiogroup" aria-label="Heat level" className="mt-2 grid grid-cols-4 gap-2">
            {LEVELS.map((l, i) => (
              <button
                key={l.label}
                type="button"
                role="radio"
                aria-checked={level === i}
                onClick={() => changeLevel(i)}
                className={cn(
                  "min-h-11 rounded-full text-sm font-semibold transition-colors",
                  level === i ? "bg-ink text-cream" : "bg-paper text-ink hover:bg-paper/70",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          {/* Every headline and hint is laid out invisibly in the same spot, so the
              block is always as tall as the longest one and the live text (which
              scrambles through other characters) can never push the page around. */}
          <h2 id="meter-title" className="display-lg relative grid overflow-hidden text-[color:var(--heat)] transition-colors">
            {LEVELS.map((l) => (
              <span key={l.label} aria-hidden="true" className="invisible col-start-1 row-start-1">
                {l.headline}
              </span>
            ))}
            <span data-meter-title className="absolute inset-0 [overflow-wrap:anywhere]">
              {LEVELS[1].headline}
            </span>
          </h2>
          <div className="mt-4 grid max-w-md text-lg text-muted">
            {LEVELS.map((l, i) => (
              <p key={l.label} aria-hidden={i !== level} className={cn("col-start-1 row-start-1", i !== level && "invisible")}>
                {l.hint}
              </p>
            ))}
          </div>
          <ul ref={list} className="mt-8 grid gap-3 sm:grid-cols-2" aria-live="polite">
            {shown.map((d) => (
              <li key={d.name} data-dish data-flip-id={d.name} className={cn(
                  "flex h-20 items-center justify-between gap-4 rounded-2xl px-5 transition-[background-color,opacity] duration-500",
                  d.heat === level ? "bg-paper" : "bg-paper/50 opacity-50",
                )}
              >
                <span className="min-w-0">
                  <span className="line-clamp-2 font-display leading-tight font-bold">{d.name}</span>
                  <span className="text-sm text-muted">₹{d.price}</span>
                </span>
                <span className="flex shrink-0" aria-label={`${d.heat + 1} of 4 chillies`}>
                  {Array.from({ length: d.heat + 1 }, (_, k) => (
                    <ChilliIcon key={k} className="-ml-1.5 h-6 w-6" />
                  ))}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-muted">Our own rough guide to the menu. Tell the kitchen if you want it milder or hotter.</p>
        </div>
      </div>
    </section>
  );
}
