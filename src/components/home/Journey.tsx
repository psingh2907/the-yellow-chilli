"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useRef } from "react";
import { ChilliMark, CHILLI_POD } from "@/components/ui/ChilliMark";
import { DishArt, specForDish } from "@/components/ui/DishArt";
import { journey } from "@/data/journey";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { formatLatLng, indiaPath, islandDots, MAP_VIEWBOX, project, smoothPath } from "@/lib/india";

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

const points = journey.map((s) => project(s.lonLat));
// One path per leg, so each leg can be drawn and travelled in its own slot.
const legs = points.slice(1).map((p, i) => {
  const [a, b] = [points[i], p];
  // A gentle arc between cities (control point pushed off the straight line).
  const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.18;
  const my = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.18;
  return `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`;
});
const fullRoute = smoothPath(points, false, 0.4);

/**
 * "The Chef's Journey". The section pins; each scroll step is one leg:
 *  - the leg draws itself (DrawSVG) and the chilli marker rides it (MotionPath),
 *  - the map pans and zooms toward the next city,
 *  - the dish card for that city slides in from the right,
 *  - a coordinate readout ticks from city to city (after Illoca's live X/Y),
 *    ending on the restaurant's own pin: 24.5765° N, 80.7830° E.
 */
export function Journey() {
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
        const pins = gsap.utils.toArray<SVGGElement>("[data-pin]");
        const readout = root.current!.querySelector<HTMLElement>("[data-readout]")!;
        const counter = root.current!.querySelector<HTMLElement>("[data-count]")!;
        const progressBar = root.current!.querySelector<HTMLElement>("[data-progress]")!;

        const { width: W, height: H } = MAP_VIEWBOX;
        const ZOOM = 1.9;
        // The map is drawn once at its zoomed size and the wrapper is only
        // *moved* (a composited translate), instead of scaling the SVG every
        // frame, which made the browser repaint the whole map each frame.
        let px2 = 1; // map units → CSS px at the zoomed size
        const size = () => {
          px2 = Math.min(viewport.clientWidth / W, viewport.clientHeight / H) * ZOOM;
          gsap.set(camera, { right: "auto", bottom: "auto", width: W * px2, height: H * px2 });
        };
        size();
        ScrollTrigger.addEventListener("refreshInit", size);
        // Stacked layout (phones, tablets): the title covers the top of the
        // map, so cities are centred lower down.
        const fy = () => (window.matchMedia("(min-width: 1024px)").matches ? 0.5 : 0.64);
        const focus = (i: number) => ({
          x: () => viewport.clientWidth / 2 - points[i][0] * px2,
          y: () => viewport.clientHeight * fy() - points[i][1] * px2,
        });

        gsap.set(legEls, { drawSVG: "0%" });
        gsap.set(cards.slice(1), { xPercent: 40, opacity: 0 });
        gsap.set(pins.slice(1), { scale: 0, transformOrigin: "50% 50%" });
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
            // No snap: with ScrollSmoother it pulled the page back to the top,
            // and snapping after the visitor stops reads as the page jumping.
            scrub: 0.9,
          },
          defaults: { ease: "none" },
        });

        const pos = { t: 0 };
        legEls.forEach((leg, i) => {
          const from = journey[i].lonLat;
          const to = journey[i + 1].lonLat;
          tl.addLabel(`leg${i}`)
            .to(leg, { drawSVG: "100%", duration: 1 }, `leg${i}`)
            .to(marker, { duration: 1, motionPath: { path: leg, align: leg, alignOrigin: [0.5, 0.5] } }, `leg${i}`)
            .to(camera, { ...focus(i + 1), duration: 1, ease: "power1.inOut" }, `leg${i}`)
            .fromTo(
              pos,
              { t: 0 },
              {
                t: 1,
                duration: 1,
                onUpdate: () => {
                  const lng = gsap.utils.interpolate(from[0], to[0], pos.t);
                  const lat = gsap.utils.interpolate(from[1], to[1], pos.t);
                  readout.textContent = formatLatLng(lat, lng);
                },
              },
              `leg${i}`,
            )
            // A quick hand-off, so stopping mid-leg never leaves two cards overlapping.
            .to(cards[i], { xPercent: -40, opacity: 0, duration: 0.25, ease: "power2.in" }, `leg${i}+=0.2`)
            .to(cards[i + 1], { xPercent: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, `leg${i}+=0.45`)
            .to(pins[i + 1], { scale: 1, duration: 0.3, ease: "back.out(3)" }, `leg${i}+=0.85`)
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

  const last = journey[journey.length - 1];
  return (
    <section ref={root} id="journey" aria-labelledby="journey-title" className="grain relative overflow-hidden bg-night text-cream">
      <div className="relative grid min-h-svh grid-rows-[auto_1fr] lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-1">
        {/* Map */}
        <div className="relative h-[52svh] overflow-hidden lg:h-svh">
          <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-night via-night/70 to-transparent px-4 pt-24 pb-10 sm:px-8 lg:px-12 lg:pt-28">
            <p className="label text-saffron">The Chef&rsquo;s Journey</p>
            <h2 id="journey-title" className="mt-2 max-w-md font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1] font-extrabold tracking-tight">
              One menu. Nine stops. Ends at your table.
            </h2>
          </div>
          <div data-camera className="absolute inset-0 will-change-transform">
          <svg viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} className="h-full w-full" role="img" aria-label="Stylised map of India with a route from Srinagar through Amritsar, Ambala, Delhi, Jaipur, Lucknow, Kolkata and Hyderabad to Satna">
            <g data-map>
              <path d={indiaPath} fill="#151a30" stroke="#f4a521" strokeOpacity="0.35" strokeWidth="1.5" />
              {islandDots.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#151a30" stroke="#f4a521" strokeOpacity="0.35" />
              ))}
              {/* Faint full route, then the legs drawn over it. */}
              <path d={fullRoute} fill="none" stroke="#f4a521" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="2 6" />
              {legs.map((d, i) => (
                <path key={i} data-leg d={d} fill="none" stroke="#f4a521" strokeWidth="3" strokeLinecap="round" />
              ))}
              {journey.map((s, i) => {
                const [x, y] = points[i];
                const home = s.id === "satna";
                return (
                  <g key={s.id} data-pin transform={`translate(${x} ${y})`}>
                    <circle r={home ? 9 : 5} fill={home ? "#e0392b" : "#f4a521"} />
                    {home && <circle r="16" fill="none" stroke="#e0392b" strokeWidth="2" opacity="0.6" />}
                    <text x="10" y="-8" fill="#fbf3e4" fontSize="13" fontWeight="600" className="font-sans">
                      {s.city}
                    </text>
                  </g>
                );
              })}
              <g data-marker>
                <g transform="translate(-14 -14) scale(0.44)">
                  <path d={CHILLI_POD} fill="#f4a521" stroke="#0d1020" strokeWidth="2" />
                </g>
              </g>
            </g>
          </svg>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 bg-gradient-to-t from-night to-transparent px-4 pt-10 pb-4 sm:px-8 lg:px-12 lg:pb-10">
            <p className="font-mono text-xs text-saffron/90 tabular-nums" aria-hidden="true">
              <span data-readout>{formatLatLng(journey[0].lonLat[1], journey[0].lonLat[0])}</span>
            </p>
            <p className="label text-mist" aria-hidden="true">
              <span data-count className="text-cream">
                01
              </span>{" "}
              / {String(journey.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Dish cards */}
        <div className="relative flex items-center overflow-hidden px-4 pb-24 sm:px-8 lg:h-svh lg:px-12 lg:pb-0">
          <ol className="grid w-full motion-safe:[&>*]:col-start-1 motion-safe:[&>*]:row-start-1 motion-reduce:gap-10">
            {journey.map((s, i) => (
              <li key={s.id} data-card className="w-full">
                {s.id === "satna" ? (
                  <div className="rounded-3xl bg-saffron p-6 text-night md:p-10">
                    <ChilliMark className="h-16 w-16" />
                    <p className="label mt-6">Stop 09 · {s.region}</p>
                    <h3 className="mt-2 font-display text-[clamp(2.2rem,4.6vw,4rem)] leading-[0.95] font-extrabold">Satna. Your table.</h3>
                    <p className="mt-4 max-w-sm text-night/80">{last.line}</p>
                    <p className="mt-6 font-mono text-sm">{formatLatLng(24.576493, 80.783028)}</p>
                  </div>
                ) : (
                  <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] lg:grid-cols-1 xl:grid-cols-[auto_1fr]">
                    <DishArt spec={specForDish(s.dish, s.tone, i + 2)} className="w-40 sm:w-48 lg:w-56" />
                    <div>
                      <p className="label text-saffron">
                        Stop {String(i + 1).padStart(2, "0")} · {s.city}, {s.region}
                      </p>
                      <h3 className="mt-2 font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1] font-extrabold">{s.dish}</h3>
                      <p className="mt-3 max-w-md text-mist">{s.line}</p>
                      <p className="mt-4 font-display text-lg font-semibold text-saffron">₹{s.price}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-night-line">
        <div data-progress className="h-full origin-left bg-saffron" />
      </div>
    </section>
  );
}
