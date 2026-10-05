"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";
import { DishArt } from "@/components/ui/DishArt";
import { gsap, playWhileVisible, SplitText, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(DrawSVGPlugin);

const CHAPTERS = [
  {
    deva: "चुनना",
    latin: "Chunna",
    english: "Choose",
    poem: ["Whole spices, picked by hand.", "A pinch of hing.", "Nothing that doesn't belong."],
    body: "Every Yellow Chilli dish began as a recipe Master Chef Sanjeev Kapoor found on the road: a dhaba in Punjab, a Nawab's kitchen in Lucknow, a home in Kashmir. The Satna kitchen cooks from those recipes.",
    dish: { kind: "curry" as const, tone: "#c9581f", seed: 3 },
    bg: "#0d1020",
  },
  {
    deva: "पकाना",
    latin: "Pakana",
    english: "Cook",
    poem: ["The tandoor at full heat.", "The dal on a slow flame.", "The biryani sealed, and left alone."],
    body: "Some things can't be rushed: black dal that simmers for hours, biryani cooked on dum under a dough seal, kebabs that wait for the charcoal to be just right.",
    dish: { kind: "dal" as const, tone: "#4a2416", seed: 5 },
    bg: "#3a0f0b",
  },
  {
    deva: "परोसना",
    latin: "Parosna",
    english: "Serve",
    poem: ["A family table.", "A birthday. A banquet.", "Then, Gulab-e-Gulkand."],
    body: "Dine in on NH-75 with free parking at the door, book the banquet hall for a celebration, or order to your home across Satna.",
    dish: { kind: "dessert" as const, tone: "#f3e6c8", seed: 9 },
    bg: "#0f1a14",
  },
];

/**
 * Three chapters, one verb each (after Millemann Wines' "Choisir · Maîtriser
 * · Partager"). The section pins; scrolling plays one chapter after another:
 * the Latin letters flip up one by one, the Devanagari word slides in, the
 * poem's lines rise out of masks, steam draws itself over the dish, and the
 * background changes colour (night → ember → leaf).
 */
export function Verbs() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)" },
        () => {
          const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
          const splits = chapters.map((ch) => ({
            letters: SplitText.create(ch.querySelector("[data-latin]"), { type: "chars" }),
            poem: SplitText.create(ch.querySelectorAll("[data-poem]"), { type: "lines", mask: "lines", linesClass: "split-mask" }),
          }));
          gsap.set(chapters.slice(1), { autoAlpha: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "chilli" },
            scrollTrigger: { trigger: root.current, start: "top top", end: `+=${chapters.length * 110}%`, pin: true, anticipatePin: 1, scrub: 0.8 },
          });

          chapters.forEach((ch, i) => {
            const { letters, poem } = splits[i];
            const at = i * 3;
            if (i > 0) {
              tl.to(chapters[i - 1], { autoAlpha: 0, yPercent: -6, duration: 0.6 }, at - 0.6)
                // Crossfade colour layers (opacity is composited; animating
                // background-color would repaint the whole screen every frame).
                .to(`[data-bg="${i}"]`, { opacity: 1, duration: 1, ease: "none" }, at - 0.8)
                .set(ch, { autoAlpha: 1 }, at);
            }
            tl.from(letters.chars, { rotateX: -100, yPercent: 60, opacity: 0, transformOrigin: "50% 100%", stagger: 0.08, duration: 0.8 }, at)
              .from(ch.querySelector("[data-deva]"), { xPercent: -30, opacity: 0, duration: 1 }, at)
              .from(poem.lines, { yPercent: 110, stagger: 0.18, duration: 0.8 }, at + 0.3)
              .from(ch.querySelector("[data-body]"), { opacity: 0, y: 30, duration: 0.8 }, at + 0.8)
              .from(ch.querySelector("[data-dish]"), { scale: 0.6, rotate: -40, opacity: 0, duration: 1.2 }, at + 0.2)
              .fromTo(ch.querySelectorAll("[data-steam]"), { drawSVG: "0% 0%" }, { drawSVG: "30% 100%", stagger: 0.15, duration: 1.4, ease: "none" }, at + 0.6);
            // Hold the finished chapter on screen for a beat.
            tl.to({}, { duration: 0.8 });
          });
          return () => splits.forEach((s) => (s.letters.revert(), s.poem.revert()));
        },
        root,
      );
      // The steam keeps rising gently, only while the section is on screen.
      playWhileVisible(root.current, [gsap.to("[data-steam-group]", { y: -14, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1 })]);
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="How we cook" className="grain relative min-h-svh overflow-hidden bg-night text-cream">
      {CHAPTERS.slice(1).map((c, k) => (
        <div key={c.bg} data-bg={k + 1} aria-hidden="true" className="absolute inset-0 opacity-0 will-change-[opacity]" style={{ backgroundColor: c.bg }} />
      ))}
      <div className="relative min-h-svh">
        {CHAPTERS.map((c, i) => (
          <article
            key={c.latin}
            data-chapter
            className="container-x grid min-h-svh grid-cols-1 content-center items-center gap-8 py-24 motion-safe:absolute motion-safe:inset-0 lg:grid-cols-[auto_1fr_0.9fr] lg:gap-14"
          >
            {/* The vertical letter stack (C · H · U · N · N · A). */}
            <p
              data-latin
              aria-label={c.latin}
              className="hidden font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[0.92] font-extrabold text-saffron uppercase [perspective:600px] lg:flex lg:flex-col"
            >
              {c.latin}
            </p>
            <div>
              <p className="label text-saffron">
                0{i + 1} · {c.english}
              </p>
              <h2 data-deva lang="hi" className="mt-3 font-deva text-[clamp(4rem,13vw,10rem)] leading-[1.05] text-cream">
                {c.deva}
              </h2>
              <div className="mt-4 space-y-1 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight font-semibold text-cream/90">
                {c.poem.map((line) => (
                  <p key={line} data-poem>
                    {line}
                  </p>
                ))}
              </div>
              <p data-body className="mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg">
                {c.body}
              </p>
            </div>
            <div className="relative mx-auto w-full max-w-[22rem] lg:max-w-[28rem]">
              <svg data-steam-group viewBox="0 0 200 120" aria-hidden="true" className="absolute -top-[22%] left-0 w-full">
                {[60, 100, 140].map((x, k) => (
                  <path
                    key={x}
                    data-steam
                    d={`M${x},118 C${x - 22},92 ${x + 22},70 ${x},46 C${x - 20},26 ${x + 16},12 ${x + 4 * (k - 1)},0`}
                    fill="none"
                    stroke="#fbf3e4"
                    strokeOpacity="0.35"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              <div data-dish className="will-change-transform">
                <DishArt spec={c.dish} className="w-full" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
