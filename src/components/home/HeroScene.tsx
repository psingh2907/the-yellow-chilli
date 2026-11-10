"use client";

import { useEffect, useRef } from "react";
import type * as T from "three";
import { RecordArt } from "@/components/ui/RecordArt";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";
import { createConfetti } from "@/lib/three/confetti";
import { createRecord } from "@/lib/three/record";
import { canUseWebGL, createStage } from "@/lib/three/stage";
import { useClientValue } from "@/lib/useClient";

/**
 * The hero's 3D layer: a Veerji's record turning in a cloud of confetti.
 *  - Pointer tilts it (gsap.quickTo on plain numbers, read each frame).
 *  - Scrolling the hero away scrubs a timeline that flips the record off
 *    and bursts the confetti outward (a shader uniform tweened by GSAP).
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
      // The label's text is drawn with the display font: wait for it.
      await document.fonts?.ready;
      if (disposed) return stage.dispose();

      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();

      const BASE_Z = 8;
      camera.position.set(0, 0, BASE_Z);
      scene.environmentIntensity = 0.45;
      // Warm stage spot from above, a rose rim from behind.
      const key = new THREE.DirectionalLight("#ffe7c2", 2.6);
      key.position.set(3, 5, 5);
      const rim = new THREE.DirectionalLight("#ff4d7d", 5);
      rim.position.set(-4, -1, -3);
      scene.add(key, rim, new THREE.AmbientLight("#4a2a5a", 0.6));

      // placement: fitted to the viewport · rig: pointer tilt + scroll.
      const placement = new THREE.Group();
      const rig = new THREE.Group();
      const record = createRecord(THREE, { detail: isMobile ? 0.6 : 1 });
      const spinner = record.userData.spinner as T.Group;
      record.rotation.set(-0.42, -0.55, 0.18);
      rig.add(record);
      placement.add(rig);
      scene.add(placement);

      const confetti = createConfetti(THREE, isMobile ? 420 : 1600, renderer.getPixelRatio());
      placement.add(confetti);

      // Keep the record beside the headline (desktop) or above it (portrait),
      // sized from what the camera can see at z = 0.
      const fit = () => {
        const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * BASE_Z;
        const visW = visH * camera.aspect;
        const portrait = camera.aspect < 0.9;
        // Portrait: a smaller record tucked into the top right, above the copy.
        const scale = (visH * (portrait ? 0.2 : 0.6)) / 4;
        placement.scale.setScalar(scale);
        placement.position.set(portrait ? visW * 0.22 : visW * 0.26, portrait ? visH * 0.3 : -visH * 0.02, 0);
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

      // Turntable speed: a plain number GSAP can ramp up from rest.
      const deck = { rpm: 0 };
      const uniforms = confetti.material.uniforms;
      stage.onFrame((t, dt) => {
        uniforms.uTime.value = t;
        spinner.rotation.z -= dt * deck.rpm * 0.105;
        record.position.y = Math.sin(t * 0.9) * 0.08;
        rig.rotation.x = tilt.x;
        rig.rotation.y = tilt.y * 0.6;
        confetti.rotation.y = t * 0.03 + tilt.y * 0.3;
      });

      // Arrival: the record drops in and the turntable spins up to 33⅓.
      gsap.set(rig.scale, { x: 0.001, y: 0.001, z: 0.001 });
      const stopIntro = afterIntro(() => {
        gsap.to(rig.scale, { x: 1, y: 1, z: 1, duration: 1.6, ease: "elastic.out(1, 0.55)", delay: 0.15 });
        gsap.from(record.rotation, { x: record.rotation.x - Math.PI * 0.6, duration: 2, ease: "groove", delay: 0.15 });
        gsap.to(deck, { rpm: 33.3, duration: 2.4, ease: "power2.out", delay: 0.3 });
        gsap.from(uniforms.uBurst, { value: 0.6, duration: 2.2, ease: "simmer" });
      });

      // Scroll away: flip the record up and off, burst the confetti.
      const section = el.closest("section");
      const scrub = gsap
        .timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 } })
        .to(uniforms.uBurst, { value: 1, ease: "none" }, 0)
        .to(rig.rotation, { z: Math.PI * 0.5, ease: "none" }, 0)
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
      <div aria-hidden="true" className="absolute inset-0 flex items-start justify-center pt-28 md:items-center md:justify-end md:pt-0 md:pr-[10vw]">
        <RecordArt className="h-56 w-56 -rotate-12 drop-shadow-[0_30px_60px_rgba(242,181,68,0.3)] md:h-[26rem] md:w-[26rem]" />
      </div>
    );
  }
  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />;
}
