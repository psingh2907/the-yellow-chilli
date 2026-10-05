/**
 * A marigold garland (toran) hanging in swags. The string is a path for
 * DrawSVG; each flower is a `[data-marigold]` group so GSAP can pop them in.
 */
const SWAGS = 4;
const W = 1200;

export function Garland({ className }: { className?: string }) {
  const seg = W / SWAGS;
  const d = Array.from({ length: SWAGS }, (_, i) => `${i === 0 ? "M0,10 " : ""}Q${seg * i + seg / 2},110 ${seg * (i + 1)},10`).join(" ");
  const flowers: Array<{ x: number; y: number; c: string }> = [];
  for (let i = 0; i < SWAGS; i++) {
    for (let k = 1; k < 8; k++) {
      const t = k / 8;
      const x = seg * i + seg * t;
      const y = 10 + 2 * (1 - t) * t * 100; // the quadratic's height at t
      flowers.push({ x, y, c: k % 2 ? "#f4a521" : "#f06a1f" });
    }
  }
  return (
    <svg viewBox={`0 0 ${W} 130`} className={className} aria-hidden="true" preserveAspectRatio="none">
      <path data-garland d={d} fill="none" stroke="#3f8f4f" strokeWidth="3" />
      {flowers.map((f, i) => (
        <g key={i} data-marigold transform={`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)})`}>
          <circle r="11" fill={f.c} />
          <circle r="6" fill={f.c === "#f4a521" ? "#f06a1f" : "#f4a521"} opacity="0.7" />
        </g>
      ))}
      {Array.from({ length: SWAGS + 1 }, (_, i) => (
        <path key={i} d={`M${seg * i},10 l0,40`} stroke="#f4a521" strokeWidth="6" strokeLinecap="round" strokeDasharray="0.1 12" />
      ))}
    </svg>
  );
}
