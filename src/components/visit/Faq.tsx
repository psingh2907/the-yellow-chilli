"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

export interface FaqItem {
  q: string;
  a: string;
}

/** Accordion: answers open with a height tween (GSAP measures "auto"), the + turns into ×. */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const panels = useRef<Array<HTMLDivElement | null>>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const reduced = prefersReducedMotion();
    panels.current.forEach((p, k) => {
      if (!p) return;
      const show = k === next;
      gsap.to(p, { height: show ? "auto" : 0, opacity: show ? 1 : 0, duration: reduced ? 0 : 0.5, ease: "chilli", onComplete: () => ScrollTrigger.refresh() });
    });
    setOpen(next);
  };

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => (
        <li key={item.q}>
          <button type="button" onClick={() => toggle(i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-6 text-left">
            <span className="font-display text-xl font-bold md:text-2xl">{item.q}</span>
            <span aria-hidden="true" className={cn("text-3xl leading-none transition-transform duration-300", open === i && "rotate-45")}>
              +
            </span>
          </button>
          <div ref={(el) => void (panels.current[i] = el)} className="overflow-hidden" style={open === i ? undefined : { height: 0, opacity: 0 }}>
            <p className="max-w-2xl pb-6 text-lg text-muted">{item.a}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
