"use client";

import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { business } from "@/data/business";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";
import { HeroScene } from "./HeroScene";

gsap.registerPlugin(ScrambleTextPlugin);

const CRAVINGS = ["Lalla Mussa Dal", "Dilli Wala Butter Chicken", "Laal Maas", "Murgh Noormahal Biryani", "Dahi Ke Kabab", "Gulab-e-Gulkand"];

/**
 * First screen. The headline rises out of masked lines (SplitText), a
 * "today's craving" line scrambles through signature dishes (ScrambleText,
 * with Devanagari letters as the scramble), and the whole layer drifts up
 * and fades as the 3D chilli bursts behind it.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const headline = SplitText.create("[data-hero-title]", { type: "lines,words", mask: "lines", linesClass: "split-mask" });
      gsap.set(headline.words, { yPercent: 115 });
      gsap.set("[data-hero-fade]", { opacity: 0, y: 24 });

      // Built here (inside the GSAP context, so they're cleaned up with the
      // page) and started once the loader lifts.
      const intro = gsap
        .timeline({ paused: true, defaults: { ease: "chilli" } })
        .to(headline.words, { yPercent: 0, duration: 1.3, stagger: 0.07 })
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, "-=0.9");

      const cycle = gsap.timeline({ repeat: -1, paused: true, delay: 1.6 });
      const word = root.current?.querySelector("[data-craving]");
      CRAVINGS.forEach((dish) => {
        cycle.to(word ?? {}, { duration: 1.1, scrambleText: { text: dish, chars: "मिर्चीमसालातड़काघीदाल", speed: 0.6, revealDelay: 0.25 } }).to({}, { duration: 1.8 });
      });

      // The scramble only runs while the hero is on screen (and after the intro).
      let introDone = false;
      let onScreen = true;
      const sync = () => (introDone && onScreen ? cycle.resume() : cycle.pause());
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          onScreen = self.isActive;
          sync();
        },
      });
      const stop = afterIntro(() => {
        intro.play();
        introDone = true;
        sync();
      });

      gsap.to("[data-hero-content]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => {
        stop();
        headline.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="grain relative min-h-svh overflow-hidden bg-night">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_45%,rgba(244,165,33,0.18),transparent_70%),radial-gradient(40%_40%_at_15%_90%,rgba(224,57,43,0.16),transparent_70%)]" />
      <HeroScene />

      {/* min-h + top padding: on short screens the content grows the hero instead of sliding under the header. */}
      <div data-hero-content className="relative z-10 flex min-h-svh flex-col justify-end pt-36 pb-28 lg:pb-16">
        <div className="container-x">
          <p data-hero-fade className="label mb-6 text-saffron">
            Master Chef Sanjeev Kapoor&rsquo;s · {business.branch}
          </p>
          <h1 data-hero-title className="display-xl max-w-[12ch] text-cream">
            Redefining Indian food.
          </h1>
          {/* The dish name changes every few seconds: it gets its own line that
              never wraps, so the hero's height (and the headline above) stays put. */}
          <p data-hero-fade className="mt-6 flex flex-col font-display text-xl text-mist sm:flex-row sm:items-baseline sm:gap-x-3 md:text-2xl">
            Today&rsquo;s craving:
            <span data-craving className="font-semibold whitespace-nowrap text-saffron">
              {CRAVINGS[0]}
            </span>
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
            <Button href="/menu" icon="book">
              See the menu
            </Button>
            <Button href="/visit" variant="outline" icon="pin" className="text-cream">
              Find us on NH-75
            </Button>
          </div>
          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mist">
            <OpenStatus />
            <span className="inline-flex items-center gap-1.5">
              <Icon name="star" className="h-4 w-4 text-saffron" />
              {business.ratings.google.score} · {business.ratings.google.count.toLocaleString("en-IN")} Google reviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="parking" className="h-4 w-4 text-saffron" /> Free parking
            </span>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="absolute right-6 bottom-8 z-10 hidden flex-col items-center gap-3 text-mist lg:flex">
        <span className="label [writing-mode:vertical-rl]">Scroll</span>
        <span className="h-14 w-px animate-pulse bg-gradient-to-b from-saffron to-transparent" />
      </div>
    </section>
  );
}
