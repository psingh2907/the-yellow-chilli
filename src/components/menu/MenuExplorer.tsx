"use client";

import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChilliIcon } from "@/components/ui/Mark";
import { Icon } from "@/components/ui/Icon";
import { type Diet, dietLabel, menu, type MenuItem } from "@/data/menu";
import { cn } from "@/lib/cn";
import { lazyDraggable, type LazyDraggable } from "@/lib/draggable";
import { gsap, prefersReducedMotion, scrollToElement, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { siteConfig } from "@/config/site";
import { useIsClient } from "@/lib/useClient";
import { platter } from "./platter";

gsap.registerPlugin(Flip, MotionPathPlugin);

// Everything is veg, so the filters slice the menu by mood instead.
type MenuFilter = "all" | "signature" | "mild" | "budget";
const FILTERS: Array<{ id: MenuFilter; label: string }> = [
  { id: "all", label: "Everything" },
  { id: "signature", label: "Favourites" },
  { id: "mild", label: "Mild" },
  { id: "budget", label: "Under ₹150" },
];

const matches = (item: MenuItem, filter: MenuFilter, query: string) => {
  if (filter === "signature" && !item.signature) return false;
  if (filter === "mild" && item.heat !== 0) return false;
  if (filter === "budget" && item.price >= 150) return false;
  return !query || item.name.toLowerCase().includes(query) || item.note?.toLowerCase().includes(query);
};

function DietMark({ diet }: { diet: Diet }) {
  const color = diet === "veg" ? "border-leaf text-leaf" : diet === "egg" ? "border-gold-deep text-gold-deep" : "border-rose-deep text-rose-deep";
  return (
    <span title={dietLabel[diet]} className={cn("inline-flex h-4 w-4 shrink-0 items-center justify-center border-2", color)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="sr-only">{dietLabel[diet]}</span>
    </span>
  );
}

/** Sends a little gold dot on an arc from the button to the thali. */
function flyToThali(from: HTMLElement) {
  // The visible target: the floating plate (desktop) or the dock's Thali button (phones).
  const thali = [...document.querySelectorAll("[data-thali-target]")].find((el) => el.getClientRects().length > 0);
  if (!thali || prefersReducedMotion()) return;
  const a = from.getBoundingClientRect();
  const b = thali.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "pointer-events-none fixed top-0 left-0 z-[80] h-4 w-4 rounded-full bg-gold shadow-[0_0_20px_rgba(242,181,68,0.8)]";
  document.body.appendChild(dot);
  const start = { x: a.left + a.width / 2 - 8, y: a.top + a.height / 2 - 8 };
  const end = { x: b.left + b.width / 2 - 8, y: b.top + b.height / 2 - 8 };
  const mid = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 160 };
  gsap.timeline({ onComplete: () => dot.remove() })
    .fromTo(dot, { x: start.x, y: start.y, scale: 0.4 }, { duration: 0.8, ease: "power1.inOut", scale: 1, motionPath: { path: [start, mid, end], curviness: 1.4 } })
    .to(dot, { scale: 0, duration: 0.2 })
    .to(thali, { scale: 1.15, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }, "<");
}

interface BarProps {
  filter: MenuFilter;
  onFilter: (f: MenuFilter) => void;
  query: string;
  onQuery: (q: string) => void;
  /** The floating copy: hidden from assistive tech until it slides in. */
  floating?: boolean;
}

/** Filters, search and the category rail. Rendered twice: in the page, and as a floating toolbar. */
function FilterBar({ filter, onFilter, query, onQuery, floating }: BarProps) {
  return (
    <>
      <div className="container-x flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter dishes" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => onFilter(f.id)}
              className={cn(
                "min-h-10 rounded-full px-4 text-sm font-semibold transition-colors",
                filter === f.id ? "bg-ink text-cream" : "bg-paper hover:bg-paper/60",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <label className="relative flex items-center">
          <span className="sr-only">Search the menu</span>
          <input
            type="search"
            value={query}
            placeholder="Search: paneer, sizzler, dosa…"
            onChange={(e) => onQuery(e.target.value)}
            className="min-h-10 w-full rounded-full border border-ink/15 bg-white px-4 text-sm placeholder:text-muted focus:border-gold focus:outline-none md:w-72"
          />
        </label>
      </div>
      <div className="container-x overflow-hidden pb-3" data-cursor="Drag">
        <div data-rail className="flex w-max touch-pan-y gap-1.5">
          {menu.map((c, i) => (
            <button
              key={c.id}
              type="button"
              data-chip={c.id}
              tabIndex={floating ? -1 : undefined}
              onClick={() => scrollToElement(`#${c.id}`, 150)}
              // The active chip is switched by toggling classes directly (see
              // setActiveChip), so scrolling never re-renders the menu.
              className={cn(
                "label min-h-9 rounded-full px-3 whitespace-nowrap transition-colors hover:text-ink",
                i === 0 ? "bg-gold text-night" : "text-muted",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const railDrags = new WeakMap<Element, LazyDraggable>();

/** Highlights the category on screen in both rails and slides it into view. */
function setActiveChip(id: string) {
  document.querySelectorAll<HTMLElement>("[data-chip]").forEach((chip) => {
    const on = chip.dataset.chip === id;
    chip.classList.toggle("bg-gold", on);
    chip.classList.toggle("text-night", on);
    chip.classList.toggle("text-muted", !on);
  });
  document.querySelectorAll<HTMLElement>("[data-rail]").forEach((rail) => {
    const chip = rail.querySelector<HTMLElement>(`[data-chip="${id}"]`);
    if (!chip || railDrags.get(rail)?.active()) return;
    const viewport = rail.parentElement!.clientWidth;
    const max = Math.max(0, rail.scrollWidth - viewport);
    const x = -gsap.utils.clamp(0, max, chip.offsetLeft - viewport / 2 + chip.offsetWidth / 2);
    gsap.to(rail, { x, duration: 0.6, ease: "groove", overwrite: "auto" });
  });
}

/**
 * The full menu.
 *  - Filters (favourites, mild, budget) and search re-flow the cards with Flip
 *    (cards that stay glide to their new spots; others fade in and out).
 *  - The category rail is draggable with momentum (Draggable + Inertia) and
 *    tracks the category on screen (ScrollTrigger); tapping one scrolls there.
 *  - Once the in-page toolbar scrolls away, a floating copy slides in at the
 *    top of the screen. It's fixed (outside the smooth-scrolled content), so
 *    unlike a ScrollTrigger pin it costs nothing per frame.
 *  - "+" adds a dish to the platter; a dot flies to the thali (MotionPath).
 */
export function MenuExplorer() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const floating = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState<MenuFilter>("all");
  const [query, setQuery] = useState("");
  const [floatingShown, setFloatingShown] = useState(false);
  const mounted = useIsClient();

  // The input keeps what was typed (spaces included); matching uses the trimmed text.
  const q = query.trim().toLowerCase();
  const visibleCount = useMemo(() => menu.reduce((n, c) => n + c.items.filter((i) => matches(i, filter, q)).length, 0), [filter, q]);

  const capture = () => {
    if (root.current && !prefersReducedMotion()) flipState.current = Flip.getState(root.current.querySelectorAll("[data-item], [data-cat]"));
  };
  const onFilter = (f: MenuFilter) => {
    capture();
    setFilter(f);
  };
  const onQuery = (q: string) => {
    capture();
    setQuery(q);
  };

  useLayoutEffect(() => {
    // A new filter shortens or lengthens the page: start from the top of the list.
    if (root.current && root.current.getBoundingClientRect().top < 0) scrollToElement(root.current, 0);
    if (!flipState.current || !root.current) return;
    Flip.from(flipState.current, {
      targets: root.current.querySelectorAll("[data-item], [data-cat]"),
      duration: 0.6,
      ease: "groove",
      // Not absolute: cards stay in the page flow while they move, so the
      // page height doesn't collapse mid-animation.
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5, ease: "groove", clearProps: "opacity,transform" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    flipState.current = null;
  }, [filter, q]);

  // The floating toolbar slides in once the in-page one has scrolled away,
  // and out again after the last dish. One toggle per crossing, nothing per frame.
  useGSAP(
    () => {
      if (!mounted) return;
      // Start tucked away above the screen (set before the trigger, which may
      // be active straight away if the page loads part-way down the menu).
      gsap.set(floating.current, { yPercent: -110 });
      const st = ScrollTrigger.create({
        trigger: bar.current,
        start: "bottom top",
        endTrigger: root.current,
        end: "bottom 30%",
        onToggle: (self) => {
          setFloatingShown(self.isActive);
          document.documentElement.classList.toggle("hide-nav", self.isActive);
          gsap.to(floating.current, { yPercent: self.isActive ? 0 : -110, duration: 0.45, ease: self.isActive ? "groove" : "power2.in", overwrite: true });
        },
      });
      // Which category is on screen (classes only: no React render while scrolling).
      const trackers = gsap.utils
        .toArray<HTMLElement>("[data-cat]", root.current)
        .map((el) => ScrollTrigger.create({ trigger: el, start: "top 40%", end: "bottom 40%", onToggle: (self) => self.isActive && setActiveChip(el.id) }));
      // Draggable rails with momentum, bounded to their own width.
      const drags = gsap.utils.toArray<HTMLElement>("[data-rail]").map((rail) => {
        const d = lazyDraggable(rail, { type: "x", bounds: rail.parentElement!, inertia: true, edgeResistance: 0.85, dragClickables: true, minimumMovement: 6 });
        railDrags.set(rail, d);
        return d;
      });
      return () => {
        document.documentElement.classList.remove("hide-nav");
        st.kill();
        trackers.forEach((t) => t.kill());
        drags.forEach((d) => d.kill());
      };
    },
    { dependencies: [mounted] },
  );

  return (
    <div ref={root} className="relative bg-cream text-ink">
      <div ref={bar} className="relative z-20 border-b border-ink/10 bg-cream">
        <FilterBar filter={filter} onFilter={onFilter} query={query} onQuery={onQuery} />
      </div>
      {mounted &&
        createPortal(
          <div
            ref={floating}
            aria-hidden={!floatingShown}
            inert={!floatingShown}
            className={cn("fixed inset-x-0 z-[52] border-b border-ink/10 bg-cream text-ink shadow-[0_10px_30px_-20px_rgba(0,0,0,0.5)]", siteConfig.prototypeMode ? "top-8" : "top-0")}
          >
            <FilterBar filter={filter} onFilter={onFilter} query={query} onQuery={onQuery} floating />
          </div>,
          document.body,
        )}

      <p className="container-x pt-6 text-sm text-muted" aria-live="polite">
        Showing {visibleCount} dishes
      </p>

      <div className="container-x pb-24">
        {menu.map((c) => {
          const items = c.items.filter((i) => matches(i, filter, q));
          return (
            <section key={c.id} id={c.id} data-cat data-flip-id={`cat-${c.id}`} aria-labelledby={`${c.id}-title`} className={cn("pt-12", !items.length && "hidden")}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-3">
                <h2 id={`${c.id}-title`} className="font-display text-[clamp(1.8rem,4vw,3rem)] leading-none font-extrabold tracking-tight">
                  {c.title}
                </h2>
                <p className="text-sm text-muted">{c.blurb}</p>
              </div>
              <ul className="mt-2 grid gap-x-10 md:grid-cols-2">
                {c.items.map((item) => {
                  const shown = matches(item, filter, q);
                  return (
                    <li
                      key={item.name}
                      data-item
                      data-flip-id={`${c.id}-${item.name}`}
                      className={cn("flex items-start gap-4 border-b border-ink/10 py-4", !shown && "hidden")}
                    >
                      <DietMark diet={item.diet} />
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-x-2 font-display text-lg leading-snug font-bold">
                          {item.name}
                          {item.signature && <span className="rounded-full bg-gold px-2 py-0.5 text-[0.65rem] font-bold tracking-wider text-night uppercase">Favourite</span>}
                        </p>
                        {item.note && <p className="mt-0.5 text-sm text-muted">{item.note}</p>}
                        <p className="mt-1 flex items-center gap-0.5" aria-label={`Heat ${item.heat + 1} of 4`}>
                          {Array.from({ length: item.heat + 1 }, (_, k) => (
                            <ChilliIcon key={k} className="h-3.5 w-3.5" />
                          ))}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-display font-bold tabular-nums">₹{item.price}</span>
                        <button
                          type="button"
                          aria-label={`Add ${item.name} to your platter`}
                          onClick={(e) => {
                            platter.add(item.name, item.price);
                            flyToThali(e.currentTarget);
                          }}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream transition-colors hover:bg-gold hover:text-night"
                        >
                          <span aria-hidden="true" className="text-xl leading-none">+</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {visibleCount === 0 && (
          <p className="py-24 text-center text-lg text-muted">
            Nothing matches &ldquo;{query}&rdquo;. Try &ldquo;paneer&rdquo; or &ldquo;dosa&rdquo;.{" "}
            <Icon name="flame" className="inline h-5 w-5 text-rose" />
          </p>
        )}
        <p className="mt-12 text-sm text-muted">
          A pure-vegetarian kitchen. Prices as listed on the restaurant&rsquo;s Zomato page (October 2026); dine-in prices may differ slightly. Heat levels are our own guide.
        </p>
      </div>
    </div>
  );
}
