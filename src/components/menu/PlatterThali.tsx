"use client";

import { Flip } from "gsap/Flip";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { whatsappHref } from "@/lib/contact";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsClient } from "@/lib/useClient";
import { platter, platterCount, platterTotal, usePlatter, usePlatterOpen } from "./platter";

gsap.registerPlugin(Flip);

/**
 * The thali: a platter that collects dishes from the menu. Shows the total
 * and the cost per person, and sends the list to the restaurant on WhatsApp.
 *  - Desktop: a floating brass plate (bottom right) that opens into a panel
 *    (Flip from the plate's box to the panel's box).
 *  - Phones: no floating plate (it covered the dishes' + buttons). The dock's
 *    Thali button opens the panel as a sheet just above the dock.
 * Rendered into <body> so it stays fixed (ScrollSmoother moves the page).
 */
export function PlatterThali() {
  const lines = usePlatter();
  const open = usePlatterOpen();
  const [people, setPeople] = useState(2);
  const mounted = useIsClient();
  const box = useRef<HTMLDivElement>(null);
  const state = useRef<Flip.FlipState | null>(null);

  // Desktop: record the plate's box so the panel can Flip out of it.
  // (Phones open it from the dock, where it simply rises into view.)
  const toggle = (next: boolean) => {
    if (box.current && window.matchMedia("(min-width: 1024px)").matches && !prefersReducedMotion()) {
      state.current = Flip.getState(box.current, { props: "borderRadius,backgroundColor" });
    }
    platter.setOpen(next);
  };

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    if (state.current) {
      Flip.from(state.current, { duration: 0.6, ease: "chilli", nested: true });
      state.current = null;
    } else if (open && box.current) {
      // Phones: the sheet rises from the dock.
      gsap.from(box.current, { y: 40, opacity: 0, duration: 0.45, ease: "chilli" });
    }
    if (open) gsap.from("[data-thali-line]", { opacity: 0, x: 20, duration: 0.4, stagger: 0.04, delay: 0.2 });
  }, [open]);

  // Close on Escape, and when leaving the menu page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && platter.setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      platter.setOpen(false);
    };
  }, []);

  const count = platterCount(lines);
  const total = platterTotal(lines);
  const perPerson = people ? Math.round(total / people) : total;
  const message = [
    "Hi! I'd like to order from The Yellow Chilli, Satna:",
    ...lines.map((l) => `• ${l.qty} × ${l.name}`),
    `For ${people} ${people === 1 ? "person" : "people"}. Menu total ≈ ₹${total}.`,
  ].join("\n");

  if (!mounted) return null;
  return createPortal(
    <>
    {open && <button type="button" aria-label="Close platter" onClick={() => toggle(false)} className="fixed inset-0 z-[44] bg-night/40 lg:hidden" />}
    <div className={cn("fixed z-[45] lg:inset-x-auto lg:right-8 lg:bottom-8", open ? "inset-x-3 bottom-[6.6rem]" : "hidden lg:block")}>
      <div
        ref={box}
        className={cn(
          "overflow-hidden shadow-2xl",
          open ? "w-full rounded-3xl bg-night text-cream ring-1 ring-cream/10 lg:w-[24rem]" : "h-20 w-20 rounded-full bg-[radial-gradient(circle_at_40%_35%,#f3e3bf,#b8924a)]",
        )}
      >
        {!open ? (
          <button
            type="button"
            data-thali-target
            onClick={() => toggle(true)}
            aria-label={`Your platter: ${count} ${count === 1 ? "dish" : "dishes"}. Open`}
            className="relative flex h-20 w-20 items-center justify-center"
          >
            <span className="absolute inset-3 rounded-full border-4 border-[#a07a36]/40" />
            <span className="relative font-display text-2xl font-extrabold text-night">{count}</span>
            <span className="absolute -top-1 right-0 rounded-full bg-chilli px-2 py-0.5 text-[0.6rem] font-bold tracking-wider text-cream uppercase">Thali</span>
          </button>
        ) : (
          <div className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl font-extrabold">Your platter</p>
              <button type="button" onClick={() => toggle(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-night-soft" aria-label="Close platter">
                <Icon name="close" />
              </button>
            </div>
            {lines.length === 0 ? (
              <p className="mt-4 text-sm text-mist">Tap + next to any dish to start a platter. We&rsquo;ll add up the total and the cost per person.</p>
            ) : (
              <>
                <ul className="mt-4 max-h-[34vh] space-y-2 overflow-y-auto overscroll-contain pr-1">
                  {lines.map((l) => (
                    <li key={l.name} data-thali-line className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 flex-1 truncate">{l.name}</span>
                      <span className="flex items-center gap-2">
                        <button type="button" onClick={() => platter.remove(l.name)} aria-label={`One less ${l.name}`} className="h-7 w-7 rounded-full bg-night-soft">
                          −
                        </button>
                        <span className="w-4 text-center tabular-nums">{l.qty}</span>
                        <button type="button" onClick={() => platter.add(l.name, l.price)} aria-label={`One more ${l.name}`} className="h-7 w-7 rounded-full bg-night-soft">
                          +
                        </button>
                        <span className="w-14 text-right tabular-nums">₹{l.price * l.qty}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-night-line pt-4 text-sm">
                  <span>People</span>
                  <span className="flex items-center gap-2">
                    <button type="button" onClick={() => setPeople((p) => Math.max(1, p - 1))} aria-label="Fewer people" className="h-8 w-8 rounded-full bg-night-soft">
                      −
                    </button>
                    <span className="w-6 text-center tabular-nums">{people}</span>
                    <button type="button" onClick={() => setPeople((p) => Math.min(40, p + 1))} aria-label="More people" className="h-8 w-8 rounded-full bg-night-soft">
                      +
                    </button>
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-sm text-mist">
                    Total ₹{total}
                    <br />
                    <span className="font-display text-2xl font-extrabold text-saffron">₹{perPerson}</span> per person
                  </span>
                  <button type="button" onClick={() => platter.clear()} className="text-xs text-mist underline">
                    Clear
                  </button>
                </div>
                <a
                  href={whatsappHref(message)}
                  className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp font-semibold text-night"
                >
                  <Icon name="whatsapp" /> Send on WhatsApp
                </a>
                <p className="mt-2 text-[0.7rem] text-mist">Prices from the restaurant&rsquo;s Zomato menu; taxes and dine-in prices may differ.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
    </>,
    document.body,
  );
}
