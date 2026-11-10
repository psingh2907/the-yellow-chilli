/**
 * A vinyl record with a Veerji's label, built from code (no model file to
 * download):
 *  - a thin glossy disc whose faces carry a drawn groove texture (fine
 *    rings, a few track gaps, a smooth lead-in at the rim);
 *  - a gold label on both faces with the name and a spindle hole.
 *
 * The returned group holds a `spinner` child (in userData) that turns
 * around the disc's own axis; tilt the group, spin the spinner.
 */
import type * as T from "three";
import type { Three } from "./stage";

function grooveTexture(THREE: Three, size: number): T.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  ctx.fillStyle = "#0a0609";
  ctx.fillRect(0, 0, size, size);
  // Grooves: hundreds of rings with slightly different shades catch the light unevenly.
  ctx.lineWidth = Math.max(1, size / 1400);
  for (let r = size * 0.19; r < size * 0.485; r += size / 520) {
    const s = 16 + Math.random() * 20;
    ctx.strokeStyle = `rgb(${s + 2},${s - 2},${s + 4})`;
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Gaps between songs.
  ctx.strokeStyle = "#050304";
  ctx.lineWidth = size * 0.005;
  for (const f of [0.255, 0.31, 0.37, 0.43]) {
    ctx.beginPath();
    ctx.arc(c, c, size * f, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Smooth lead-in at the rim.
  ctx.strokeStyle = "#1c1418";
  ctx.lineWidth = size * 0.012;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.492, 0, Math.PI * 2);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function labelTexture(THREE: Three, size: number): T.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const grad = ctx.createRadialGradient(c * 0.8, c * 0.75, size * 0.05, c, c, c);
  grad.addColorStop(0, "#ffd98a");
  grad.addColorStop(1, "#d99a2b");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(c, c, c, 0, Math.PI * 2);
  ctx.fill();
  // Rose ring near the edge.
  ctx.strokeStyle = "#ff4d7d";
  ctx.lineWidth = size * 0.035;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.86, 0, Math.PI * 2);
  ctx.stroke();

  // next/font renames families, so read the real one from the CSS variable.
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() || "system-ui, sans-serif";
  ctx.fillStyle = "#140a18";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${Math.round(size * 0.17)}px ${family}`;
  ctx.fillText("veerji’s", c, c * 0.62);
  ctx.font = `700 ${Math.round(size * 0.055)}px system-ui, sans-serif`;
  ctx.fillText("LIVE  ·  SATNA", c, c * 1.38);
  ctx.font = `600 ${Math.round(size * 0.045)}px system-ui, sans-serif`;
  ctx.fillText("SIDE A  ·  33⅓", c, c * 1.55);
  // Spindle hole.
  ctx.fillStyle = "#140a18";
  ctx.beginPath();
  ctx.arc(c, c, size * 0.035, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createRecord(THREE: Three, { detail = 1 } = {}): T.Group {
  const R = 2;
  const THICK = 0.045;
  const group = new THREE.Group();
  const spinner = new THREE.Group();
  group.add(spinner);
  group.userData.spinner = spinner;

  const grooves = grooveTexture(THREE, detail < 1 ? 1024 : 2048);
  const vinyl = new THREE.MeshPhysicalMaterial({
    color: "#5a5058",
    map: grooves,
    roughness: 0.38,
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    sheen: 0.2,
    sheenColor: new THREE.Color("#5a3a6a"),
  });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(R, R, THICK, Math.round(160 * detail), 1), vinyl);
  // Cylinders stand on Y; lay it so its faces look down the Z axis.
  disc.rotation.x = Math.PI / 2;
  spinner.add(disc);

  const labelMat = new THREE.MeshPhysicalMaterial({ map: labelTexture(THREE, 1024), roughness: 0.55, clearcoat: 0.3 });
  const labelGeo = new THREE.CircleGeometry(R * 0.36, 96);
  const front = new THREE.Mesh(labelGeo, labelMat);
  front.position.z = THICK / 2 + 0.002;
  const back = new THREE.Mesh(labelGeo, labelMat);
  back.position.z = -THICK / 2 - 0.002;
  back.rotation.y = Math.PI;
  spinner.add(front, back);

  return group;
}
