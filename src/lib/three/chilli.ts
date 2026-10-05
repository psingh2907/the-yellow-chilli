/**
 * A glossy yellow chilli, built from code (no model file to download):
 *  - the pod is a tube along a curved spine whose radius tapers from a
 *    rounded shoulder to a fine tip, with soft lengthwise ridges;
 *  - a lobed green calyx and a curled stem sit on top.
 */
import type * as T from "three";
import type { Three } from "./stage";

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Pod radius along the spine (t = 0 at the stem, 1 at the tip). */
const radiusAt = (t: number) => 0.46 * Math.pow(1 - t, 0.75) * (0.62 + 0.38 * smooth(0, 0.14, t)) + 0.012;

function podGeometry(THREE: Three, lengthSegs: number, radialSegs: number): T.BufferGeometry {
  const spine = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.35, 0),
    new THREE.Vector3(0.12, 0.85, 0.08),
    new THREE.Vector3(0.3, 0.15, 0.12),
    new THREE.Vector3(0.24, -0.55, 0.04),
    new THREE.Vector3(-0.02, -1.15, -0.08),
    new THREE.Vector3(-0.42, -1.55, -0.16),
  ]);
  const frames = spine.computeFrenetFrames(lengthSegs, false);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i <= lengthSegs; i++) {
    const t = i / lengthSegs;
    spine.getPointAt(t, p);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const r = radiusAt(t);
    for (let j = 0; j <= radialSegs; j++) {
      const a = (j / radialSegs) * Math.PI * 2;
      // Three soft ridges that twist gently along the pod.
      const ridge = 1 + 0.05 * Math.sin(3 * a + t * 5) * smooth(0.05, 0.3, t);
      const cx = Math.cos(a) * r * ridge;
      const cy = Math.sin(a) * r * ridge;
      n.set(N.x * cx + B.x * cy, N.y * cx + B.y * cy, N.z * cx + B.z * cy);
      positions.push(p.x + n.x, p.y + n.y, p.z + n.z);
      uvs.push(j / radialSegs, t);
    }
  }
  for (let i = 0; i < lengthSegs; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * (radialSegs + 1) + j;
      const b = a + radialSegs + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function calyxGeometry(THREE: Three): T.BufferGeometry {
  const geo = new THREE.SphereGeometry(0.4, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = geo.attributes.position as T.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const a = Math.atan2(v.z, v.x);
    // Five sepals: the rim scallops downward between lobes.
    const lobe = 0.5 + 0.5 * Math.cos(a * 5);
    const rim = 1 - v.y / 0.4;
    v.x *= 1.05 + 0.12 * lobe * rim;
    v.z *= 1.05 + 0.12 * lobe * rim;
    v.y = v.y * 0.42 - rim * 0.1 * (1 - lobe);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function createChilli(THREE: Three, { detail = 1 } = {}): T.Group {
  const group = new THREE.Group();

  const pod = new THREE.Mesh(
    podGeometry(THREE, Math.round(140 * detail), Math.round(44 * detail)),
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#f29e00"),
      roughness: 0.32,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      sheen: 0.15,
      sheenColor: new THREE.Color("#ffcf5a"),
    }),
  );
  group.add(pod);

  const green = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("#3f7d33"), roughness: 0.45, clearcoat: 0.6 });
  const calyx = new THREE.Mesh(calyxGeometry(THREE), green);
  calyx.position.set(0, 1.3, 0);
  calyx.rotation.z = -0.15;
  group.add(calyx);

  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1.38, 0),
    new THREE.Vector3(0.02, 1.7, 0.02),
    new THREE.Vector3(0.14, 1.95, 0.05),
    new THREE.Vector3(0.34, 2.02, 0.06),
  ]);
  const stem = new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 24, 0.065, 12, false), green);
  group.add(stem);

  // Centre the chilli on its own middle so it spins nicely.
  group.children.forEach((c) => (c.position.y -= 0.2));
  return group;
}
