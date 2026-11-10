"use client";

import { Flip } from "gsap/Flip";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DishArt } from "@/components/ui/DishArt";
import { RecordArt } from "@/components/ui/RecordArt";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, ScrollSmoother } from "@/lib/gsap";
import { useIsClient } from "@/lib/useClient";

gsap.registerPlugin(Flip);

const MOMENTS = [
  {
    id: "welcome",
    title: "The welcome",
    text: "Guests walk into a room set for your occasion. Tell us what you're celebrating and how many are coming, and we'll plan the tables around it.",
    bg: "from-rose-deep to-[#4a0f24]",
    art: { kind: "shake" as const, tone: "#c8a07a", seed: 2 },
  },
  {
    id: "spread",
    title: "The spread",
    text: "Paneer tikka off the tandoor, sizzlers, Chinese, thalis and breads: build it from the full pure-veg menu, or ask for a set menu for the group.",
    bg: "from-gold-deep to-[#4a2c00]",
    art: { kind: "thali" as const, tone: "#2f9e57", seed: 4 },
  },
  {
    id: "song",
    title: "The song",
    text: "The lights dim, Veerji picks up the mic, and the next song is for your guest of honour. Tell us the name and the song when you book.",
    bg: "from-[#3a1a5a] to-[#140a28]",
    art: "record" as const,
  },
  {
    id: "cake",
    title: "The cake",
    text: "Candles, a cake, everyone singing along, and one more song before the night ends. Bring your own cake, or ask us when you book.",
    bg: "from-[#3b2414] to-night",
    art: { kind: "cake" as const, tone: "#7a2c14", seed: 8 },
  },
]

/**
 * Party "moments". Tapping a card expands it to fill the screen: Flip records
 * the card's box, the same card (matched by data-flip-id) is rendered as a
 * full-screen overlay in <body> (fixed positioning can't live inside the
 * smooth-scrolled page), and Flip animates between the two boxes, with the
 * illustration nested. Closing reverses it.
 */
export function Moments() {
  const [open, setOpen] = useState<string | null>(null);
  const state = useRef<Flip.FlipState | null>(null);
  const mounted = useIsClient();

  const toggle = (id: string | null) => {
    if (!prefersReducedMotion()) state.current = Flip.getState("[data-moment], [data-moment-art]");
    setOpen(id);
  };

  useLayoutEffect(() => {
    if (!state.current) return;
    Flip.from(state.current, { targets: "[data-moment], [data-moment-art]", duration: 0.75, ease: "simmer", nested: true, zIndex: 70 });
    if (open) gsap.from("[data-moment-text]", { opacity: 0, y: 30, duration: 0.6, delay: 0.35, ease: "groove" });
    state.current = null;
  }, [open]);

  useEffect(() => {
    ScrollSmoother.get()?.paused(!!open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && toggle(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const card = (m: (typeof MOMENTS)[number], expanded: boolean) => (
    <article
      data-moment
      data-flip-id={m.id}
      className={cn(
        "overflow-hidden bg-gradient-to-br text-cream",
        m.bg,
        expanded ? "fixed inset-3 z-[70] rounded-3xl md:inset-8" : "relative h-full rounded-3xl",
      )}
    >
      <button
        type="button"
        onClick={() => toggle(expanded ? null : m.id)}
        aria-expanded={expanded}
        className="flex h-full w-full flex-col justify-between p-6 text-left md:p-8"
      >
        <span className="flex items-start justify-between gap-4">
          <span className={cn("font-display font-extrabold tracking-tight", expanded ? "text-[clamp(2.5rem,7vw,6rem)] leading-[0.95]" : "text-2xl")}>{m.title}</span>
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream/15">
            <Icon name={expanded ? "close" : "arrow"} className="h-5 w-5" />
          </span>
        </span>
        <span className={cn("grid items-end gap-6", expanded && "md:grid-cols-[1fr_auto]")}>
          {expanded && (
            <span data-moment-text className="max-w-xl text-lg leading-relaxed text-cream/90 md:text-2xl">
              {m.text}
            </span>
          )}
          <span data-moment-art data-flip-id={`${m.id}-art`} className={cn("block", expanded ? "w-[min(70vw,26rem)] justify-self-center" : "w-3/4 justify-self-end")}>
            {m.art === "record" ? <RecordArt className="w-full" /> : <DishArt spec={m.art} className="w-full" />}
          </span>
        </span>
      </button>
    </article>
  );

  const current = MOMENTS.find((m) => m.id === open);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOMENTS.map((m) => (
          // The open card leaves the grid (its slot stays, empty) and lives in the overlay.
          <div key={m.id} className="aspect-[3/4]">
            {open !== m.id && card(m, false)}
          </div>
        ))}
      </div>
      {mounted &&
        current &&
        createPortal(
          <>
            <button type="button" aria-label="Close" onClick={() => toggle(null)} className="fixed inset-0 z-[65] bg-night/70 backdrop-blur-sm" />
            {card(current, true)}
          </>,
          document.body,
        )}
    </>
  );
}
