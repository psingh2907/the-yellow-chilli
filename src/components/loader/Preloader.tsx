"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useEffect, useRef } from "react";
import { CHILLI_CAP, CHILLI_POD, CHILLI_STEM } from "@/components/ui/ChilliMark";
import { gsap, SplitText } from "@/lib/gsap";
import { INTRO_DONE_EVENT, INTRO_STORAGE_KEY } from "@/lib/intro";

gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin, Flip);

const LINES = ["Heating the tawa", "Tempering the spices", "Plating up"];
// A circle drawn as a path so MorphSVG can tween the pod into it.
const CIRCLE = "M32,14 C42,14 50,22 50,32 C50,42 42,50 32,50 C22,50 14,42 14,32 C14,22 22,14 32,14 Z";

/**
 * "Tadka": the first-visit loader.
 *  1. The chilli's outline is drawn (DrawSVG) as the counter runs to 100.
 *  2. It fills with saffron and sizzles (CustomWiggle "heat").
 *  3. The pod morphs into a disc (MorphSVG) that floods the screen.
 *  4. The wordmark rises in (SplitText), then flies into the header
 *     (Flip.fit) while the curtain lifts.
 * Progress follows real work (fonts, page load) between a minimum and a
 * maximum time. Tap, click or Escape skips ahead.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains("is-loading")) return;

    const finish = () => {
      html.classList.remove("is-loading", "loader-revealing");
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // Private mode: the loader simply shows again next visit.
      }
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    };
    if (document.hidden) {
      finish();
      return;
    }

    const q = gsap.utils.selector(el);
    const counter = q("[data-counter]")[0] as HTMLElement;
    const label = q("[data-label]")[0] as HTMLElement;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const MIN = mobile ? 900 : 1400;
    const MAX = mobile ? 2200 : 3000;

    gsap.set(q("[data-draw]"), { drawSVG: "0%" });
    gsap.set(q("[data-fill]"), { fillOpacity: 0 });

    let skip = false;
    const requestSkip = () => (skip = true);
    const onKey = (e: KeyboardEvent) => ["Escape", "Enter", " "].includes(e.key) && requestSkip();
    el.addEventListener("pointerdown", requestSkip);
    window.addEventListener("keydown", onKey);

    let real = 0.35;
    document.fonts?.ready.then(() => (real = Math.max(real, 0.75)));
    const onLoad = () => (real = 1);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    const start = performance.now();
    let shown = 0;
    let frame = 0;
    let revealing = false;

    const render = (p: number) => {
      gsap.set(q("[data-draw]"), { drawSVG: `${p * 100}%` });
      counter.textContent = String(Math.round(p * 100)).padStart(3, "0");
      const line = LINES[Math.min(LINES.length - 1, Math.floor(p * LINES.length))];
      if (label.textContent !== line) label.textContent = line;
    };

    const reveal = () => {
      revealing = true;
      el.removeEventListener("pointerdown", requestSkip);
      window.removeEventListener("keydown", onKey);
      const mark = q("[data-loader-mark]")[0] as HTMLElement;
      const target = document.querySelector<HTMLElement>("[data-nav-mark]");
      const split = SplitText.create(mark.querySelectorAll("[data-mark-word]"), { type: "chars", mask: "chars" });

      const tl = gsap.timeline({ defaults: { ease: "chilli" } });
      tl.to(q("[data-fill]"), { fillOpacity: 1, duration: 0.35 })
        .to(q("[data-chilli]"), { rotate: 10, duration: 0.6, ease: "heat" }, "<")
        .to(q("[data-pod]"), { morphSVG: CIRCLE, duration: 0.5, ease: "simmer" }, "-=0.1")
        .to(q("[data-cap], [data-stem], [data-shine]"), { opacity: 0, duration: 0.2 }, "<")
        .to([counter, label], { opacity: 0, y: 10, duration: 0.3 }, "<")
        .fromTo(q("[data-flood]"), { clipPath: "circle(0% at 50% 46%)" }, { clipPath: "circle(150% at 50% 46%)", duration: 0.8, ease: "simmer" }, "-=0.15")
        .set(q("[data-chilli]"), { opacity: 0 })
        .set(mark, { opacity: 1 })
        .from(split.chars, { yPercent: 110, duration: 0.7, stagger: 0.025 }, "-=0.3")
        .add(() => {
          // Hand over to the page: its intro animations start as the curtain lifts.
          html.classList.add("loader-revealing");
          html.classList.remove("is-loading");
          try {
            sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
          } catch {}
          window.dispatchEvent(new Event(INTRO_DONE_EVENT));
        }, "+=0.25")
        .to(q("[data-curtain]"), { yPercent: -100, duration: 1, ease: "power4.inOut" }, "<");

      if (target) {
        tl.add(Flip.fit(mark, target, { scale: true, duration: 1, ease: "power4.inOut" }) as gsap.core.Tween, "<");
        tl.to(mark, { color: "var(--color-cream)", duration: 0.6 }, "<0.3");
      }
      tl.add(() => {
        html.classList.remove("loader-revealing");
        split.revert();
      });
    };

    const tick = (now: number) => {
      if (!html.classList.contains("is-loading")) {
        // The <head> failsafe already removed the loader.
        if (!revealing) finish();
        return;
      }
      const elapsed = now - start;
      const target = elapsed >= MAX || skip ? 1 : Math.min(real, elapsed / MIN);
      shown += (target - shown) * (skip ? 0.35 : 0.1);
      if (target === 1 && shown > 0.995) shown = 1;
      render(shown);
      if (shown >= 1) reveal();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
      el.removeEventListener("pointerdown", requestSkip);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={root} id="loader" aria-hidden="true" className="fixed inset-0 z-[100]">
      <div data-curtain className="absolute inset-0 overflow-hidden bg-night">
        <div data-flood className="absolute inset-0 bg-saffron" style={{ clipPath: "circle(0% at 50% 46%)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <svg data-chilli viewBox="0 0 64 64" className="h-36 w-36 overflow-visible md:h-44 md:w-44">
            <path data-pod data-draw data-fill d={CHILLI_POD} fill="var(--color-saffron)" stroke="var(--color-saffron)" strokeWidth="1.2" />
            <path data-shine d="M24,21 C33,19 41,24 45,32" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" data-draw />
            <path data-cap data-draw data-fill d={CHILLI_CAP} fill="var(--color-leaf)" stroke="var(--color-leaf)" strokeWidth="1.2" />
            <path data-stem data-draw d={CHILLI_STEM} fill="none" stroke="var(--color-leaf)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col items-center gap-2">
            <span data-counter className="font-display text-sm font-bold tracking-[0.3em] text-saffron tabular-nums">
              000
            </span>
            <span data-label className="label text-mist">
              {LINES[0]}
            </span>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span
          data-loader-mark
          className="inline-block font-display text-[clamp(2.6rem,10vw,8rem)] font-extrabold tracking-[-0.04em] text-night lowercase opacity-0"
        >
          <span data-mark-word>the yellow</span> <span data-mark-word>chilli</span>
        </span>
      </div>
    </div>
  );
}
