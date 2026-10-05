"use client";

import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useRef } from "react";
import { DishArt } from "@/components/ui/DishArt";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { hoursText } from "@/lib/hours";

gsap.registerPlugin(MorphSVGPlugin, MotionPathPlugin);

const SUN = "M50,20 C66.6,20 80,33.4 80,50 C80,66.6 66.6,80 50,80 C33.4,80 20,66.6 20,50 C20,33.4 33.4,20 50,20 Z";
const MOON = "M50,20 C66.6,20 80,33.4 80,50 C80,66.6 66.6,80 50,80 C61,72 66,62 66,50 C66,38 61,28 50,20 Z";
const ARC = "M-40,560 C180,40 820,40 1040,560";

/** Sky colours: dusk → night → dawn. */
const SKY = [
  ["#ff9a3c", "#c2452d", "#3b1a3f"],
  ["#141a3a", "#0d1020", "#05060d"],
  ["#ffd27a", "#f39a8a", "#6d6ab8"],
];

/**
 * "Shaam Savera": evening and morning on one plate. The section pins and
 * scrolls a day: the sky shifts dusk → night → dawn, the sun travels its arc
 * (MotionPath) and morphs into a moon and back (MorphSVG), stars fade in
 * and out, and the dish copy swaps lines to match the hour.
 */
export function ShaamSavera() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = SplitText.create("[data-ss-title]", { type: "chars" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", pin: true, anticipatePin: 1, scrub: 1 },
        });
        gsap.from(title.chars, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.04,
          duration: 1,
          ease: "chilli",
          scrollTrigger: { trigger: root.current, start: "top 60%", toggleActions: "play none none reverse" },
        });
        tl.to("[data-orb]", { duration: 3, motionPath: { path: ARC, align: "[data-arc]", alignOrigin: [0.5, 0.5] } }, 0)
          // The sky crossfades between stacked gradient layers (opacity is
          // composited; tweening the gradient itself repaints every frame).
          .to('[data-sky="1"]', { opacity: 1, duration: 1.2 }, 0.2)
          .to("[data-orb-shape]", { morphSVG: MOON, fill: "#fbf3e4", duration: 0.6 }, 0.7)
          .to("[data-stars]", { opacity: 1, duration: 0.6 }, 0.8)
          .to("[data-line-dusk]", { opacity: 0, y: -20, duration: 0.3 }, 1)
          .fromTo("[data-line-night]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 1.15)
          .to("[data-line-night]", { opacity: 0, y: -20, duration: 0.3 }, 2)
          .to('[data-sky="2"]', { opacity: 1, duration: 1.2 }, 1.7)
          .to("[data-stars]", { opacity: 0, duration: 0.6 }, 1.9)
          .to("[data-orb-shape]", { morphSVG: SUN, fill: "#ffd27a", duration: 0.6 }, 2.1)
          .fromTo("[data-line-dawn]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 2.2)
          .to("[data-dish-spin]", { rotate: 300, duration: 3 }, 0);
        return () => title.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="ss-title" className="relative min-h-svh overflow-hidden text-cream">
      {SKY.map((c, i) => (
        <div
          key={i}
          data-sky={i}
          aria-hidden="true"
          className={i === 0 ? "absolute inset-0" : "absolute inset-0 opacity-0 will-change-[opacity]"}
          style={{ background: `linear-gradient(180deg, ${c[2]} 0%, ${c[1]} 55%, ${c[0]} 100%)` }}
        />
      ))}
      <div data-stars aria-hidden="true" className="absolute inset-0 opacity-0 will-change-[opacity]">
        {Array.from({ length: 60 }, (_, i) => (
          <span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-cream"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 60}%`, opacity: 0.3 + ((i * 7) % 10) / 14 }}
          />
        ))}
      </div>
      <svg aria-hidden="true" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <path data-arc d={ARC} fill="none" stroke="#fff" strokeOpacity="0.12" strokeDasharray="4 10" />
        <g data-orb transform="translate(-40 560)">
          <g transform="translate(-50 -50)">
            <circle cx="50" cy="50" r="48" fill="#ffd27a" opacity="0.18" />
            <path data-orb-shape d={SUN} fill="#ffd27a" />
          </g>
        </g>
        {/* Satna's skyline-ish horizon: low hills of Vindhya. */}
        <path d="M0,520 C120,480 220,500 320,470 C430,440 520,490 640,460 C760,430 860,480 1000,450 L1000,600 L0,600 Z" fill="#0d1020" opacity="0.85" />
      </svg>

      <div className="relative z-10 container-x grid min-h-svh items-center gap-10 py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="label text-cream/80">Signature · Veg mains · ₹485</p>
          <h2 id="ss-title" data-ss-title className="display-xl mt-3">
            Shaam Savera
          </h2>
          <p className="mt-2 font-deva text-3xl text-cream/80" lang="hi">
            शाम सवेरा · evening &amp; morning
          </p>
          <div className="relative mt-8 min-h-[7.5rem] max-w-lg text-lg leading-relaxed md:text-xl">
            <p data-line-dusk className="motion-safe:absolute motion-safe:inset-0">
              Spinach koftas, deep green like the last of the evening, each hiding a soft paneer heart.
            </p>
            <p data-line-night className="motion-safe:absolute motion-safe:inset-0 motion-safe:opacity-0">
              Simmered in a silky makhani gravy, the colour of the sky after sunset.
            </p>
            <p data-line-dawn className="motion-safe:absolute motion-safe:inset-0 motion-safe:opacity-0">
              Dusk and dawn on one plate. And we&rsquo;re here for both: lunch to late, every day.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4 rounded-full bg-night/60 px-5 py-3 text-sm sm:w-fit">
            <OpenStatus />
            <span className="text-cream/60">·</span>
            <span>Daily {hoursText}</span>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[26rem]">
          <div data-dish-spin className="will-change-transform">
            <DishArt spec={{ kind: "kofta", tone: "#d2632a", seed: 11 }} label="Illustration of Shaam Savera: spinach koftas in makhani gravy" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
