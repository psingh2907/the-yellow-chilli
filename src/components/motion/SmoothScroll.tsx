"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useLayoutEffect } from "react";
import { gsap, prefersReducedMotion, ScrollSmoother, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { INTRO_DONE_EVENT, isIntroRunning } from "@/lib/intro";

/**
 * Creates the smoother. Rendered before the page content so its layout
 * effect runs first: sections' ScrollTriggers (and their pins) must be
 * created after the smoother exists, or pins use the wrong pin type.
 */
function SmootherInit() {
  useLayoutEffect(() => {
    // Touch screens scroll on a separate thread, so pinned sections land a
    // frame late and jitter. normalizeScroll moves scrolling onto the same
    // thread as the animations (and stops the address bar resizing the page).
    const touch = ScrollTrigger.isTouch === 1;
    if (touch) ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
    if (prefersReducedMotion()) return () => void (touch && ScrollTrigger.normalizeScroll(false));
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.1,
      smoothTouch: false,
      effects: true,
    });
    const release = () => {
      smoother.paused(false);
      ScrollTrigger.refresh();
    };
    if (isIntroRunning()) {
      smoother.paused(true);
      window.addEventListener(INTRO_DONE_EVENT, release, { once: true });
    }
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, release);
      smoother.kill();
      if (touch) ScrollTrigger.normalizeScroll(false);
    };
  }, []);
  return null;
}

/**
 * ScrollSmoother wraps the page content (fixed UI lives outside it).
 * Smoothing is for mouse wheels only: touch keeps native momentum, and
 * reduced-motion visitors get plain scrolling with nothing animated.
 *
 * It also runs the site's declarative animations, so sections can stay
 * server components:
 *
 *   data-reveal            fade + rise when scrolled into view
 *   data-reveal="clip"     uncovered from the bottom edge
 *   data-reveal-stagger    children reveal one after another
 *   data-split             headline lines rise out of a mask (SplitText)
 *   data-speed / data-lag  ScrollSmoother parallax (desktop)
 *
 * Nothing is hidden by CSS, so a script failure never hides content.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useGSAP(
    () => {
      ScrollSmoother.get()?.scrollTop(0);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const clip = el.dataset.reveal === "clip";
          gsap.fromTo(
            el,
            clip ? { clipPath: "inset(100% 0% 0% 0%)" } : { opacity: 0, y: 40 },
            {
              ...(clip ? { clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 1, y: 0 }),
              duration: clip ? 1.4 : 1.1,
              ease: "chilli",
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
          gsap.fromTo(
            group.children,
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, duration: 1, ease: "chilli", stagger: 0.08, scrollTrigger: { trigger: group, start: "top 88%", once: true } },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines,words",
            mask: "lines",
            linesClass: "split-mask",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                rotate: 4,
                duration: 1.1,
                ease: "chilli",
                stagger: 0.035,
                scrollTrigger: { trigger: el, start: "top 86%", once: true },
              }),
          });
        });
      });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <>
      <SmootherInit />
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
    </>
  );
}
