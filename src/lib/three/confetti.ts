/**
 * Party confetti and stage glitter drifting around the hero record. One
 * draw call (THREE.Points with a small shader).
 *
 *  uBurst 0 → 1  scatters every flake outward along its own direction
 *                (driven by ScrollTrigger as the hero scrolls away).
 *  uTime         gentle drift and tumble.
 */
import type * as T from "three";
import type { Three } from "./stage";

const PALETTE = ["#f2b544", "#ffd98a", "#ff4d7d", "#b3264f", "#fbf3e8", "#9b7bff", "#2f9e57"];

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uBurst;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute vec3 aDir;
  attribute float aSeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vSeed;
  varying float vFade;

  void main() {
    vec3 p = position;
    float t = uTime * (0.15 + aSeed * 0.25);
    p += vec3(sin(t + aSeed * 40.0), cos(t * 0.8 + aSeed * 20.0), sin(t * 0.6 + aSeed * 9.0)) * 0.12;
    p.y += sin(uTime * 0.4 + aSeed * 30.0) * 0.08;
    float b = uBurst * uBurst;
    p += aDir * b * (3.0 + aSeed * 7.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Never smaller than ~2 device px: sub-pixel points flicker ("glitter")
    // as they move across pixel boundaries, most visibly on phones.
    gl_PointSize = max(2.0 * uPixelRatio, uSize * (0.5 + aSeed) * uPixelRatio * (1.0 + b * 0.8) / -mv.z);
    vColor = aColor;
    vSeed = aSeed;
    vFade = 1.0 - smoothstep(0.65, 1.0, uBurst);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vSeed;
  varying float vFade;

  void main() {
    // A rotated, slightly squashed flake rather than a perfect dot.
    vec2 uv = gl_PointCoord - 0.5;
    float a = vSeed * 6.2831;
    uv = mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;
    uv.x *= 1.0 + vSeed * 1.6;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.2, d) * vFade;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor * (0.8 + 0.4 * vSeed), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function createConfetti(THREE: Three, count: number, pixelRatio: number): T.Points<T.BufferGeometry, T.ShaderMaterial> {
  const positions = new Float32Array(count * 3);
  const dirs = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();
  const v = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    // A loose cloud around the record: denser near it, thinning outward.
    v.randomDirection();
    const r = 1.2 + Math.pow(Math.random(), 0.7) * 3.2;
    positions.set([v.x * r * 1.5, v.y * r, v.z * r * 0.8 - 0.5], i * 3);
    v.add(new THREE.Vector3((Math.random() - 0.5) * 0.6, Math.random() * 0.4, (Math.random() - 0.5) * 0.6)).normalize();
    dirs.set([v.x, v.y, v.z], i * 3);
    seeds[i] = Math.random();
    c.set(PALETTE[Math.floor(Math.random() * PALETTE.length)]);
    colors.set([c.r, c.g, c.b], i * 3);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aDir", new THREE.BufferAttribute(dirs, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uPixelRatio: { value: pixelRatio },
      uSize: { value: 26 },
    },
  });
  return new THREE.Points(geo, mat);
}
