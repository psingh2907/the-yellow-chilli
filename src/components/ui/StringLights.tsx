/**
 * Party string lights hanging in swags. The wire is a path for DrawSVG;
 * each bulb is a `[data-bulb]` group so GSAP can pop them in and twinkle.
 */
const SWAGS = 4;
const W = 1200;
const COLORS = ["#f2b544", "#ff4d7d", "#9b7bff", "#ffd98a"];

export function StringLights({ className }: { className?: string }) {
  const seg = W / SWAGS;
  const d = Array.from({ length: SWAGS }, (_, i) => `${i === 0 ? "M0,10 " : ""}Q${seg * i + seg / 2},110 ${seg * (i + 1)},10`).join(" ");
  const bulbs: Array<{ x: number; y: number; c: string }> = [];
  for (let i = 0; i < SWAGS; i++) {
    for (let k = 1; k < 8; k++) {
      const t = k / 8;
      const x = seg * i + seg * t;
      const y = 10 + 2 * (1 - t) * t * 100; // the quadratic's height at t
      bulbs.push({ x, y, c: COLORS[(i * 7 + k) % COLORS.length] });
    }
  }
  return (
    <svg viewBox={`0 0 ${W} 140`} className={className} aria-hidden="true" preserveAspectRatio="none">
      <path data-wire d={d} fill="none" stroke="#2a1a24" strokeWidth="3" />
      {bulbs.map((b, i) => (
        <g key={i} data-bulb transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
          <rect x="-3" y="-2" width="6" height="7" rx="1.5" fill="#3a2a30" />
          <circle cy="13" r="14" fill={b.c} opacity="0.22" />
          <ellipse cy="12" rx="6" ry="8.5" fill={b.c} />
          <ellipse cx="-2" cy="9" rx="1.6" ry="3" fill="#fff" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}
