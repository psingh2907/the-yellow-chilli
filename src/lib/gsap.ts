/**
 * The site's GSAP setup. Components import `gsap` from here so the core
 * plugins and the brand eases are always registered first. Heavier plugins
 * (Flip, Draggable, MorphSVG…) are registered by the components that use
 * them, so pages only download what they animate.
 *
 * Brand motion voice:
 *   "chilli"  sharp start, long settle: reveals, arrivals
 *   "simmer"  slow and heavy: big moves, scene changes
 *   "heat"    a wiggle that dies away: shakes, sizzle
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother, SplitText, CustomEase, CustomWiggle);
  // Phones: the address bar sliding in/out resizes the viewport; re-measuring
  // every section then makes pinned sections jump mid-scroll. Ignore it.
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (!CustomEase.get("chilli")) {
    CustomEase.create("chilli", "M0,0 C0.06,0.72 0.18,1 1,1");
    CustomEase.create("simmer", "M0,0 C0.5,0 0.18,1 1,1");
    CustomWiggle.create("heat", { wiggles: 7, type: "easeOut" });
  }
  // Handy in the browser console while developing.
  if (process.env.NODE_ENV === "development") Object.assign(window, { gsap, ScrollTrigger, ScrollSmoother });
}

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, useGSAP };

/** True when the visitor asked for less motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Touch-first device (phones, most tablets). */
export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

/** Scrolls to an element, smoothly through ScrollSmoother when it is running. */
export function scrollToElement(target: Element | string, offset = 80): void {
  const smoother = ScrollSmoother.get();
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (smoother) {
    smoother.scrollTo(smoother.offset(el, "top top") - offset, true);
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/**
 * Plays looping, decorative animations only while `trigger` is on screen and
 * pauses them otherwise, so off-screen sections cost nothing per frame.
 * Returns the ScrollTrigger (killed by useGSAP's context cleanup).
 */
export function playWhileVisible(trigger: Element | null, animations: gsap.core.Animation[]): ScrollTrigger | undefined {
  if (!trigger) return;
  animations.forEach((a) => a.pause());
  return ScrollTrigger.create({
    trigger,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => animations.forEach((a) => (self.isActive ? a.resume() : a.pause())),
  });
}
