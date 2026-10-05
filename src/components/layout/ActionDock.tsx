"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { directionsUrl, phoneHref, whatsappHref } from "@/lib/contact";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { formatTime, getOpenStatus } from "@/lib/hours";
import { platter, platterCount, usePlatter, usePlatterOpen } from "@/components/menu/platter";
import { business } from "@/data/business";

interface QuickAction {
  label: string;
  icon: IconName;
  href: string;
  external?: boolean;
  /** Route that counts as "here" for the active state. */
  route?: string;
  tone?: "whatsapp";
}

const QUICK: QuickAction[] = [
  { label: "Menu", icon: "book", href: "/menu", route: "/menu" },
  { label: "Map", icon: "pin", href: directionsUrl, external: true },
  { label: "WhatsApp", icon: "whatsapp", href: whatsappHref("Hi! I'd like to book a table at The Yellow Chilli, Satna."), external: true, tone: "whatsapp" },
];

/** "Open · till 11:30 pm" / "Opens 11:30 am" — short enough for the call button. */
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
 * Phone-only bottom dock: three round quick actions (Menu, Map, WhatsApp)
 * and one wide saffron "Call to book" button with the live open status.
 * On the menu page the first button becomes the Thali (platter) with a live
 * dish count; dishes fly into it and it opens the platter sheet.
 * The phone icon gives a small ring every few seconds (CustomWiggle), and
 * every button dips when pressed. It never moves while scrolling.
 */
export function ActionDock() {
  const pathname = usePathname();
  const status = useShortStatus();
  const ring = useRef<HTMLSpanElement>(null);
  const lines = usePlatter();
  const thaliOpen = usePlatterOpen();
  const onMenu = pathname === "/menu";
  const count = platterCount(lines);

  useGSAP(() => {
    if (!ring.current || prefersReducedMotion()) return;
    gsap.to(ring.current, { rotation: 14, duration: 0.9, ease: "heat", repeat: -1, repeatDelay: 4.5, delay: 3 });
  });

  return (
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[46] lg:hidden"
    >
      <div className="flex items-stretch gap-1.5 rounded-[1.6rem] bg-night p-2 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.75)] ring-1 ring-cream/10">
        {onMenu && (
          <button
            type="button"
            data-thali-target
            onClick={() => platter.setOpen(!thaliOpen)}
            aria-expanded={thaliOpen}
            aria-label={`Your thali: ${count} ${count === 1 ? "dish" : "dishes"}`}
            className="flex w-[3.25rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl py-1.5 transition-transform duration-150 active:scale-90"
          >
            <span className={cn("relative flex h-9 w-9 items-center justify-center rounded-full transition-colors", thaliOpen ? "bg-cream text-night" : "bg-saffron text-night")}>
              <Icon name="plate" className="h-[1.15rem] w-[1.15rem]" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-chilli px-1 text-[0.6rem] font-bold text-cream tabular-nums">
                  {count}
                </span>
              )}
            </span>
            <span className="text-[0.62rem] leading-none font-semibold tracking-wide text-saffron">Thali</span>
          </button>
        )}
        {QUICK.filter((a) => !(onMenu && a.route === "/menu")).map((a) => {
          const here = a.route === pathname;
          const inner = (
            <>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  a.tone === "whatsapp" ? "bg-whatsapp text-night" : here ? "bg-saffron text-night" : "bg-night-soft text-cream",
                )}
              >
                <Icon name={a.icon} className="h-[1.15rem] w-[1.15rem]" />
              </span>
              <span className={cn("text-[0.62rem] leading-none font-semibold tracking-wide", here ? "text-saffron" : "text-mist")}>{a.label}</span>
            </>
          );
          const cls =
            "flex w-[3.25rem] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl py-1.5 transition-transform duration-150 active:scale-90";
          return a.external ? (
            <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className={cls}>
              {inner}
            </a>
          ) : (
            <Link key={a.label} href={a.href} aria-current={here ? "page" : undefined} className={cls}>
              {inner}
            </Link>
          );
        })}

        <a
          href={phoneHref}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[1.2rem] bg-saffron pr-2 pl-2.5 text-night transition-transform duration-150 active:scale-[0.97]"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-night text-saffron">
            <span ref={ring} className="inline-flex">
              <Icon name="phone" className="h-5 w-5" />
            </span>
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-[0.95rem] leading-tight font-extrabold tracking-tight">Call to book</span>
            <span className="truncate text-[0.68rem] leading-tight font-semibold text-night/70">{status}</span>
          </span>
        </a>
      </div>
    </nav>
  );
}
