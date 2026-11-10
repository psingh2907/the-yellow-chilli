"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";
import { DishArt } from "@/components/ui/DishArt";
import { RecordArt } from "@/components/ui/RecordArt";
import { gsap, playWhileVisible, SplitText, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(DrawSVGPlugin);

const CHAPTERS = [
  {
    deva: "खाओ",
    latin: "Khao",
    english: "Eat",
    poem: ["Paneer off the tandoor.", "Dal on a slow flame.", "Two hundred dishes, all veg."],
    body: "From a ₹199 thali at lunch to sizzlers, Chinese, dosas and the VRJ specials at night: one long pure-veg menu, cooked to order in the Veerji's kitchen.",
    art: { kind: "dish" as const, spec: { kind: "thali" as const, tone: "#2f9e57", seed: 3 } },
    bg: "#140a18",
  },
  {
    deva: "गाओ",
    latin: "Gao",
    english: "Sing",
    poem: ["The lights go low.", "Veerji picks up the mic.", "And the next song is yours."],
    body: "Live music is what Satna talks about most. Adityaveer Singh, the Veerji in Veerji's, sings for the room, and takes requests for birthdays and anniversaries.",
    art: { kind: "record" as const },
    bg: "#2b0d22",
  },
  {
    deva: "मनाओ",
    latin: "Manao",
    english: "Celebrate",
    poem: ["Balloons on the table.", "A cake, a candle, a dedication.", "Then one more song."],
    body: "Birthdays, anniversaries, kitty parties and baby showers: book a private room or the whole floor, and we'll set the music to your occasion.",
    art: { kind: "dish" as const, spec: { kind: "cake" as const, tone: "#7a2c14", seed: 9 } },
    bg: "#24160a",
  },
];

/**
 * Three chapters, one verb each: खाओ · गाओ · मनाओ (eat · sing · celebrate).
 * The section pins; scrolling plays one chapter after another: the Latin
 * letters flip up one by one, the Devanagari word slides in, the poem's
 * lines rise out of masks, steam (or sound) draws itself over the art, and
 * the background changes colour (plum → club → candlelight).
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
            defaults: { ease: "groove" },
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
    <section ref={root} aria-label="Eat, sing, celebrate" className="grain relative min-h-svh overflow-hidden bg-night text-cream">
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
            {/* The vertical letter stack (K · H · A · O). */}
            <p
              data-latin
              aria-label={c.latin}
              className="hidden font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[0.92] font-extrabold text-gold uppercase [perspective:600px] lg:flex lg:flex-col"
            >
              {c.latin}
            </p>
            <div>
              <p className="label text-gold">
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
                    stroke="#fbf3e8"
                    strokeOpacity="0.35"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                ))}
              </svg>
              <div data-dish className="will-change-transform">
                {c.art.kind === "record" ? <RecordArt className="w-full" /> : <DishArt spec={c.art.spec} className="w-full" />}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
