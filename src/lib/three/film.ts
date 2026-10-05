/**
 * "One Plate": a small world built entirely from code, laid out along the
 * x axis, one set per chapter:
 *   0 market   cones of ground spice on a wooden table, dust in the light
 *   1 tandoor  a clay oven glowing from inside, embers rising
 *   2 dum      a copper handi sealed with a ring of dough, steam escaping
 *   3 thali    a brass plate; katoris drop into place (driven by GSAP)
 *   4 table    the same thali seen from further back, with warm bokeh
 */
import type * as T from "three";
import type { Three } from "./stage";

export const CHAPTER_X = [0, 16, 32, 48, 48];

export interface Film {
  /** Camera position / look-at along the whole film, t in 0…1. */
  cameraAt: (t: number, pos: T.Vector3, look: T.Vector3) => void;
  /** Katoris and food on the thali, in drop order (GSAP animates .position.y). */
  katoris: T.Object3D[];
  /** Per-frame motion (embers, steam, dust, flicker). */
  update: (time: number, delta: number) => void;
}

let softDot: T.Texture | null = null;
/** A soft round sprite, so points read as glowing specks rather than squares. */
function dotTexture(THREE: Three): T.Texture {
  if (softDot) return softDot;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  softDot = new THREE.CanvasTexture(c);
  return softDot;
}

function particles(THREE: Three, count: number, color: string, size: number) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const mat = new THREE.PointsMaterial({
    color,
    size,
    map: dotTexture(THREE),
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

function lathe(THREE: Three, profile: Array<[number, number]>, material: T.Material, segments = 48) {
  return new THREE.Mesh(new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), segments), material);
}

export function buildFilm(THREE: Three, scene: T.Scene, { mobile = false } = {}): Film {
  const wood = new THREE.MeshStandardMaterial({ color: "#5a3a22", roughness: 0.8 });
  const brass = new THREE.MeshStandardMaterial({ color: "#c9a24a", roughness: 0.32, metalness: 0.85 });
  const copper = new THREE.MeshStandardMaterial({ color: "#b5603a", roughness: 0.35, metalness: 0.8 });
  const clay = new THREE.MeshStandardMaterial({ color: "#9a4a24", roughness: 0.9 });
  const dough = new THREE.MeshStandardMaterial({ color: "#efd9a8", roughness: 0.95 });

  scene.fog = new THREE.Fog("#0d1020", 14, 34);
  scene.add(new THREE.HemisphereLight("#ffe6c0", "#1a1430", 0.9));
  const key = new THREE.DirectionalLight("#ffe2b8", 1.6);
  key.position.set(30, 14, 12);
  key.target.position.set(30, 0, 0);
  scene.add(key, key.target);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 40), new THREE.MeshStandardMaterial({ color: "#151a30", roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(30, -1.2, 0);
  scene.add(floor);

  // ── 0 · Market ────────────────────────────────────────────────
  const market = new THREE.Group();
  const table = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 5), wood);
  table.position.y = -1;
  market.add(table);
  const spices = ["#e8b21a", "#c62d1f", "#6b8f3a", "#6b3a1e", "#a8743a", "#d9582a"];
  spices.forEach((c, i) => {
    const x = (i % 3) * 2.6 - 2.6;
    const z = Math.floor(i / 3) * 2 - 1;
    const bowl = lathe(THREE, [[0, 0], [0.95, 0], [1.05, 0.25], [1.0, 0.3]], brass);
    bowl.position.set(x, -0.8, z);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.85, 0.9 + (i % 2) * 0.3, 40), new THREE.MeshStandardMaterial({ color: c, roughness: 1 }));
    cone.position.set(x, -0.3 + (i % 2) * 0.15, z);
    market.add(bowl, cone);
  });
  const sun = new THREE.PointLight("#ffcf8a", 60, 20);
  sun.position.set(-3, 5, 4);
  market.add(sun);
  const dust = particles(THREE, mobile ? 120 : 300, "#ffd27a", 0.12);
  market.add(dust);
  market.position.x = CHAPTER_X[0];
  scene.add(market);

  // ── 1 · Tandoor ───────────────────────────────────────────────
  const tandoor = new THREE.Group();
  const oven = lathe(THREE, [[0, -1.2], [1.9, -1.2], [2.0, 0], [1.6, 1.6], [1.05, 2.2], [0.9, 2.25], [0.95, 2.1]], clay);
  oven.material.side = THREE.DoubleSide;
  tandoor.add(oven);
  const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.9, 40), new THREE.MeshBasicMaterial({ color: "#ff9a2e" }));
  mouth.rotation.x = -Math.PI / 2;
  mouth.position.y = 2.05;
  tandoor.add(mouth);
  const fire = new THREE.PointLight("#ff7a1a", 40, 10);
  fire.position.y = 2.6;
  tandoor.add(fire);
  const embers = particles(THREE, mobile ? 90 : 220, "#ffb347", 0.18);
  tandoor.add(embers);
  tandoor.position.x = CHAPTER_X[1];
  scene.add(tandoor);

  // ── 2 · Dum ───────────────────────────────────────────────────
  const dum = new THREE.Group();
  const handi = lathe(THREE, [[0, -1.1], [1.1, -1.1], [1.7, -0.4], [1.75, 0.3], [1.35, 0.9], [1.3, 1.0]], copper);
  dum.add(handi);
  const lid = lathe(THREE, [[0, 1.45], [0.5, 1.4], [1.3, 1.05], [1.38, 0.98]], copper);
  dum.add(lid);
  const seal = new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.13, 16, 64), dough);
  seal.rotation.x = Math.PI / 2;
  seal.position.y = 0.98;
  dum.add(seal);
  const handiLight = new THREE.PointLight("#ffd9a8", 30, 10);
  handiLight.position.set(-2, 3.5, 3);
  dum.add(handiLight);
  const coals = new THREE.PointLight("#ff6a1a", 18, 6);
  coals.position.y = -1.6;
  dum.add(coals);
  const steam = particles(THREE, mobile ? 80 : 180, "#fbf3e4", 0.5);
  (steam.material as T.PointsMaterial).blending = THREE.NormalBlending;
  (steam.material as T.PointsMaterial).opacity = 0.35;
  dum.add(steam);
  dum.position.x = CHAPTER_X[2];
  scene.add(dum);

  // ── 3/4 · Thali on the table ──────────────────────────────────
  const thali = new THREE.Group();
  const dinner = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 7), wood);
  dinner.position.y = -0.7;
  thali.add(dinner);
  const plate = lathe(THREE, [[0, 0], [2.3, 0], [2.45, 0.18], [2.4, 0.22]], brass, 64);
  plate.position.y = -0.5;
  thali.add(plate);
  const katoris: T.Object3D[] = [];
  const foods = ["#4a2416", "#d2632a", "#3f6a35", "#f3e6c8", "#c9581f"];
  foods.forEach((c, i) => {
    const a = (i / foods.length) * Math.PI * 1.4 + Math.PI * 0.8;
    const k = new THREE.Group();
    const bowl = lathe(THREE, [[0, 0], [0.42, 0], [0.5, 0.3], [0.48, 0.32]], brass, 32);
    const food = new THREE.Mesh(new THREE.CircleGeometry(0.44, 32), new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 }));
    food.rotation.x = -Math.PI / 2;
    food.position.y = 0.26;
    k.add(bowl, food);
    k.position.set(Math.cos(a) * 1.55, -0.32, Math.sin(a) * 1.55);
    thali.add(k);
    katoris.push(k);
  });
  const rice = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#f3e3bf", roughness: 0.9 }));
  rice.scale.y = 0.6;
  rice.position.set(0.3, -0.32, 0.4);
  thali.add(rice);
  katoris.push(rice);
  const naan = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.06, 32), new THREE.MeshStandardMaterial({ color: "#e8c27c", roughness: 0.9 }));
  naan.scale.set(1.2, 1, 0.7);
  naan.position.set(-0.6, -0.28, 0.9);
  thali.add(naan);
  katoris.push(naan);
  const lamp = new THREE.PointLight("#ffd27a", 30, 12);
  lamp.position.set(0, 4, 2);
  thali.add(lamp);
  // Bokeh: soft warm lights in the dark behind the table.
  const bokeh = particles(THREE, mobile ? 30 : 60, "#f4a521", 1.4);
  const bp = bokeh.geometry.attributes.position as T.BufferAttribute;
  for (let i = 0; i < bp.count; i++) bp.setXYZ(i, (Math.random() - 0.5) * 22, Math.random() * 6 - 0.5, -6 - Math.random() * 8);
  (bokeh.material as T.PointsMaterial).opacity = 0.5;
  thali.add(bokeh);
  thali.position.x = CHAPTER_X[3];
  scene.add(thali);

  // ── Camera path ───────────────────────────────────────────────
  const camPts = [
    [-2, 3.2, 8.5],
    [CHAPTER_X[0] + 2, 2.4, 6.5],
    [CHAPTER_X[1] - 3, 3.8, 6.5],
    [CHAPTER_X[1] + 1, 5.2, 4.2],
    [CHAPTER_X[2] - 2, 2.6, 5.8],
    [CHAPTER_X[2] + 1.5, 3.4, 4.6],
    [CHAPTER_X[3] - 1.5, 6.2, 4.6],
    [CHAPTER_X[3], 7.2, 2.2],
    [CHAPTER_X[3] + 0.5, 4.2, 9.5],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const lookPts = [
    [0, -0.2, 0],
    [CHAPTER_X[0], -0.4, 0],
    [CHAPTER_X[1], 1.4, 0],
    [CHAPTER_X[1], 1.8, 0],
    [CHAPTER_X[2], 0.6, 0],
    [CHAPTER_X[2], 0.8, 0],
    [CHAPTER_X[3], -0.4, 0],
    [CHAPTER_X[3], -0.5, 0],
    [CHAPTER_X[3], 0, 0],
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  const camCurve = new THREE.CatmullRomCurve3(camPts, false, "centripetal");
  const lookCurve = new THREE.CatmullRomCurve3(lookPts, false, "centripetal");

  // ── Motion ────────────────────────────────────────────────────
  const reset = (pts: T.Points, spread: number, height: number) => {
    const p = pts.geometry.attributes.position as T.BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setXYZ(i, (Math.random() - 0.5) * spread, Math.random() * height, (Math.random() - 0.5) * spread);
    p.needsUpdate = true;
  };
  reset(dust, 9, 5);
  reset(embers, 1.4, 4);
  reset(steam, 2.6, 3);
  const rise = (pts: T.Points, dt: number, speed: number, base: number, top: number, spread: number) => {
    const p = pts.geometry.attributes.position as T.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i) + dt * speed * (0.5 + ((i * 37) % 10) / 10);
      let x = p.getX(i) + Math.sin(y * 2 + i) * dt * 0.3;
      let z = p.getZ(i);
      if (y > top) {
        y = base;
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * spread;
        x = Math.cos(a) * r;
        z = Math.sin(a) * r;
      }
      p.setXYZ(i, x, y, z);
    }
    p.needsUpdate = true;
  };

  // Film time → position on the camera path. Each chapter's caption is
  // centred at (i + 0.5) / 5 of the film; these are the matching spots on
  // the path (control-point index / 8), so the scene and its words line up.
  const T_KEYS = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
  const U_KEYS = [0, 1 / 8, 2.5 / 8, 4.5 / 8, 6.6 / 8, 7.7 / 8, 1];
  const toPath = (t: number) => {
    const c = Math.min(1, Math.max(0, t));
    let i = 0;
    while (i < T_KEYS.length - 2 && c > T_KEYS[i + 1]) i++;
    const k = (c - T_KEYS[i]) / (T_KEYS[i + 1] - T_KEYS[i]);
    return U_KEYS[i] + (U_KEYS[i + 1] - U_KEYS[i]) * k;
  };

  return {
    katoris,
    cameraAt: (t, pos, look) => {
      const u = toPath(t);
      camCurve.getPoint(u, pos);
      lookCurve.getPoint(u, look);
    },
    update: (time, dt) => {
      rise(embers, dt, 1.4, 2.1, 6, 0.8);
      rise(steam, dt, 0.6, 1.0, 4.2, 1.4);
      rise(dust, dt, 0.08, -0.5, 4.5, 4.5);
      fire.intensity = 34 + Math.sin(time * 13) * 4 + Math.sin(time * 7.3) * 6;
      (mouth.material as T.MeshBasicMaterial).color.setHSL(0.07 + Math.sin(time * 9) * 0.01, 1, 0.55 + Math.sin(time * 11) * 0.04);
      coals.intensity = 16 + Math.sin(time * 5) * 3;
    },
  };
}
