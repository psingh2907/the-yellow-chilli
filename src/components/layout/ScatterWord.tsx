"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * The giant footer wordmark.
 *  - Every time it scrolls into view, the letters bounce up one after another.
 *  - Mouse: each letter flees the cursor (gsap.quickTo per letter) and springs
 *    back with an elastic ease when the cursor leaves.
 *  - Tap / click: the letters nearest the point jump and spin, then settle.
 */
export function ScatterWord({ text }: { text: string }) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", el);

      // Replays on every entry (from below or above), not just the first.
      gsap.from(letters, {
        yPercent: 100,
        opacity: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.04,
        scrollTrigger: { trigger: el, start: "top 95%", toggleActions: "restart none none reset" },
      });

      // Letter centres, measured from where they rest (current position minus offset).
      const measure = () =>
        letters.map((l) => {
          const b = l.getBoundingClientRect();
          return { x: b.left + b.width / 2 - Number(gsap.getProperty(l, "x")), y: b.top + b.height / 2 - Number(gsap.getProperty(l, "y")) };
        });

      // Tap / click: a little shockwave out from the point.
      const onDown = (e: PointerEvent) => {
        const centres = measure();
        letters.forEach((l, i) => {
          const dist = Math.hypot(centres[i].x - e.clientX, centres[i].y - e.clientY);
          const push = Math.max(0, 1 - dist / 220);
          if (!push) return;
          gsap
            .timeline({ overwrite: true })
            .to(l, { y: -70 * push, rotate: (centres[i].x > e.clientX ? 1 : -1) * 25 * push, duration: 0.25, ease: "power2.out", delay: (1 - push) * 0.08 })
            .to(l, { y: 0, x: 0, rotate: 0, duration: 1.2, ease: "elastic.out(1, 0.3)" });
        });
      };
      el.addEventListener("pointerdown", onDown);

      const hover = window.matchMedia("(hover: hover)").matches;
      if (!hover) return () => el.removeEventListener("pointerdown", onDown);

      // Mouse: built fresh on every hover. The spring-back on leave kills the
      // letters' tweens (overwrite), which used to take the quickTo tweens with
      // it, so the effect only ever worked on the first hover.
      type Mover = { x: gsap.QuickToFunc; y: gsap.QuickToFunc; r: gsap.QuickToFunc };
      let movers: Mover[] = [];
      let centres: Array<{ x: number; y: number }> = [];
      const radius = 160;
      const onEnter = () => {
        gsap.killTweensOf(letters);
        centres = measure();
        movers = letters.map((l) => ({
          x: gsap.quickTo(l, "x", { duration: 0.6, ease: "power3" }),
          y: gsap.quickTo(l, "y", { duration: 0.6, ease: "power3" }),
          r: gsap.quickTo(l, "rotate", { duration: 0.6, ease: "power3" }),
        }));
      };
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!movers.length) onEnter();
        movers.forEach((m, i) => {
          const dx = centres[i].x - e.clientX;
          const dy = centres[i].y - e.clientY;
          const dist = Math.hypot(dx, dy);
          const push = Math.max(0, 1 - dist / radius);
          m.x((dx / (dist || 1)) * push * 60);
          m.y((dy / (dist || 1)) * push * 60);
          m.r(push * (dx > 0 ? 18 : -18));
        });
      };
      const onLeave = () => {
        movers = [];
        gsap.to(letters, { x: 0, y: 0, rotate: 0, duration: 1.4, ease: "elastic.out(1, 0.3)", overwrite: true });
      };
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointerdown", onDown);
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
      className="flex cursor-pointer justify-center px-2 font-display text-[clamp(2.6rem,12.8vw,15rem)] leading-[0.85] font-extrabold tracking-[-0.05em] text-saffron select-none [-webkit-tap-highlight-color:transparent]"
    >
      {Array.from(text).map((ch, i) => (
        <span key={i} data-letter className="inline-block will-change-transform">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </p>
  );
}
