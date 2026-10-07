"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { formatTime, getOpenStatus } from "@/lib/hours";
import { business } from "@/data/business";

/** Cards rise in one after another when the footer scrolls into view. */
export function FooterReveal({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-card]", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "chilli",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root },
  );
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

/** Live "Open now · till 11:30 pm" badge (IST). */
export function OpenBadge() {
  const [state, setState] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const update = () => {
      const s = getOpenStatus();
      setState({ open: s.open, text: s.open ? `Open now · till ${formatTime(business.hours.closes)}` : `Closed · opens ${formatTime(business.hours.opens)}` });
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);
  const open = state?.open ?? true;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-cream/[0.07] py-1.5 pr-3.5 pl-2.5 text-xs font-semibold text-cream ring-1 ring-cream/10">
      <span className="relative flex h-2 w-2">
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-70" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${open ? "bg-leaf" : "bg-chilli"}`} />
      </span>
      {state?.text ?? `Open daily · till ${formatTime(business.hours.closes)}`}
    </span>
  );
}
