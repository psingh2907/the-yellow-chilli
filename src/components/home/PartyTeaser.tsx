"use client";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { StringLights } from "@/components/ui/StringLights";
import { business } from "@/data/business";
import { gsap, playWhileVisible, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(DrawSVGPlugin);

const OCCASIONS = ["Birthdays", "Anniversaries", "Kitty parties", "Baby showers", "Family dinners", "Office get-togethers"];

/**
 * Parties, in brief: the string lights' wire draws itself (DrawSVG), the
 * bulbs pop on one by one and then twinkle; the count of Google reviews
 * that mention a party here rolls up.
 */
export function PartyTeaser() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from("[data-wire]", { drawSVG: "0%", duration: 1.6, ease: "power2.inOut" })
          .from("[data-bulb]", { scale: 0, transformOrigin: "50% 0%", duration: 0.5, ease: "back.out(3)", stagger: { each: 0.025, from: "center" } }, 0.4)
          .from("[data-count]", { textContent: 0, duration: 1.8, ease: "power2.out", snap: { textContent: 1 } }, 0.2);
        playWhileVisible(root.current, [
          gsap.to("[data-lights-wrap]", { rotate: 1.2, transformOrigin: "50% 0%", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }),
          gsap.to("[data-bulb]", { opacity: 0.55, duration: 0.8, ease: "sine.inOut", stagger: { each: 0.15, from: "random", repeat: -1, yoyo: true } }),
        ]);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="party-title" className="relative overflow-hidden bg-rose-deep pt-10 pb-24 text-cream md:pb-32">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_100%,rgba(155,123,255,0.35),transparent_70%)]" />
      <div data-lights-wrap className="relative">
        <StringLights className="h-20 w-full md:h-28" />
      </div>
      <div className="relative container-x mt-10 grid items-end gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="label text-gold-light">Parties &amp; celebrations</p>
          <h2 id="party-title" data-split className="display-lg mt-3 max-w-[16ch]">
            Bring the cake. We&rsquo;ll bring the band.
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2" data-reveal-stagger>
            {OCCASIONS.map((o) => (
              <li key={o} className="rounded-full border border-cream/25 px-4 py-2 text-sm">
                {o}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-lg text-cream/85">Book a private room or the floor, choose your menu, and ask Veerji for a song dedicated to the person of the evening.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/parties" variant="solid" icon="cake">
              Plan a party
            </Button>
          </div>
        </div>
        <div className="text-left lg:text-right">
          <p className="font-display text-[clamp(5rem,16vw,12rem)] leading-[0.8] font-extrabold text-gold tabular-nums">
            <span data-count>{business.reviewMentions.party}</span>
          </p>
          <p className="mt-2 label text-cream/80">Google reviews that mention a party here</p>
        </div>
      </div>
    </section>
  );
}
