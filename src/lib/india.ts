/**
 * A stylised outline of India for the Chef's Journey map, following
 * India's official boundary (all of Jammu & Kashmir and Ladakh).
 * It is drawn from about 150 hand-placed points: good for an illustration,
 * not for navigation. Projection is a simple equirectangular one, squeezed
 * horizontally by cos(23°) so the country keeps its familiar shape.
 */
type LonLat = [number, number];

const OUTLINE: LonLat[] = [
  // Kashmir, Gilgit-Baltistan and Ladakh (incl. Aksai Chin)
  [73.6, 36.9], [74.6, 37.05], [75.6, 36.8], [76.4, 35.9], [77.8, 35.5], [78.8, 35.6], [79.6, 35.6],
  [80.3, 35.3], [80.1, 34.4], [79.4, 33.3], [79.5, 32.6], [78.8, 32.5], [78.7, 31.5], [79.8, 30.9],
  [80.9, 30.2], [80.2, 29.0], [80.06, 28.8],
  // Nepal
  [81.2, 28.4], [82.2, 27.9], [83.3, 27.4], [84.1, 27.5], [85.0, 26.9], [86.0, 26.6], [87.2, 26.4], [88.1, 26.5],
  // Sikkim
  [88.1, 27.1], [88.0, 27.9], [88.8, 28.0], [88.9, 27.3],
  // Bhutan
  [89.6, 26.8], [90.5, 26.8], [91.6, 26.8], [92.1, 26.9],
  // Arunachal Pradesh
  [91.7, 27.9], [92.6, 28.2], [93.4, 28.7], [94.5, 29.2], [95.4, 29.3], [96.1, 29.4], [96.6, 28.9],
  [97.3, 28.3], [97.4, 27.9],
  // Myanmar border
  [96.9, 27.6], [96.2, 27.2], [95.4, 26.7], [95.2, 26.0], [94.6, 25.3], [94.7, 24.4], [94.2, 23.8],
  [93.3, 23.0], [93.0, 22.0], [92.6, 21.95],
  // Bangladesh (Mizoram, Tripura, Meghalaya, West Bengal)
  [92.3, 22.9], [92.2, 23.7], [91.7, 23.0], [91.2, 23.6], [91.6, 24.2], [92.1, 24.4], [92.0, 25.1],
  [90.5, 25.2], [89.9, 25.3], [89.85, 25.9], [89.0, 26.2], [88.45, 26.3], [88.1, 25.6], [88.1, 25.0],
  [88.6, 24.3], [88.7, 23.5], [88.9, 22.8], [89.05, 21.7],
  // East coast
  [88.2, 21.6], [87.5, 21.6], [86.9, 20.9], [86.4, 20.0], [85.3, 19.6], [84.6, 19.0], [83.4, 17.7],
  [82.3, 16.6], [81.2, 15.9], [80.3, 15.5], [80.1, 14.5], [80.3, 13.1], [79.9, 12.0], [79.8, 10.9],
  [79.3, 10.3], [78.9, 9.4], [78.2, 8.9], [77.55, 8.08],
  // West coast
  [77.0, 8.4], [76.5, 9.3], [76.2, 10.1], [75.8, 11.3], [75.2, 12.4], [74.7, 13.6], [74.3, 14.6],
  [73.9, 15.6], [73.4, 16.9], [73.0, 18.3], [72.8, 19.1], [72.7, 20.3], [72.6, 21.1], [72.6, 21.7],
  [72.3, 22.2],
  // Gujarat: Saurashtra and Kutch
  [72.0, 21.4], [71.2, 20.8], [70.4, 20.9], [69.7, 21.6], [69.0, 22.3], [69.8, 22.6], [70.4, 22.9],
  [69.6, 22.85], [68.4, 23.5], [68.2, 23.7], [68.6, 24.3], [69.6, 24.3], [71.1, 24.6],
  // Pakistan border
  [70.6, 25.5], [70.1, 25.9], [70.1, 26.6], [69.5, 27.0], [70.0, 27.8], [70.6, 28.0], [71.9, 27.9],
  [72.4, 28.8], [73.3, 29.5], [73.9, 30.2], [74.5, 30.9], [74.6, 31.7], [74.6, 32.5], [74.0, 32.9],
  [73.6, 33.6], [73.4, 34.4], [73.8, 35.0], [72.6, 35.6], [72.5, 36.2],
];

const ISLANDS: Array<{ at: LonLat; r: number }> = [
  // Andaman & Nicobar
  { at: [92.75, 12.9], r: 5 },
  { at: [92.7, 11.6], r: 5 },
  { at: [92.55, 10.6], r: 3.5 },
  { at: [93.0, 8.2], r: 3.5 },
  { at: [93.8, 7.1], r: 3 },
  // Lakshadweep
  { at: [72.6, 11.2], r: 2.5 },
  { at: [72.8, 10.4], r: 2.5 },
];

const LON0 = 67.4;
const LAT0 = 37.8;
const SCALE = 30;
const SQUEEZE = Math.cos((23 * Math.PI) / 180);

export const MAP_VIEWBOX = { width: 860, height: 960 };

/** [lon, lat] → SVG [x, y] in the map's viewBox. */
export function project([lon, lat]: LonLat): [number, number] {
  return [(lon - LON0) * SCALE * SQUEEZE + 4, (LAT0 - lat) * SCALE];
}

/**
 * A smooth closed or open path through points (Catmull-Rom converted to
 * cubic Béziers). `tension` 0 = straight lines, 1 = very round.
 */
export function smoothPath(points: Array<[number, number]>, closed: boolean, tension = 0.5): string {
  const p = points;
  const len = p.length;
  const at = (i: number) => (closed ? p[(i + len) % len] : p[Math.max(0, Math.min(len - 1, i))]);
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  const last = closed ? len : len - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const t = tension / 3;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return closed ? `${d} Z` : d;
}

export const indiaPath = smoothPath(OUTLINE.map(project), true, 0.35);

export const islandDots = ISLANDS.map(({ at, r }) => {
  const [x, y] = project(at);
  return { x, y, r };
});

/** "24.5765° N, 80.7830° E" */
export function formatLatLng(lat: number, lng: number, digits = 4): string {
  return `${lat.toFixed(digits)}° N, ${lng.toFixed(digits)}° E`;
}
