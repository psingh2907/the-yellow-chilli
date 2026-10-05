"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Garland } from "@/components/ui/Garland";
import { gsap, playWhileVisible, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(DrawSVGPlugin);

const OCCASIONS = ["Weddings & receptions", "Birthdays", "Kitty parties", "Office dinners", "Anniversaries", "Family get-togethers"];

/**
 * Banquets, in brief: the garland's string draws itself (DrawSVG), then the
 * marigolds pop on one by one; the guest count rolls up to 400.
 */
export function BanquetTeaser() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-garland]", { drawSVG: "0%", duration: 1.6, ease: "power2.inOut" })
          .from("[data-marigold]", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(3)", stagger: { each: 0.025, from: "center" } }, 0.4)
          .from("[data-count]", { textContent: 0, duration: 1.8, ease: "power2.out", snap: { textContent: 1 } }, 0.2);
        playWhileVisible(root.current, [
          gsap.to("[data-garland-wrap]", { rotate: 1.2, transformOrigin: "50% 0%", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        ]);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="banquet-title" className="relative overflow-hidden bg-chilli-deep pt-10 pb-24 text-cream md:pb-32">
      <div data-garland-wrap>
        <Garland className="h-20 w-full md:h-28" />
      </div>
      <div className="container-x mt-10 grid items-end gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="label text-saffron-light">Banquets &amp; celebrations</p>
          <h2 id="banquet-title" data-split className="display-lg mt-3 max-w-[16ch]">
            Bring everyone. We&rsquo;ll bring the biryani.
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2" data-reveal-stagger>
            {OCCASIONS.map((o) => (
              <li key={o} className="rounded-full border border-cream/25 px-4 py-2 text-sm">
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/events" variant="solid">
              Plan an event
            </Button>
          </div>
        </div>
        <div className="text-left lg:text-right">
          <p className="font-display text-[clamp(5rem,16vw,12rem)] leading-[0.8] font-extrabold text-saffron tabular-nums">
            <span data-count>400</span>
          </p>
          <p className="mt-2 label text-cream/80">guests, around one table</p>
        </div>
      </div>
    </section>
  );
}
