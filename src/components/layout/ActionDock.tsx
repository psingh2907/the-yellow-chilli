"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { bookingMessage, directionsUrl, phoneHref, whatsappHref } from "@/lib/contact";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { formatTime, getOpenStatus } from "@/lib/hours";
import { platter, platterCount, usePlatter, usePlatterOpen } from "@/components/menu/platter";
import { business } from "@/data/business";

interface Action {
  label: string;
  sub?: string;
  icon: IconName;
  href: string;
  external?: boolean;
  tone: "gold" | "whatsapp" | "plain";
}

function useShortStatus(): string {
  const [label, setLabel] = useState(`Open till ${formatTime(business.hours.closes)}`);
  useEffect(() => {
    const update = () => {
      const s = getOpenStatus();
      setLabel(s.open ? `Open till ${formatTime(business.hours.closes)}` : `Opens ${formatTime(business.hours.opens)}`);
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  return label;
}

/**
 * Phone-only speed dial. At rest it is one 52px gold button in the bottom
 * right corner (a quarter of the old dock's footprint). Tapping it dims the
 * page and fans the actions upward as labelled pills (GSAP timeline, staggered,
 * "groove" ease); the phone icon morphs into a cross. After a few seconds of
 * scrolling down the button shrinks to a smaller dot, and grows back on
 * scroll up. On /menu the Thali button sits beside it with the live dish count.
 */
export function ActionDock() {
  const pathname = usePathname();
  const status = useShortStatus();
  const lines = usePlatter();
  const thaliOpen = usePlatterOpen();
  const onMenu = pathname === "/menu";
  const count = platterCount(lines);
  const [open, setOpen] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const phoneIcon = useRef<HTMLSpanElement>(null);
  const crossIcon = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const actions: Action[] = [
    { label: "Call to book", sub: status, icon: "phone", href: phoneHref, tone: "gold" },
    { label: "WhatsApp", sub: "Reserve a table", icon: "whatsapp", href: whatsappHref(bookingMessage), external: true, tone: "whatsapp" },
    { label: "Directions", sub: "R.S Tower, Railway Colony", icon: "pin", href: directionsUrl, external: true, tone: "plain" },
    { label: "Menu", sub: "About 200 veg dishes", icon: "book", href: "/menu", tone: "plain" },
  ];

  // Open / close timeline.
  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-dial-item]", root.current);
      if (!items.length || !scrim.current || !phoneIcon.current || !crossIcon.current) return;
      const reduced = prefersReducedMotion();
      gsap.set(items, { autoAlpha: 0, y: 24, scale: 0.8, transformOrigin: "100% 100%" });
      gsap.set(crossIcon.current, { autoAlpha: 0, rotation: -90 });
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "groove", duration: reduced ? 0.01 : 0.5 } })
        .to(scrim.current, { autoAlpha: 1, duration: reduced ? 0.01 : 0.3, ease: "power1.out" }, 0)
        .to(phoneIcon.current, { autoAlpha: 0, rotation: 90, duration: reduced ? 0.01 : 0.25 }, 0)
        .to(crossIcon.current, { autoAlpha: 1, rotation: 0, duration: reduced ? 0.01 : 0.35 }, 0.05)
        .to(items, { autoAlpha: 1, y: 0, scale: 1, stagger: reduced ? 0 : { each: 0.06, from: "end" } }, 0.05);
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      t.timeScale(1).reversed(false).play();
    } else if (t.progress() > 0) {
      t.timeScale(1).reverse();
    }
  }, [open]);

  // Close on route change / Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Shrink while scrolling down, grow on scroll up (never while open).
  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;
    let last = window.scrollY;
    const size = gsap.quickTo(fab.current, "scale", { duration: 0.4, ease: "power3" });
    const onScroll = () => {
      const y = window.scrollY;
      if (!open) size(y > last + 4 && y > 200 ? 0.78 : 1);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // A tiny periodic ring on the phone icon while closed.
  useGSAP(() => {
    if (!phoneIcon.current || prefersReducedMotion()) return;
    gsap.to(phoneIcon.current, { x: 1.5, duration: 0.9, ease: "heat", repeat: -1, repeatDelay: 5, delay: 3 });
  });

  return (
    <div ref={root} className="lg:hidden">
      <div
        ref={scrim}
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className="invisible fixed inset-0 z-[45] bg-night/70 opacity-0 backdrop-blur-sm"
      />
      <nav
        aria-label="Quick actions"
        className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[46] flex flex-col items-end gap-3"
      >
        <ul className={cn("flex flex-col items-end gap-2.5", !open && "pointer-events-none")}>
          {actions.map((a) => {
            const body = (
              <>
                <span className="flex min-w-0 flex-col text-right">
                  <span className="font-display text-[0.95rem] leading-tight font-extrabold tracking-tight text-cream">{a.label}</span>
                  {a.sub && <span className="text-[0.68rem] leading-tight font-semibold text-mist">{a.sub}</span>}
                </span>
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                    a.tone === "gold" && "bg-gold text-night",
                    a.tone === "whatsapp" && "bg-whatsapp text-night",
                    a.tone === "plain" && "bg-cream text-night",
                  )}
                >
                  <Icon name={a.icon} className="h-5 w-5" />
                </span>
              </>
            );
            const cls = "pointer-events-auto flex items-center gap-3 rounded-full bg-night py-1.5 pr-1.5 pl-5 ring-1 ring-cream/10 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] active:scale-95 transition-transform";
            return (
              <li key={a.label} data-dial-item className={a.href === "/menu" && onMenu ? "hidden" : undefined}>
                {a.external ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className={cls}>
                    {body}
                  </a>
                ) : (
                  <Link href={a.href} tabIndex={open ? 0 : -1} className={cls}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <div className="pointer-events-auto flex items-center gap-3">
          {onMenu && (
            <button
              type="button"
              data-thali-target
              onClick={() => platter.setOpen(!thaliOpen)}
              aria-expanded={thaliOpen}
              aria-label={`Your thali: ${count} ${count === 1 ? "dish" : "dishes"}`}
              className={cn(
                "relative flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full ring-1 ring-cream/10 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] transition-all duration-150 active:scale-90",
                thaliOpen ? "bg-cream text-night" : "bg-night text-gold",
              )}
            >
              <Icon name="plate" className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[0.65rem] font-bold text-cream tabular-nums">
                  {count}
                </span>
              )}
            </button>
          )}
          <button
            ref={fab}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Close quick actions" : "Book a table: call, WhatsApp, directions"}
            className="relative flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-gold text-night shadow-[0_14px_30px_-8px_rgba(242,181,68,0.55)] ring-1 ring-night/20"
          >
            <span ref={phoneIcon} className="absolute inline-flex">
              <Icon name="phone" className="h-6 w-6" />
            </span>
            <span ref={crossIcon} className="absolute inline-flex">
              <Icon name="close" className="h-5 w-5" />
            </span>
            <span className="absolute top-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-leaf ring-2 ring-gold" aria-hidden="true" />
          </button>
        </div>
      </nav>
    </div>
  );
}
