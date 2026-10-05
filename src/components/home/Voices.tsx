"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { business } from "@/data/business";
import { placeUrl } from "@/lib/contact";
import { lazyDraggable } from "@/lib/draggable";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";


/** What guests mention most in their Google reviews (our summary, in our words). */
const THEMES = [
  "Classy enough for a celebration",
  "The Lalla Mussa Dal, again and again",
  "A banquet for 400, handled well",
  "Veg and non-veg, both done properly",
  "Clean, calm and family-friendly",
  "Gulab-e-Gulkand to finish",
  "The tandoori platters",
  "The big screen on match nights",
];

/**
 * An endless marquee of review themes. It runs on its own, speeds up with
 * the page's scroll velocity, and can be grabbed and flung
 * (Draggable + Inertia on a proxy that nudges the loop's progress).
 */
export function Voices() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!track.current || prefersReducedMotion()) return;
      const loop = gsap.to(track.current, { xPercent: -50, duration: 45, ease: "none", repeat: -1 });
      const wrap = gsap.utils.wrap(0, 1);

      // Scroll faster and it runs faster, then eases back; always forwards
      // (flipping direction with every scroll reads as jitter). One ticker
      // function eases the speed instead of creating tweens per scroll event,
      // and nothing runs while the section is off screen.
      let boost = 1;
      let speed = 1;
      const ease = () => {
        boost += (1 - boost) * 0.04;
        speed += (boost - speed) * 0.12;
        if (!loop.paused()) loop.timeScale(speed);
      };
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => (boost = Math.max(boost, gsap.utils.clamp(1, 4, Math.abs(self.getVelocity()) / 400))),
        onToggle: (self) => {
          if (self.isActive) {
            loop.resume();
            gsap.ticker.add(ease);
          } else {
            loop.pause();
            gsap.ticker.remove(ease);
          }
        },
      });
      loop.pause();

      // Dragging: a proxy's x movement becomes loop progress.
      const proxy = document.createElement("div");
      const width = () => track.current!.scrollWidth / 2;
      let start = 0;
      const drag = lazyDraggable(proxy, {
        type: "x",
        trigger: track.current!,
        inertia: true,
        onPress() {
          loop.pause();
          start = loop.progress();
          gsap.set(proxy, { x: 0 });
          this.update();
        },
        onDrag() {
          loop.progress(wrap(start - this.x / width()));
        },
        onThrowUpdate() {
          loop.progress(wrap(start - this.x / width()));
        },
        onRelease() {
          if (!this.tween) loop.resume();
        },
        onThrowComplete: () => loop.resume(),
      });
      return () => {
        gsap.ticker.remove(ease);
        st.kill();
        drag.kill();
        loop.kill();
      };
    },
    { scope: root },
  );

  const items = [...THEMES, ...THEMES];
  return (
    <section ref={root} aria-labelledby="voices-title" className="overflow-hidden bg-paper py-24 text-ink md:py-28">
      <div className="container-x flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="label text-saffron-deep">What guests mention most</p>
          <h2 id="voices-title" data-split className="display-lg mt-3 max-w-[14ch]">
            Satna has been talking.
          </h2>
        </div>
        <div className="flex gap-8">
          <a href={placeUrl} target="_blank" rel="noopener noreferrer" className="group">
            <p className="font-display text-5xl font-extrabold">
              {business.ratings.google.score}
              <Icon name="star" className="ml-1 inline h-8 w-8 text-saffron" />
            </p>
            <p className="text-sm text-muted group-hover:text-ink">{business.ratings.google.count.toLocaleString("en-IN")} Google reviews</p>
          </a>
          <a href={business.zomatoUrl} target="_blank" rel="noopener noreferrer" className="group">
            <p className="font-display text-5xl font-extrabold">
              {business.ratings.zomatoDelivery.score.toFixed(1)}
              <Icon name="star" className="ml-1 inline h-8 w-8 text-chilli" />
            </p>
            <p className="text-sm text-muted group-hover:text-ink">{business.ratings.zomatoDelivery.count} Zomato delivery ratings</p>
          </a>
        </div>
      </div>

      <div className="mt-14 cursor-grab active:cursor-grabbing" data-cursor="Drag">
        <div ref={track} className="flex w-max touch-pan-y gap-4 pr-4">
          {items.map((t, i) => (
            <p
              key={i}
              aria-hidden={i >= THEMES.length}
              className="flex shrink-0 items-center gap-4 rounded-full border border-ink/15 bg-cream px-8 py-5 font-display text-[clamp(1.3rem,2.6vw,2.2rem)] font-semibold whitespace-nowrap select-none"
            >
              <span className="h-3 w-3 rounded-full bg-saffron" />
              {t}
            </p>
          ))}
        </div>
      </div>
      <p className="container-x mt-6 text-xs text-muted">Themes summarised from public Google reviews, in our own words.</p>
    </section>
  );
}
