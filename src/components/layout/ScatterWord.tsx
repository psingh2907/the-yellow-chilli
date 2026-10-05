"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * The giant footer wordmark. Each letter flees the cursor (gsap.quickTo per
 * letter) and springs back with an elastic ease when it leaves. On touch,
 * letters bounce in one after another when the footer scrolls into view.
 */
export function ScatterWord({ text }: { text: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", el);

      gsap.from(letters, {
        yPercent: 100,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
      });

      if (!window.matchMedia("(hover: hover)").matches) return;
      const movers = letters.map((l) => ({
        el: l,
        x: gsap.quickTo(l, "x", { duration: 0.6, ease: "power3" }),
        y: gsap.quickTo(l, "y", { duration: 0.6, ease: "power3" }),
        r: gsap.quickTo(l, "rotate", { duration: 0.6, ease: "power3" }),
      }));
      const radius = 160;
      // Letter centres are measured once per hover (not per mouse move:
      // reading layout for 17 letters every move made the footer stutter).
      let centres: Array<{ x: number; y: number }> = [];
      const measure = () => {
        centres = letters.map((l) => {
          // Home position = where it is now minus its current offset.
          const b = l.getBoundingClientRect();
          return { x: b.left + b.width / 2 - Number(gsap.getProperty(l, "x")), y: b.top + b.height / 2 - Number(gsap.getProperty(l, "y")) };
        });
      };
      const onEnter = () => measure();
      const onMove = (e: PointerEvent) => {
        if (!centres.length) measure();
        for (const [i, m] of movers.entries()) {
          const dx = centres[i].x - e.clientX;
          const dy = centres[i].y - e.clientY;
          const dist = Math.hypot(dx, dy);
          const push = Math.max(0, 1 - dist / radius);
          m.x((dx / (dist || 1)) * push * 60);
          m.y((dy / (dist || 1)) * push * 60);
          m.r(push * (dx > 0 ? 18 : -18));
        }
      };
      const onLeave = () => {
        centres = [];
        for (const m of movers) gsap.to(m.el, { x: 0, y: 0, rotate: 0, duration: 1.4, ease: "elastic.out(1, 0.3)", overwrite: true });
      };
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: root },
  );

  return (
    <p
      ref={root}
      aria-hidden="true"
      className="my-16 flex justify-center overflow-hidden px-2 font-display text-[clamp(2.6rem,12.8vw,15rem)] leading-[0.85] font-extrabold tracking-[-0.05em] text-saffron select-none"
    >
      {Array.from(text).map((ch, i) => (
        <span key={i} data-letter className="inline-block will-change-transform">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </p>
  );
}
