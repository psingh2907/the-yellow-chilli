"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Desktop cursor: a saffron dot that follows exactly and a ring that trails
 * (both via gsap.quickTo, so no tween is created per mouse move). Over
 * `[data-cursor="label"]` the ring grows and shows the label ("Drag",
 * "View"…). Also drives magnetic buttons: `[data-magnetic]` leans toward
 * the pointer and springs back with an elastic ease.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion() || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    let magnet: HTMLElement | null = null;
    let shown = false;
    // Last hover state: pointerover fires constantly while content scrolls
    // under a still mouse, so only animate when the state actually changes.
    let lastState = "";

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        gsap.to(magnet, { x: mx * 0.25, y: my * 0.35, duration: 0.4, ease: "power3" });
        const label = magnet.querySelector("[data-magnetic-label]");
        if (label) gsap.to(label, { x: mx * 0.12, y: my * 0.15, duration: 0.4, ease: "power3" });
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest("a, button, [role=button], input, select, textarea, label");
      const label = labelled?.dataset.cursor ?? "";
      const state = `${label}|${interactive ? 1 : 0}`;
      const nextMagnet = target.closest<HTMLElement>("[data-magnetic]");
      if (nextMagnet !== magnet) {
        if (magnet) releaseMagnet(magnet);
        magnet = nextMagnet;
      }
      if (state === lastState) return;
      lastState = state;
      if (text.current) text.current.textContent = label;
      gsap.to(ring.current, {
        scale: label ? 2.6 : interactive ? 1.6 : 1,
        backgroundColor: label ? "rgba(244,165,33,0.95)" : "rgba(244,165,33,0)",
        duration: 0.35,
        ease: "chilli",
        overwrite: "auto",
      });
      gsap.to(dot.current, { scale: label || interactive ? 0 : 1, duration: 0.25, overwrite: "auto" });
    };

    const releaseMagnet = (el: HTMLElement) => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      const label = el.querySelector("[data-magnetic-label]");
      if (label) gsap.to(label, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    };

    const onLeave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      <div ref={ring} className="invisible fixed top-0 left-0 -mt-5 -ml-5 flex h-10 w-10 items-center justify-center rounded-full border border-saffron/70 opacity-0">
        <span ref={text} className="text-[0.32rem] font-bold tracking-[0.18em] text-night uppercase" />
      </div>
      <div ref={dot} className="invisible fixed top-0 left-0 -mt-1 -ml-1 h-2 w-2 rounded-full bg-saffron opacity-0" />
    </div>
  );
}
