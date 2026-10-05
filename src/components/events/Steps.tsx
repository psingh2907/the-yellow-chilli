"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(DrawSVGPlugin);

const STEPS = [
  { n: "01", title: "Tell us the date", text: "Call or WhatsApp with the occasion, the date and roughly how many guests." },
  { n: "02", title: "Pick the menu", text: "Choose starters, mains, breads and desserts from the full menu, veg or veg and non-veg." },
  { n: "03", title: "Arrive and celebrate", text: "The hall is ready, the tandoor is hot, and there's parking for everyone." },
];

/** Three steps joined by a hand-drawn line that draws as you scroll (DrawSVG, scrubbed). */
export function Steps() {
  const root = useRef<HTMLOListElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-step-line]", {
          drawSVG: "0%",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
        });
        gsap.from("[data-step]", {
          opacity: 0,
          y: 40,
          stagger: 0.25,
          ease: "chilli",
          scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative grid gap-10 md:grid-cols-3">
      <svg aria-hidden="true" viewBox="0 0 1000 60" preserveAspectRatio="none" className="absolute top-6 left-0 hidden h-12 w-full md:block">
        <path data-step-line d="M40,30 C200,-10 300,70 500,30 C700,-10 800,70 960,30" fill="none" stroke="#f4a521" strokeWidth="3" strokeDasharray="1 0" />
      </svg>
      {STEPS.map((s) => (
        <li key={s.n} data-step className="relative">
          <span className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-saffron font-display text-lg font-extrabold text-night">{s.n}</span>
          <h3 className="mt-5 font-display text-2xl font-bold">{s.title}</h3>
          <p className="mt-2 text-mist">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
