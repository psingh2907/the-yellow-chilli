"use client";

import { useEffect, useRef, useState } from "react";
import type * as T from "three";
import { DishArt, dishSvgMarkup, specForDish } from "@/components/ui/DishArt";
import { signatureItems } from "@/data/menu";
import { cn } from "@/lib/cn";
import { lazyDraggable } from "@/lib/draggable";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { canUseWebGL, createStage } from "@/lib/three/stage";
import { useClientValue } from "@/lib/useClient";


type Layout = "ring" | "sphere" | "spiral";
const LAYOUTS: Array<{ id: Layout; label: string }> = [
  { id: "ring", label: "Ring" },
  { id: "sphere", label: "Sphere" },
  { id: "spiral", label: "Spiral" },
];

const dishes = signatureItems.map((d, i) => ({ ...d, spec: specForDish(d.name, undefined, i + 3) }));

function layoutPositions(layout: Layout, n: number): Array<[number, number, number]> {
  return Array.from({ length: n }, (_, i) => {
    const t = i / n;
    if (layout === "ring") {
      const a = t * Math.PI * 2;
      return [Math.sin(a) * 4.2, Math.sin(a * 2) * 0.25, Math.cos(a) * 4.2];
    }
    if (layout === "sphere") {
      // Fibonacci sphere: even spacing.
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      return [Math.cos(a) * r * 3.8, y * 3, Math.sin(a) * r * 3.8];
    }
    const a = t * Math.PI * 4;
    return [Math.sin(a) * 3.6, (t - 0.5) * 5.4, Math.cos(a) * 3.6];
  });
}

/** Renders a dish illustration + its name to a canvas texture. */
async function dishTexture(THREE: typeof import("three"), name: string, price: number, svg: string): Promise<T.CanvasTexture> {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size * 1.25;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#151a30";
  ctx.beginPath();
  ctx.roundRect(0, 0, canvas.width, canvas.height, 36);
  ctx.fill();
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  ctx.drawImage(img, 36, 30, size - 72, (size - 72) * 1.04);
  ctx.fillStyle = "#fbf3e4";
  // next/font renames families, so read the real one from the CSS variable.
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() || "system-ui, sans-serif";
  ctx.font = `700 38px ${family}`;
  ctx.textAlign = "center";
  ctx.fillText(name.length > 22 ? `${name.slice(0, 21)}…` : name, size / 2, size * 1.25 - 66);
  ctx.fillStyle = "#f4a521";
  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillText(`₹${price}`, size / 2, size * 1.25 - 24);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * "The floating thali" (after Pahāri's floating gallery): the signature
 * dishes hang in 3D space. Drag to spin, with momentum (Draggable +
 * Inertia on an invisible proxy, read by the render loop). The buttons
 * re-arrange the dishes between a ring, a sphere and a spiral, each plate
 * tweened to its new spot with a small stagger.
 */
export function FloatingGallery() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const proxy = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout>("ring");
  const [active, setActive] = useState(0);
  // null on the server, then whether this browser can show the 3D gallery.
  const webgl = useClientValue<boolean | null>(() => !prefersReducedMotion() && canUseWebGL(), null);
  const api = useRef<{ arrange: (l: Layout) => void } | null>(null);

  useEffect(() => {
    if (!webgl) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const el = canvas.current;
      if (!el || !proxy.current) return;
      const stage = await createStage(el, { fov: 40 });
      if (disposed) return stage.dispose();
      const { THREE, scene, camera } = stage;
      camera.position.set(0, 0.6, 10.5);
      camera.lookAt(0, 0, 0);

      const world = new THREE.Group();
      scene.add(world);
      // Shrink the arrangement to what the camera can see across (portrait phones).
      const fit = () => {
        const visW = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;
        world.scale.setScalar(Math.min(1, visW / 11));
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(el);
      const geo = new THREE.PlaneGeometry(1.7, 2.125);
      const meshes = await Promise.all(
        dishes.map(async (d, i) => {
          const tex = await dishTexture(THREE, d.name, d.price, dishSvgMarkup(d.spec, `g${i}`));
          const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
          mesh.userData.index = i;
          world.add(mesh);
          return mesh;
        }),
      );
      if (disposed) return stage.dispose();
      // Upload the 12 textures and compile now, not when the gallery scrolls in.
      await stage.warmUp();
      if (disposed) return stage.dispose();

      const place = (l: Layout, animate: boolean) => {
        const pos = layoutPositions(l, meshes.length);
        meshes.forEach((m, i) => {
          const [x, y, z] = pos[i];
          if (animate) gsap.to(m.position, { x, y, z, duration: 1.4, ease: "simmer", delay: i * 0.03 });
          else m.position.set(x, y, z);
        });
      };
      place("ring", false);
      api.current = { arrange: (l) => place(l, true) };

      // Spin: Draggable moves an invisible proxy; the loop eases toward it.
      let spin = 0;
      let current = 0;
      const proxyEl = proxy.current;
      const drag = lazyDraggable(proxyEl, {
        type: "x",
        trigger: el,
        inertia: true,
        onPress: () => gsap.to(el, { cursor: "grabbing", duration: 0 }),
        onRelease: () => gsap.to(el, { cursor: "grab", duration: 0 }),
      });

      // Hover / tap: raycast to find the dish under the pointer.
      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2(9, 9);
      let hovered: T.Mesh | null = null;
      const onPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      };
      const onTap = () => {
        if (hovered && !drag.active()) setActive(hovered.userData.index as number);
      };
      el.addEventListener("pointermove", onPointer);
      el.addEventListener("pointerdown", onPointer);
      el.addEventListener("click", onTap);

      const tmp = new THREE.Vector3();
      stage.onFrame((t, dt) => {
        spin += dt * 0.12;
        const target = spin + Number(gsap.getProperty(proxyEl, "x")) * 0.006;
        current += (target - current) * 0.08;
        world.rotation.y = current;
        world.rotation.x = Math.sin(t * 0.3) * 0.06;
        // Plates face outward from the centre.
        for (const m of meshes) {
          m.getWorldPosition(tmp);
          m.lookAt(tmp.x * 3, tmp.y * 1.2, tmp.z * 3);
        }
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(meshes, false)[0]?.object as T.Mesh | undefined;
        if (hit !== hovered) {
          if (hovered) gsap.to(hovered.scale, { x: 1, y: 1, duration: 0.4, ease: "chilli" });
          if (hit) gsap.to(hit.scale, { x: 1.18, y: 1.18, duration: 0.4, ease: "chilli" });
          hovered = hit ?? null;
          el.style.cursor = hit ? "pointer" : "grab";
        }
      });

      el.style.opacity = "1";
      cleanup = () => {
        ro.disconnect();
        drag.kill();
        el.removeEventListener("pointermove", onPointer);
        el.removeEventListener("pointerdown", onPointer);
        el.removeEventListener("click", onTap);
        meshes.forEach((m) => (m.material as T.MeshBasicMaterial).map?.dispose());
        stage.dispose();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [webgl]);

  const choose = (l: Layout) => {
    setLayout(l);
    api.current?.arrange(l);
  };
  const dish = dishes[active];

  return (
    <section aria-labelledby="gallery-title" className="relative overflow-hidden bg-night py-24 text-cream md:py-32">
      <div className="container-x flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="label text-saffron">The signatures</p>
          <h2 id="gallery-title" data-split className="display-lg mt-3 max-w-[14ch]">
            Twelve dishes people drive back for.
          </h2>
        </div>
        {webgl && (
          <div role="group" aria-label="Arrange the dishes" className="flex gap-2">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => choose(l.id)}
                aria-pressed={layout === l.id}
                className={cn(
                  "min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors",
                  layout === l.id ? "border-saffron bg-saffron text-night" : "border-cream/25 hover:border-saffron hover:text-saffron",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {webgl === false ? (
        <ul className="container-x mt-12 grid grid-cols-2 gap-6 md:grid-cols-4" data-reveal-stagger>
          {dishes.map((d) => (
            <li key={d.name} className="rounded-3xl bg-night-soft p-4">
              <DishArt spec={d.spec} className="w-full" />
              <p className="mt-3 font-display font-bold">{d.name}</p>
              <p className="text-sm text-saffron">₹{d.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative mt-6">
          <canvas
            ref={canvas}
            data-cursor="Drag"
            aria-label="Signature dishes floating in 3D. Drag to spin; tap a dish to read about it."
            className="h-[56svh] min-h-[24rem] w-full cursor-grab touch-pan-y opacity-0 transition-opacity duration-700 md:h-[70svh] md:min-h-[28rem]"
          />
          <div ref={proxy} className="pointer-events-none absolute top-0 left-0 h-px w-px opacity-0" aria-hidden="true" />
          <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
            <div className="max-w-md rounded-2xl bg-night/90 px-6 py-4 text-center">
              <p className="font-display text-xl font-bold">
                {dish.name} <span className="text-saffron">₹{dish.price}</span>
              </p>
              {dish.note && <p className="mt-1 text-sm text-mist">{dish.note}</p>}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
