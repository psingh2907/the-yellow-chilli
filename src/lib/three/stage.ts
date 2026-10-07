/**
 * A small Three.js stage for one canvas.
 *
 *  - GSAP owns the clock: frames are rendered from gsap.ticker, so WebGL
 *    and DOM animations share one loop and never drift apart.
 *  - It renders only while the canvas is on screen (IntersectionObserver).
 *  - Pixel ratio is capped (lower on phones) to protect battery and frame rate.
 *
 * Three.js is imported dynamically by callers, so it never lands in the
 * first-load bundle.
 */
import type * as THREE_NS from "three";
import { gsap } from "@/lib/gsap";

export type Three = typeof THREE_NS;

export interface Stage {
  THREE: Three;
  renderer: THREE_NS.WebGLRenderer;
  scene: THREE_NS.Scene;
  camera: THREE_NS.PerspectiveCamera;
  /** Seconds since the stage started. */
  elapsed: () => number;
  /** Called every rendered frame (before render). */
  onFrame: (fn: (time: number, delta: number) => void) => void;
  /**
   * Compiles every shader and uploads every texture now. Three.js otherwise
   * does it the first time each object is drawn, which freezes the page for
   * a few hundred ms in the middle of a scroll.
   */
  warmUp: () => Promise<void>;
  dispose: () => void;
  isMobile: boolean;
}

/** True when WebGL is available and the device is not asking us to save data. */
export function canUseWebGL(): boolean {
  try {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return false;
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export async function createStage(canvas: HTMLCanvasElement, { fov = 35, alpha = true } = {}): Promise<Stage> {
  const THREE = await import("three");
  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha, powerPreference: "high-performance" });
  // 1.5× is visually indistinguishable on these soft, glossy scenes and
  // renders ~25% fewer pixels than 1.75× (a full-screen hero on a Retina laptop).
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // A lost GPU context paints the canvas opaque white; hide it so the
  // section's own dark background shows instead.
  const onLost = (e: Event) => {
    e.preventDefault();
    canvas.style.opacity = "0";
  };
  canvas.addEventListener("webglcontextlost", onLost);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const frames: Array<(t: number, d: number) => void> = [];
  const start = performance.now();
  let last = start;
  let visible = false;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
  io.observe(canvas);

  const tick = () => {
    const now = performance.now();
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    const t = (now - start) / 1000;
    for (const fn of frames) fn(t, delta);
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  return {
    THREE,
    renderer,
    scene,
    camera,
    isMobile,
    elapsed: () => (performance.now() - start) / 1000,
    onFrame: (fn) => frames.push(fn),
    warmUp: async () => {
      scene.traverse((obj) => {
        const mat = (obj as THREE_NS.Mesh).material as THREE_NS.Material | THREE_NS.Material[] | undefined;
        for (const m of Array.isArray(mat) ? mat : mat ? [mat] : []) {
          const map = (m as THREE_NS.MeshBasicMaterial).map;
          if (map) renderer.initTexture(map);
        }
      });
      if (scene.environment) renderer.initTexture(scene.environment);
      await renderer.compileAsync(scene, camera);
    },
    dispose: () => {
      gsap.ticker.remove(tick);
      canvas.removeEventListener("webglcontextlost", onLost);
      ro.disconnect();
      io.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as THREE_NS.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE_NS.Material | THREE_NS.Material[] | undefined;
        (Array.isArray(mat) ? mat : mat ? [mat] : []).forEach((m) => m.dispose());
      });
      renderer.dispose();
      // Hand the GPU context back rather than waiting for the browser to get
      // round to it: navigating away and back would otherwise stack up live
      // WebGL contexts (and graphics memory) on phones and busy browsers.
      // Only when the canvas has really left the page: React Strict Mode
      // (dev) re-runs effects on the SAME canvas, and a context we force-lost
      // can never be revived, which left the hero blank.
      setTimeout(() => {
        if (!canvas.isConnected) renderer.forceContextLoss();
      }, 0);
    },
  };
}
