"use client";

import { useEffect, useRef } from "react";
import { ChilliMark } from "@/components/ui/ChilliMark";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";
import { createChilli } from "@/lib/three/chilli";
import { createSpice } from "@/lib/three/spice";
import { canUseWebGL, createStage } from "@/lib/three/stage";
import { useClientValue } from "@/lib/useClient";

/**
 * The hero's 3D layer: a glossy yellow chilli in a cloud of spice.
 *  - Pointer tilts it (gsap.quickTo on plain numbers, read each frame).
 *  - Scrolling the hero away scrubs a timeline that spins the chilli off
 *    and bursts the spice outward (a shader uniform tweened by GSAP).
 * Without WebGL, or for reduced motion, a still illustration stands in.
 */
export function HeroScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fallback = useClientValue(() => prefersReducedMotion() || !canUseWebGL(), false);

  useEffect(() => {
    if (fallback) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const el = canvas.current;
      if (!el) return;
      const stage = await createStage(el, { fov: 32 });
      if (disposed) return stage.dispose();
      const { THREE, scene, camera, renderer, isMobile } = stage;
      const { RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js");
      if (disposed) return stage.dispose();

      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();

      const BASE_Z = 8;
      camera.position.set(0, 0, BASE_Z);
      scene.environmentIntensity = 0.55;
      const key = new THREE.DirectionalLight("#fff1d6", 2.4);
      key.position.set(3, 4, 5);
      const rim = new THREE.DirectionalLight("#ff3b1f", 4);
      rim.position.set(-4, -1, -3);
      scene.add(key, rim, new THREE.AmbientLight("#3a2f60", 0.5));

      // placement: fitted to the viewport · rig: pointer tilt + scroll.
      const placement = new THREE.Group();
      const rig = new THREE.Group();
      const chilli = createChilli(THREE, { detail: isMobile ? 0.6 : 1 });
      chilli.rotation.set(0.1, -0.5, 0.35);
      rig.add(chilli);
      placement.add(rig);
      scene.add(placement);

      const spice = createSpice(THREE, isMobile ? 420 : 1800, renderer.getPixelRatio());
      placement.add(spice);

      // Keep the chilli beside the headline (desktop) or above it (portrait),
      // sized from what the camera can see at z = 0.
      const fit = () => {
        const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * BASE_Z;
        const visW = visH * camera.aspect;
        const portrait = camera.aspect < 0.9;
        const scale = (visH * (portrait ? 0.36 : 0.62)) / 3.8;
        placement.scale.setScalar(scale);
        placement.position.set(portrait ? visW * 0.16 : visW * 0.27, portrait ? visH * 0.2 : -visH * 0.02, 0);
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(el);

      // Compile shaders / upload textures before anything moves (no freeze later).
      await stage.warmUp();
      if (disposed) return stage.dispose();

      // Pointer tilt: quickTo tweens plain numbers; the frame loop reads them.
      const tilt = { x: 0, y: 0 };
      const toX = gsap.quickTo(tilt, "x", { duration: 1.2, ease: "power3" });
      const toY = gsap.quickTo(tilt, "y", { duration: 1.2, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        toX((e.clientY / window.innerHeight - 0.5) * 0.6);
        toY((e.clientX / window.innerWidth - 0.5) * 0.9);
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      const uniforms = spice.material.uniforms;
      stage.onFrame((t) => {
        uniforms.uTime.value = t;
        chilli.rotation.y += 0.0035;
        chilli.position.y = Math.sin(t * 0.9) * 0.08;
        rig.rotation.x = tilt.x;
        rig.rotation.z = -tilt.y * 0.25;
        spice.rotation.y = t * 0.03 + tilt.y * 0.3;
      });

      // Arrival: the chilli drops in with a little spin once the loader lifts.
      gsap.set(rig.scale, { x: 0.001, y: 0.001, z: 0.001 });
      const stopIntro = afterIntro(() => {
        gsap.to(rig.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: "elastic.out(1, 0.55)", delay: 0.15 });
        gsap.from(chilli.rotation, { y: chilli.rotation.y - Math.PI * 1.5, duration: 2, ease: "chilli", delay: 0.15 });
        gsap.from(uniforms.uBurst, { value: 0.6, duration: 2.2, ease: "simmer" });
      });

      // Scroll away: spin off, burst the spice.
      const section = el.closest("section");
      const scrub = gsap
        .timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 } })
        .to(uniforms.uBurst, { value: 1, ease: "none" }, 0)
        .to(rig.rotation, { y: Math.PI * 1.2, ease: "none" }, 0)
        .to(rig.position, { y: 2.6, ease: "none" }, 0)
        .to(camera.position, { z: BASE_Z + 2, ease: "none" }, 0);

      // A context lost during setup would show as a white sheet; keep the canvas hidden.
      if (!renderer.getContext().isContextLost()) el.style.opacity = "1";
      cleanup = () => {
        stopIntro();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        scrub.scrollTrigger?.kill();
        scrub.kill();
        scene.environment?.dispose();
        stage.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [fallback]);

  if (fallback) {
    return (
      <div aria-hidden="true" className="absolute inset-0 flex items-start justify-center pt-28 md:items-center md:justify-end md:pt-0 md:pr-[12vw]">
        <ChilliMark className="h-56 w-56 rotate-12 drop-shadow-[0_30px_60px_rgba(244,165,33,0.35)] md:h-[26rem] md:w-[26rem]" />
      </div>
    );
  }
  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />;
}
