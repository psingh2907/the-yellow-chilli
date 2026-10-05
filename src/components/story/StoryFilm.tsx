"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { DishArt, type DishSpec } from "@/components/ui/DishArt";
import { cn } from "@/lib/cn";
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText } from "@/lib/gsap";
import { buildFilm } from "@/lib/three/film";
import { canUseWebGL, createStage } from "@/lib/three/stage";
import { useClientValue } from "@/lib/useClient";

const CHAPTERS: Array<{ time: string; title: string; text: string; art: DishSpec }> = [
  { time: "Dawn", title: "A spice market.", text: "It starts with choosing: turmeric, red chilli, coriander, cumin, garam masala. Whole, then ground.", art: { kind: "curry", tone: "#c9581f", seed: 21 } },
  { time: "Noon", title: "The tandoor.", text: "A clay oven, charcoal at the bottom, heat that kebabs and naan need and gas can't give.", art: { kind: "kebab", tone: "#c0571f", seed: 22 } },
  { time: "Afternoon", title: "Dum.", text: "The handi is sealed with a ring of dough and left on low coals. No lifting the lid. No peeking.", art: { kind: "biryani", tone: "#e3b25a", seed: 23 } },
  { time: "Evening", title: "The thali.", text: "Dal, paneer, a kebab, raita, rice and a naan, each finding its place on brass.", art: { kind: "dal", tone: "#4a2416", seed: 24 } },
  { time: "Night", title: "Your table, Satna.", text: "NH-75, Panna Naka Road. The plate is ready when you are.", art: { kind: "dessert", tone: "#f3e6c8", seed: 25 } },
];

/**
 * "One Plate": a scroll-driven film rendered live with Three.js (after
 * Chasing the Moment's real-time web film). The section pins for six screens;
 * one scrubbed GSAP timeline moves a progress value that the camera follows
 * along a spline, swaps the chapter captions (SplitText), and drops the
 * katoris onto the thali with a bounce. No video file, nothing to download.
 */
export function StoryFilm() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const mode = useClientValue<"film" | "static" | null>(() => (prefersReducedMotion() || !canUseWebGL() ? "static" : "film"), null);

  useEffect(() => {
    if (mode !== "film") return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const el = canvas.current;
      if (!el || !root.current) return;
      const stage = await createStage(el, { fov: 42, alpha: false });
      if (disposed) return stage.dispose();
      const { THREE, scene, camera, renderer } = stage;
      renderer.setClearColor("#0d1020");
      // Brass and copper need something to reflect: a soft studio environment.
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (disposed) return stage.dispose();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.45;
      pmrem.dispose();
      const film = buildFilm(THREE, scene, { mobile: stage.isMobile });
      // Every chapter's materials compile now: otherwise each scene stalls
      // the page the first time it comes into view.
      await stage.warmUp();
      if (disposed) return stage.dispose();
      const pos = new THREE.Vector3();
      const look = new THREE.Vector3();
      const play = { t: 0 };
      // Katoris start high above the plate.
      const restY = film.katoris.map((k) => k.position.y);
      film.katoris.forEach((k) => (k.position.y += 3));

      stage.onFrame((time, dt) => {
        film.update(time, dt);
        film.cameraAt(play.t, pos, look);
        // Portrait screens see less sideways: step back along the view line.
        if (camera.aspect < 1) pos.sub(look).multiplyScalar(Math.min(1.9, 1 / camera.aspect)).add(look);
        // A little handheld drift so the camera never feels locked off.
        camera.position.set(pos.x + Math.sin(time * 0.5) * 0.06, pos.y + Math.sin(time * 0.7) * 0.05, pos.z);
        camera.lookAt(look);
      });

      const captions = gsap.utils.toArray<HTMLElement>("[data-film-caption]", root.current);
      const splits = captions.map((c) => SplitText.create(c.querySelector("h2"), { type: "words", mask: "words" }));
      gsap.set(captions, { autoAlpha: 0 });

      const n = CHAPTERS.length;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=600%", pin: true, anticipatePin: 1, scrub: 1 },
      });
      tl.to(play, { t: 1, duration: n }, 0);
      captions.forEach((c, i) => {
        tl.to(c, { autoAlpha: 1, duration: 0.2 }, i + 0.1)
          .from(splits[i].words, { yPercent: 110, stagger: 0.05, duration: 0.35, ease: "chilli" }, i + 0.1)
          .from(c.querySelector("p"), { opacity: 0, y: 20, duration: 0.3, ease: "chilli" }, i + 0.3);
        if (i < n - 1) tl.to(c, { autoAlpha: 0, duration: 0.2 }, i + 0.85);
      });
      // Plating: each katori drops in and settles with a bounce.
      film.katoris.forEach((k, i) => {
        tl.to(k.position, { y: restY[i], duration: 0.18, ease: "bounce.out" }, 3.05 + i * 0.1);
      });
      tl.fromTo("[data-film-progress]", { scaleX: 0 }, { scaleX: 1, duration: n, transformOrigin: "0 50%" }, 0);

      el.style.opacity = "1";
      // This pin was created after the triggers below it: re-order by page position, then measure.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      cleanup = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        splits.forEach((s) => s.revert());
        scene.environment?.dispose();
        stage.dispose();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [mode]);

  if (mode === "static") {
    return (
      <section aria-label="One Plate, in five chapters" className="bg-night py-16 text-cream">
        <ol className="container-x grid gap-10 md:grid-cols-2">
          {CHAPTERS.map((c, i) => (
            <li key={c.time} className="grid grid-cols-[6rem_1fr] items-center gap-6">
              <DishArt spec={c.art} className="w-24" />
              <div>
                <p className="label text-saffron">
                  0{i + 1} · {c.time}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">{c.title}</h2>
                <p className="mt-1 text-mist">{c.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section ref={root} aria-label="One Plate: a scroll film in five chapters" className="relative h-svh overflow-hidden bg-night text-cream">
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(13,16,32,0.85)_100%)]" />
      {CHAPTERS.map((c, i) => (
        <div key={c.time} data-film-caption className={cn("absolute inset-x-0 bottom-0 pb-24 lg:pb-16", mode === null && "invisible")}>
          <div className="container-x">
            <p className="label text-saffron">
              0{i + 1} / 0{CHAPTERS.length} · {c.time}
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] font-extrabold tracking-tight">{c.title}</h2>
            <p className="mt-3 max-w-lg text-lg text-cream/85">{c.text}</p>
            {i === CHAPTERS.length - 1 && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/menu" icon="book">
                  See the menu
                </Button>
                <Button href="/visit" variant="outline" icon="pin" className="text-cream">
                  Find us
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-night-line">
        <div data-film-progress className="h-full origin-left bg-saffron" />
      </div>
    </section>
  );
}
