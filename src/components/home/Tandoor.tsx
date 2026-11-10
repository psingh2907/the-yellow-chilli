"use client";

import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(MotionPathPlugin, Physics2DPlugin, ScrambleTextPlugin);

const KEBABS = [
  { name: "Paneer Tikka", price: 229, note: "Yoghurt, spice and charcoal. Where everyone starts.", color: "#e8893a" },
  { name: "Hariyali Chaap", price: 199, note: "Soya chaap in a green herb marinade, charred at the edges.", color: "#5f9a3a" },
  { name: "Paneer Malai Tikka", price: 259, note: "Cream, cheese and cardamom. The gentle one.", color: "#f0d9a8" },
  { name: "VRJ Special Paneer Parinda", price: 319, note: "The chef's own, and the one regulars point at.", color: "#c9461f" },
]

// Each skewer slides along this curve into the tandoor's mouth.
const INTO_TANDOOR = "M780,40 C620,10 470,60 420,170";

/**
 * The tandoor. Pinned; each scroll step sends one skewer along a curve
 * into the clay oven (MotionPath) while its name burns in (ScrambleText).
 * Embers rise continuously (Physics2D with negative gravity) and the glow
 * flickers with the "heat" CustomWiggle.
 */
export function Tandoor() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Embers relaunch themselves, but only while the tandoor is on screen:
        // off screen they'd keep rewriting styles every frame for nothing.
        const embers = gsap.utils.toArray<HTMLElement>("[data-ember]");
        const active = new Set<gsap.core.Tween>();
        let running = false;
        const launch = (el: HTMLElement) => {
          if (!running) return;
          const t = gsap.fromTo(
            el,
            { x: gsap.utils.random(-60, 60), y: 0, opacity: 1, scale: gsap.utils.random(0.5, 1.4) },
            {
              duration: gsap.utils.random(1.6, 3.2),
              physics2D: { velocity: gsap.utils.random(120, 260), angle: gsap.utils.random(-110, -70), gravity: -40, friction: 0.02 },
              opacity: 0,
              ease: "none",
              delay: gsap.utils.random(0, 1.5),
              onComplete: () => {
                active.delete(t);
                launch(el);
              },
            },
          );
          active.add(t);
        };
        const glow = gsap.to("[data-glow]", { scale: 1.08, opacity: 0.95, duration: 1.4, ease: "heat", repeat: -1, transformOrigin: "50% 50%", paused: true });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            running = self.isActive;
            if (running) {
              glow.resume();
              embers.forEach(launch);
            } else {
              glow.pause();
              active.forEach((t) => t.kill());
              active.clear();
              gsap.set(embers, { opacity: 0 });
            }
          },
        });

        const skewers = gsap.utils.toArray<SVGGElement>("[data-skewer]");
        const names = gsap.utils.toArray<HTMLElement>("[data-kebab]");
        gsap.set(names.slice(1), { autoAlpha: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${KEBABS.length * 70}%`, pin: true, anticipatePin: 1, scrub: 0.8 },
        });
        skewers.forEach((sk, i) => {
          tl.fromTo(
            sk,
            { opacity: 0 },
            { opacity: 1, duration: 0.15 },
            i,
          )
            .to(sk, { duration: 0.9, ease: "power2.in", motionPath: { path: INTO_TANDOOR, autoRotate: 200, alignOrigin: [0.5, 0.5] } }, i)
            .to(sk, { opacity: 0, duration: 0.1 }, i + 0.9);
          if (i > 0) {
            tl.to(names[i - 1], { autoAlpha: 0, y: -30, duration: 0.25 }, i)
              .fromTo(names[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.25 }, i + 0.1)
              .to(names[i].querySelector("[data-scramble]"), { scrambleText: { text: KEBABS[i].name, chars: "*#%&@/01", speed: 0.5 }, duration: 0.6 }, i + 0.1);
          }
        });
        // Embers launched from callbacks aren't tracked by the context: stop them on unmount.
        return () => {
          running = false;
          active.forEach((t) => t.kill());
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="tandoor-title" className="grain relative min-h-svh overflow-hidden bg-[#140806] text-cream">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_80%,rgba(226,65,47,0.45),transparent_70%)]" />
      <div className="relative z-10 container-x grid min-h-svh items-center gap-10 py-28 lg:grid-cols-2">
        <div>
          <p className="label text-gold">From the tandoor</p>
          <h2 id="tandoor-title" className="display-lg mt-3">
            Charcoal, clay
            <br />
            and paneer.
          </h2>
          <div className="relative mt-10 min-h-[9rem]">
            {KEBABS.map((k) => (
              <div key={k.name} data-kebab className="motion-safe:absolute motion-safe:inset-0 motion-reduce:mb-6">
                <p data-scramble className="font-display text-3xl font-bold text-gold md:text-4xl">
                  {k.name}
                </p>
                <p className="mt-2 text-mist">{k.note}</p>
                <p className="mt-2 font-semibold">₹{k.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <svg viewBox="0 0 800 1000" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <radialGradient id="mouth" cx="50%" cy="40%">
                <stop offset="0" stopColor="#ffd98a" />
                <stop offset="0.45" stopColor="#f2b544" />
                <stop offset="1" stopColor="#7a1a0c" />
              </radialGradient>
              <linearGradient id="clay" x1="0" x2="1">
                <stop offset="0" stopColor="#6b2d14" />
                <stop offset="0.5" stopColor="#a34a22" />
                <stop offset="1" stopColor="#5a2410" />
              </linearGradient>
            </defs>
            {/* Clay tandoor */}
            <path d="M285,222 C190,380 170,700 225,940 L575,940 C630,700 610,380 515,222 Z" fill="url(#clay)" />
            <ellipse cx="400" cy="222" rx="125" ry="34" fill="#3a1408" />
            <ellipse data-glow cx="400" cy="224" rx="104" ry="26" fill="url(#mouth)" opacity="0.8" />
            {[
              [236, 340, 564],
              [204, 520, 596],
              [196, 720, 604],
            ].map(([x0, y, x1]) => (
              <path key={y} d={`M${x0},${y} C330,${y + 22} 470,${y + 22} ${x1},${y}`} fill="none" stroke="#3a1408" strokeOpacity="0.35" strokeWidth="6" />
            ))}
            {/* Skewers, waiting off to the side */}
            {KEBABS.map((k, i) => (
              <g key={k.name} data-skewer transform="translate(780 40)" opacity={i === 0 ? 1 : 0}>
                <g transform="translate(-160 -10)">
                  <rect x="0" y="8" width="320" height="4" rx="2" fill="#c9c3b6" />
                  {[40, 90, 140, 190, 240].map((x) => (
                    <rect key={x} x={x} y="0" width="40" height="20" rx="9" fill={k.color} stroke="#2a1006" strokeOpacity="0.35" />
                  ))}
                  <circle cx="312" cy="10" r="9" fill="#8a8478" />
                </g>
              </g>
            ))}
          </svg>
          <div className="pointer-events-none absolute top-[21%] left-1/2" aria-hidden="true">
            {Array.from({ length: 26 }, (_, i) => (
              <span key={i} data-ember className="absolute h-1.5 w-1.5 rounded-full bg-gold opacity-0 will-change-transform shadow-[0_0_10px_3px_rgba(242,181,68,0.7)]" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
