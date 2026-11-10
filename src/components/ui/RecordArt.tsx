/**
 * A flat vinyl record with the Veerji's label: the still stand-in for the
 * 3D record (reduced motion, no WebGL) and the "music" illustration
 * wherever a dish illustration would sit.
 */
export function RecordArt({ className, label }: { className?: string; label?: string }) {
  const rings = [0.93, 0.86, 0.8, 0.73, 0.66, 0.6, 0.53, 0.47];
  return (
    <svg viewBox="0 0 200 200" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <radialGradient id="record-label" cx="40%" cy="38%">
          <stop offset="0" stopColor="#ffd98a" />
          <stop offset="1" stopColor="#d99a2b" />
        </radialGradient>
        <linearGradient id="record-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="104" r="96" fill="#000" opacity="0.3" />
      <circle cx="100" cy="100" r="96" fill="#0d080b" />
      {rings.map((f) => (
        <circle key={f} cx="100" cy="100" r={96 * f} fill="none" stroke="#2a1f27" strokeWidth="1.2" />
      ))}
      <circle cx="100" cy="100" r="96" fill="url(#record-shine)" />
      <circle cx="100" cy="100" r="35" fill="url(#record-label)" />
      <circle cx="100" cy="100" r="30" fill="none" stroke="#ff4d7d" strokeWidth="2.4" />
      <text x="100" y="96" textAnchor="middle" fontSize="12" fontWeight="800" fill="#140a18" className="font-display">
        veerji&rsquo;s
      </text>
      <text x="100" y="117" textAnchor="middle" fontSize="5" fontWeight="700" letterSpacing="1" fill="#140a18">
        LIVE · SATNA
      </text>
      <circle cx="100" cy="100" r="3" fill="#140a18" />
    </svg>
  );
}
