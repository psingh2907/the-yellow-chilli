"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { ChilliMark } from "@/components/ui/ChilliMark";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Route changes: a saffron curtain rises over the page (with the chilli
 * spinning in), the route changes underneath, then the curtain carries on
 * up and off. Internal link clicks are intercepted for the "cover" half;
 * anything else (back button, modified clicks, new tabs) navigates normally.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const first = useRef(true);
  const pointerNav = useRef(false);

  const lift = useCallback(() => {
    if (!covering.current || !curtain.current) return;
    covering.current = false;
    if (pointerNav.current && document.activeElement instanceof HTMLElement) document.activeElement.blur();
    gsap
      .timeline({ delay: 0.1 })
      .to(curtain.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" })
      .set(curtain.current, { visibility: "hidden" });
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (prefersReducedMotion() || !curtain.current) return;

      e.preventDefault();
      covering.current = true;
      // Mouse/touch clicks (detail > 0) shouldn't leave a focus ring on a link
      // in the persistent header; keyboard users keep their focus.
      pointerNav.current = e.detail > 0;
      gsap
        .timeline()
        .set(curtain.current, { visibility: "visible", yPercent: 100 })
        .to(curtain.current, { yPercent: 0, duration: 0.55, ease: "power4.inOut" })
        .fromTo("[data-wipe-chilli]", { rotate: -40, scale: 0.6 }, { rotate: 0, scale: 1, duration: 0.55, ease: "back.out(2)" }, "<0.15")
        .add(() => {
          router.push(url.pathname + url.search + url.hash);
          // Never leave the curtain down if the navigation stalls or fails.
          gsap.delayedCall(4, lift);
        });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, lift]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    lift();
  }, [pathname, lift]);

  return (
    <div ref={curtain} aria-hidden="true" className="invisible fixed inset-0 z-[95] flex items-center justify-center bg-saffron">
      <span data-wipe-chilli className="inline-block">
        <ChilliMark className="h-20 w-20" />
      </span>
    </div>
  );
}
