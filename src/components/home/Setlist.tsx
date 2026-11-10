"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useRef } from "react";
import { DishArt } from "@/components/ui/DishArt";
import { MicGlyph, MicMark } from "@/components/ui/Mark";
import { RecordArt } from "@/components/ui/RecordArt";
import { setlist } from "@/data/setlist";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { formatTime } from "@/lib/hours";

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

// The staff: five lines, one note per stop, climbing toward the music.
const W = 1800;
const H = 520;
const STAFF = [180, 220, 260, 300, 340];
const NOTE_Y = [320, 260, 300, 220, 160, 280];
const points: Array<[number, number]> = setlist.map((_, i) => [170 + i * 292, NOTE_Y[i]]);
// One path per leg, so each leg can be drawn and travelled in its own slot.
const legs = points.slice(1).map(([bx, by], i) => {
  const [ax, ay] = points[i];
  const mx = (ax + bx) / 2;
  const my = Math.min(ay, by) - 90;
  return `M${ax},${ay} Q${mx},${my} ${bx},${by}`;
});

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const clock = (mins: number) => {
  const m = Math.round(mins);
  return formatTime(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`);
};

/**
 * "The Setlist": a day at Veerji's as a line of music. The section pins;
 * each scroll step is one leg:
 *  - the phrase between two notes draws itself (DrawSVG) and the mic
 *    marker rides it (MotionPath),
 *  - the staff pans to the next note,
 *  - the card for that hour slides in from the right,
 *  - a clock readout ticks through the day, ending at 11 pm.
 */
export function Setlist() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const camera = root.current!.querySelector<HTMLElement>("[data-camera]")!;
        const viewport = camera.parentElement!;
        const marker = root.current!.querySelector<SVGGElement>("[data-marker]")!;
        const legEls = gsap.utils.toArray<SVGPathElement>("[data-leg]");
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        const notes = gsap.utils.toArray<SVGGElement>("[data-note]");
        const readout = root.current!.querySelector<HTMLElement>("[data-readout]")!;
        const counter = root.current!.querySelector<HTMLElement>("[data-count]")!;
        const progressBar = root.current!.querySelector<HTMLElement>("[data-progress]")!;

        const ZOOM = 2.4;
        // The staff is drawn once at its zoomed size and the wrapper is only
        // *moved* (a composited translate), never scaled per frame.
        let px = 1;
        const size = () => {
          px = Math.min(viewport.clientWidth / W, viewport.clientHeight / H) * ZOOM;
          gsap.set(camera, { right: "auto", bottom: "auto", width: W * px, height: H * px });
        };
        size();
        ScrollTrigger.addEventListener("refreshInit", size);
        // Stacked layout (phones, tablets): the title covers the top, so notes sit lower.
        const fy = () => (window.matchMedia("(min-width: 1024px)").matches ? 0.5 : 0.62);
        const focus = (i: number) => ({
          x: () => viewport.clientWidth / 2 - points[i][0] * px,
          y: () => viewport.clientHeight * fy() - points[i][1] * px,
        });

        gsap.set(legEls, { drawSVG: "0%" });
        gsap.set(cards.slice(1), { xPercent: 40, opacity: 0 });
        gsap.set(notes.slice(1), { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(camera, focus(0));
        gsap.set(marker, { x: points[0][0], y: points[0][1] });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: `+=${legEls.length * 75}%`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            scrub: 0.9,
          },
          defaults: { ease: "none" },
        });

        const pos = { t: 0 };
        legEls.forEach((leg, i) => {
          const from = minutes(setlist[i].time);
          const to = minutes(setlist[i + 1].time);
          tl.addLabel(`leg${i}`)
            .to(leg, { drawSVG: "100%", duration: 1 }, `leg${i}`)
            .to(marker, { duration: 1, motionPath: { path: leg, align: leg, alignOrigin: [0.5, 0.5] } }, `leg${i}`)
            .to(camera, { ...focus(i + 1), duration: 1, ease: "power1.inOut" }, `leg${i}`)
            .fromTo(
              pos,
              { t: 0 },
              { t: 1, duration: 1, onUpdate: () => (readout.textContent = clock(gsap.utils.interpolate(from, to, pos.t))) },
              `leg${i}`,
            )
            // A quick hand-off, so stopping mid-leg never leaves two cards overlapping.
            .to(cards[i], { xPercent: -40, opacity: 0, duration: 0.25, ease: "power2.in" }, `leg${i}+=0.2`)
            .to(cards[i + 1], { xPercent: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, `leg${i}+=0.45`)
            .to(notes[i + 1], { scale: 1, duration: 0.3, ease: "back.out(3)" }, `leg${i}+=0.85`)
            .call(() => (counter.textContent = String(i + 2).padStart(2, "0")), [], `leg${i}+=0.5`)
            .call(() => (counter.textContent = String(i + 1).padStart(2, "0")), [], `leg${i}+=0.49`);
        });
        tl.fromTo(progressBar, { scaleX: 0 }, { scaleX: 1, duration: tl.duration(), transformOrigin: "0 50%" }, 0);
        return () => ScrollTrigger.removeEventListener("refreshInit", size);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="setlist" aria-labelledby="setlist-title" className="grain relative overflow-hidden bg-night text-cream">
      <div className="relative grid min-h-svh grid-rows-[auto_1fr] lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-1">
        {/* Staff */}
        <div className="relative h-[52svh] overflow-hidden lg:h-svh">
          <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-night via-night/70 to-transparent px-4 pt-24 pb-10 sm:px-8 lg:px-12 lg:pt-28">
            <p className="label text-gold">The Setlist</p>
            <h2 id="setlist-title" className="mt-2 max-w-md font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1] font-extrabold tracking-tight">
              Eleven to eleven. Six songs a day.
            </h2>
          </div>
          <div data-camera className="absolute inset-0 will-change-transform">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="A line of music with six notes, one for each part of the day at Veerji's, from 11 am to 11 pm">
              {STAFF.map((y) => (
                <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#f2b544" strokeOpacity="0.22" strokeWidth="2" />
              ))}
              {/* Bar lines between the hours. */}
              {points.slice(1).map(([x], i) => (
                <line key={i} x1={x - 146} x2={x - 146} y1={STAFF[0]} y2={STAFF[4]} stroke="#f2b544" strokeOpacity="0.16" strokeWidth="2" />
              ))}
              {legs.map((d, i) => (
                <path key={i} data-leg d={d} fill="none" stroke="#f2b544" strokeWidth="4" strokeLinecap="round" />
              ))}
              {setlist.map((s, i) => {
                const [x, y] = points[i];
                const live = s.id === "live";
                return (
                  <g key={s.id} data-note transform={`translate(${x} ${y})`}>
                    {live && <circle r="34" fill="#ff4d7d" opacity="0.18" />}
                    <ellipse rx="17" ry="12" transform="rotate(-22)" fill={live ? "#ff4d7d" : "#f2b544"} />
                    <line x1="15" x2="15" y1="-4" y2="-78" stroke={live ? "#ff4d7d" : "#f2b544"} strokeWidth="4" />
                    <text x="0" y="56" textAnchor="middle" fill="#fbf3e8" fontSize="22" fontWeight="700" className="font-sans">
                      {formatTime(s.time)}
                    </text>
                  </g>
                );
              })}
              <g data-marker>
                <g transform="translate(-24 -30) scale(0.75)">
                  <MicGlyph />
                </g>
              </g>
            </svg>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-night to-transparent px-4 pt-10 pb-4 sm:px-8 lg:px-12 lg:pb-10">
            <p className="font-mono text-xs text-gold/90 uppercase tabular-nums" aria-hidden="true">
              <span data-readout>{formatTime(setlist[0].time)}</span>
            </p>
            <p className="label text-mist" aria-hidden="true">
              <span data-count className="text-cream">
                01
              </span>{" "}
              / {String(setlist.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="relative flex items-center overflow-hidden px-4 pb-24 sm:px-8 lg:h-svh lg:px-12 lg:pb-0">
          <ol className="grid w-full motion-safe:[&>*]:col-start-1 motion-safe:[&>*]:row-start-1 motion-reduce:gap-10">
            {setlist.map((s, i) => (
              <li key={s.id} data-card className="w-full">
                {s.art === "finale" ? (
                  <div className="rounded-3xl bg-gold p-6 text-night md:p-10">
                    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-night">
                      <MicMark className="h-11 w-11" />
                    </span>
                    <p className="label mt-6">
                      {String(i + 1).padStart(2, "0")} · {formatTime(s.time)}
                    </p>
                    <h3 className="mt-2 font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[0.95] font-extrabold">{s.title}.</h3>
                    <p className="mt-4 max-w-sm text-night/80">{s.line}</p>
                  </div>
                ) : (
                  <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] lg:grid-cols-1 xl:grid-cols-[auto_1fr]">
                    {s.art === "record" ? (
                      <RecordArt className="w-40 motion-safe:animate-[spin_6s_linear_infinite] sm:w-48 lg:w-56" />
                    ) : (
                      <DishArt spec={s.art} className="w-40 sm:w-48 lg:w-56" />
                    )}
                    <div>
                      <p className="label text-gold">
                        {String(i + 1).padStart(2, "0")} · {formatTime(s.time)}
                        {s.id === "live" && " · evenings"}
                      </p>
                      <h3 className="mt-2 font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1] font-extrabold">{s.title}</h3>
                      <p className="mt-3 max-w-md text-mist">{s.line}</p>
                      {s.picks.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {s.picks.map((p) => (
                            <li key={p.name} className="rounded-full bg-night-soft px-4 py-2 text-sm">
                              {p.name} <span className="font-semibold text-gold">₹{p.price}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-night-line">
        <div data-progress className="h-full origin-left bg-gold" />
      </div>
    </section>
  );
}
