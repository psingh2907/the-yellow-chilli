"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Wordmark } from "@/components/ui/ChilliMark";
import { business } from "@/data/business";
import { navLinks } from "@/data/navigation";
import { cn } from "@/lib/cn";
import { phoneHref } from "@/lib/contact";
import { gsap, prefersReducedMotion, ScrollSmoother, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Fixed header. Slides away while scrolling down, returns on any upward
 * scroll. The full-screen menu opens as a saffron circle growing out of the
 * button, then each link's letters rise in (SplitText).
 */
export function Navbar({ hasBanner }: { hasBanner: boolean }) {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Hide on scroll down, show on scroll up.
  useGSAP(() => {
    if (!bar.current) return;
    const hide = gsap.to(bar.current, { yPercent: -120, duration: 0.45, ease: "power3.inOut", paused: true }).progress(0);
    // Pages with their own pinned toolbar (the menu) ask the header to stay away.
    const tuckedAway = () => document.documentElement.classList.contains("hide-nav");
    const st = ScrollTrigger.create({
      start: 120,
      end: "max",
      // Only deliberate scrolling moves the header (small wobbles from smooth
      // scrolling or a resting finger would otherwise make it flicker).
      onUpdate: (self) => {
        const v = self.getVelocity();
        if (tuckedAway() || v > 300) hide.play();
        else if (v < -300) hide.reverse();
      },
      onLeaveBack: () => hide.reverse(),
    });
    // A solid backdrop once the page has scrolled, so links stay legible over light sections.
    const solid = ScrollTrigger.create({ start: 40, end: "max", toggleClass: { targets: bar.current, className: "is-solid" } });
    return () => {
      st.kill();
      solid.kill();
    };
  });

  // Menu open / close timeline.
  useGSAP(
    () => {
      if (!panel.current) return;
      const links = gsap.utils.toArray<HTMLElement>("[data-menu-link]", panel.current);
      const split = SplitText.create(links, { type: "chars", mask: "chars" });
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "chilli" } })
        .set(panel.current, { visibility: "visible" })
        .fromTo(panel.current, { clipPath: "circle(0% at 95% 4%)" }, { clipPath: "circle(150% at 95% 4%)", duration: 0.9, ease: "simmer" })
        .from(split.chars, { yPercent: 110, duration: 0.8, stagger: 0.012 }, 0.35)
        .from("[data-menu-fade]", { opacity: 0, y: 20, duration: 0.6, stagger: 0.05 }, 0.5);
      return () => split.revert();
    },
    { scope: panel },
  );

  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (open) {
      smoother?.paused(true);
      if (prefersReducedMotion()) tl.current?.progress(1);
      else tl.current?.timeScale(1).play();
    } else {
      smoother?.paused(false);
      if (prefersReducedMotion()) tl.current?.progress(0);
      else tl.current?.timeScale(1.6).reverse();
    }
  }, [open]);

  // Close on navigation (adjusting state while rendering, not in an effect) and on Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        ref={bar}
        className={cn(
          "fixed inset-x-0 z-50 transition-[background-color] duration-300 [&.is-solid]:bg-night/95",
          hasBanner ? "top-8" : "top-0",
        )}
      >
        <div className="container-x flex h-18 items-center justify-between gap-6 md:h-22">
          <Link href="/" className="relative z-10 pt-3 text-[1.45rem] text-cream md:text-[1.7rem]" aria-label={`${business.name}, home`}>
            <Wordmark data-nav-mark="" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "label relative py-2 transition-colors hover:text-saffron",
                  pathname === link.href ? "text-saffron" : "text-cream/80",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={phoneHref}
              data-magnetic
              className="hidden min-h-11 items-center gap-2 rounded-full bg-saffron px-5 text-sm font-semibold text-night transition-colors hover:bg-saffron-light sm:inline-flex"
            >
              <span data-magnetic-label className="inline-flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4" /> Reserve
              </span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="relative z-[61] inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-saffron hover:text-saffron lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={panel}
        id="site-menu"
        aria-hidden={!open}
        inert={!open}
        className="invisible fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-saffron text-night"
      >
        <div className="container-x flex min-h-full flex-col justify-between gap-10 pt-28 pb-10">
          <nav aria-label="Menu" className="flex flex-col gap-1">
            <Link href="/" className="group py-1">
              <span data-menu-link className="block font-display text-[clamp(2.6rem,12vw,5rem)] leading-[0.95] font-extrabold tracking-tight">
                Home
              </span>
            </Link>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group py-1">
                <span data-menu-link className="block font-display text-[clamp(2.6rem,12vw,5rem)] leading-[0.95] font-extrabold tracking-tight">
                  {link.label}
                </span>
                <span data-menu-fade className="mt-1 block text-sm text-night/70">
                  {link.hint}
                </span>
              </Link>
            ))}
          </nav>
          <div data-menu-fade className="flex flex-wrap gap-3">
            <a href={phoneHref} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-night px-6 font-semibold text-cream">
              <Icon name="phone" className="h-4 w-4" /> Call to reserve
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
