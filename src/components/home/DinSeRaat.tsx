"use client";

import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useRef } from "react";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { RecordArt } from "@/components/ui/RecordArt";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { hoursText } from "@/lib/hours";

gsap.registerPlugin(MorphSVGPlugin, MotionPathPlugin);

const SUN = "M50,20 C66.6,20 80,33.4 80,50 C80,66.6 66.6,80 50,80 C33.4,80 20,66.6 20,50 C20,33.4 33.4,20 50,20 Z";
const MOON = "M50,20 C66.6,20 80,33.4 80,50 C80,66.6 66.6,80 50,80 C61,72 66,62 66,50 C66,38 61,28 50,20 Z";
const ARC = "M-40,560 C180,40 820,40 1040,560";

/** Sky colours, bottom → top: day → dusk → night. */
const SKY = [
  ["#e89a5a", "#b0645a", "#3d4f8f"],
  ["#ff9a3c", "#c2452d", "#3b1a3f"],
  ["#2b0d22", "#140a18", "#07040a"],
];

/**
 * "Din se Raat": Veerji's is a cafe by day and a club by night. The section
 * pins and scrolls a day: the sky shifts day → dusk → night, the sun sets
 * along its arc (MotionPath), comes back up as the moon (MorphSVG), stars
 * and club lights fade in, the copy swaps lines to match the hour, and the
 * record keeps turning.
 */
export function DinSeRaat() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const title = SplitText.create("[data-ss-title]", { type: "words,chars" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=220%", pin: true, anticipatePin: 1, scrub: 1 },
        });
        gsap.from(title.chars, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.04,
          duration: 1,
          ease: "groove",
          scrollTrigger: { trigger: root.current, start: "top 60%", toggleActions: "play none none reverse" },
        });
        tl.to("[data-orb]", { duration: 1.6, motionPath: { path: ARC, align: "[data-arc]", alignOrigin: [0.5, 0.5], start: 0.55, end: 1 } }, 0)
          // The sky crossfades between stacked gradient layers (opacity is
          // composited; tweening the gradient itself repaints every frame).
          .to('[data-sky="1"]', { opacity: 1, duration: 1.1 }, 0.3)
          .to("[data-line-day]", { opacity: 0, y: -20, duration: 0.3 }, 0.8)
          .fromTo("[data-line-dusk]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.95)
          .to("[data-orb-shape]", { morphSVG: MOON, fill: "#fbf3e8", duration: 0.3 }, 1.6)
          .to("[data-orb]", { duration: 1.2, motionPath: { path: ARC, align: "[data-arc]", alignOrigin: [0.5, 0.5], start: 0, end: 0.3 } }, 1.7)
          .to('[data-sky="2"]', { opacity: 1, duration: 1 }, 1.6)
          .to("[data-stars]", { opacity: 1, duration: 0.6 }, 1.9)
          .to("[data-neon]", { opacity: 1, duration: 0.8 }, 2.1)
          .to("[data-line-dusk]", { opacity: 0, y: -20, duration: 0.3 }, 2)
          .fromTo("[data-line-night]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 2.15)
          .to("[data-dish-spin]", { rotate: 720, duration: 3 }, 0);
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
      {/* Keeps the copy readable over the brightest sky. */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,10,24,0.55),transparent_65%)]" />
      <div data-neon aria-hidden="true" className="absolute inset-0 opacity-0 will-change-[opacity] bg-[radial-gradient(40%_50%_at_20%_100%,rgba(255,77,125,0.45),transparent_70%),radial-gradient(35%_45%_at_85%_95%,rgba(155,123,255,0.4),transparent_70%),radial-gradient(25%_60%_at_55%_0%,rgba(242,181,68,0.18),transparent_70%)]" />
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
        <g data-orb transform="translate(564 174)">
          <g transform="translate(-50 -50)">
            <circle cx="50" cy="50" r="48" fill="#ffd98a" opacity="0.18" />
            <path data-orb-shape d={SUN} fill="#ffd98a" />
          </g>
        </g>
        {/* Satna's horizon: the low Vindhya hills. */}
        <path d="M0,520 C120,480 220,500 320,470 C430,440 520,490 640,460 C760,430 860,480 1000,450 L1000,600 L0,600 Z" fill="#140a18" opacity="0.85" />
      </svg>

      <div className="relative z-10 container-x grid min-h-svh items-center gap-10 py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="label text-cream/80">Cafe by day · Club by night</p>
          <h2 id="ss-title" data-ss-title className="display-xl mt-3">
            Din se Raat
          </h2>
          <p className="mt-2 font-deva text-3xl text-cream/80" lang="hi">
            दिन से रात · day into night
          </p>
          <div className="relative mt-8 min-h-[7.5rem] max-w-lg text-lg leading-relaxed md:text-xl">
            <p data-line-day className="motion-safe:absolute motion-safe:inset-0">
              By day it&rsquo;s a calm cafe: cold coffee, a sandwich, free Wi-Fi and a corner to yourself for as long as you like.
            </p>
            <p data-line-dusk className="motion-safe:absolute motion-safe:inset-0 motion-safe:opacity-0">
              By evening the tables fill up with families, thalis and the first birthday balloons.
            </p>
            <p data-line-night className="motion-safe:absolute motion-safe:inset-0 motion-safe:opacity-0">
              Then the lights drop, the music comes up, and the room turns into a club.
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
            <RecordArt label="A Veerji's record, turning" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
