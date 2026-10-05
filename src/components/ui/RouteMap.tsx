"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useRef } from "react";
import { business } from "@/data/business";
import { gsap, useGSAP } from "@/lib/gsap";
import { ChilliMark } from "./ChilliMark";

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin);

// A stylised drive, not to scale: station (bottom left) to the restaurant (top right).
const ROAD = "M80,330 C170,330 200,250 290,240 C380,230 400,300 480,280 C560,260 560,170 640,150 C700,135 740,120 800,90";
const STOPS = [
  { x: 80, y: 330, label: "Satna Railway Station", anchor: "start" as const, dy: 34 },
  { x: 480, y: 280, label: "Panna Naka", anchor: "middle" as const, dy: 34 },
  { x: 640, y: 150, label: "Peptech City", anchor: "end" as const, dy: -18 },
];

/**
 * "4.5 km from the station": the road draws itself as it scrolls into view
 * (DrawSVG, scrubbed), and a car drives along it (MotionPath), arriving
 * at the chilli pin.
 */
export function RouteMap({ className }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 45%", scrub: 0.8 } });
        tl.from("[data-road]", { drawSVG: "0%", ease: "none", duration: 1 })
          .to("[data-car]", { motionPath: { path: "[data-road]", align: "[data-road]", alignOrigin: [0.5, 0.5], autoRotate: true }, ease: "none", duration: 1 }, 0)
          .from("[data-stop]", { scale: 0, transformOrigin: "50% 50%", stagger: 0.3, duration: 0.2, ease: "back.out(3)" }, 0.05)
          .from("[data-pin]", { y: -60, opacity: 0, duration: 0.25, ease: "bounce.out" }, 0.8);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <svg viewBox="0 0 880 400" className="w-full" role="img" aria-label={`Route from Satna Railway Station past Panna Naka and Peptech City to The Yellow Chilli on NH-75, about ${business.distances.stationKm} km`}>
        <path d={ROAD} fill="none" stroke="#262c48" strokeWidth="22" strokeLinecap="round" />
        <path data-road d={ROAD} fill="none" stroke="#f4a521" strokeWidth="6" strokeLinecap="round" />
        <path d={ROAD} fill="none" stroke="#0d1020" strokeWidth="1.5" strokeDasharray="10 14" opacity="0.6" />
        {STOPS.map((s) => (
          <g key={s.label}>
            <circle data-stop cx={s.x} cy={s.y} r="9" fill="#fbf3e4" stroke="#0d1020" strokeWidth="3" />
            <text x={s.x} y={s.y + s.dy} textAnchor={s.anchor} fill="#a7accb" fontSize="20" fontWeight="600">
              {s.label}
            </text>
          </g>
        ))}
        <g data-pin transform="translate(800 90)">
          <circle r="34" fill="#e0392b" opacity="0.2" />
          <foreignObject x="-26" y="-34" width="52" height="52">
            <ChilliMark className="h-full w-full" />
          </foreignObject>
          <text x="0" y="52" textAnchor="middle" fill="#fbf3e4" fontSize="20" fontWeight="700">
            The Yellow Chilli
          </text>
        </g>
        <g data-car transform="translate(80 330)">
          <rect x="-18" y="-10" width="36" height="20" rx="7" fill="#e0392b" />
          <rect x="2" y="-7" width="10" height="14" rx="3" fill="#fbf3e4" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}
