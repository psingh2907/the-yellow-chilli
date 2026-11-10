import { ImageResponse } from "next/og";

export const alt = "Veerji's Cafe Club & Restaurant, Satna: food that sings";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const HEAD = "M22,16 C22,10.5 26.5,6 32,6 C37.5,6 42,10.5 42,16 L42,25 C42,30.5 37.5,35 32,35 C26.5,35 22,30.5 22,25 Z";
const STAND = "M16,22 C16,33.5 23,41 32,41 C41,41 48,33.5 48,22 M32,41 L32,52 M22,57 H42";
const GRILLE = "M23,15.5 H41 M22.5,20.5 H41.5 M23,25.5 H41";

/** Social preview: the line, the name and the mic on the plum stage. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(circle at 80% 30%, #3a1430 0%, #140a18 60%)",
          color: "#fbf3e8",
          padding: 80,
          position: "relative",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1 }}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#f2b544", textTransform: "uppercase" }}>Pure veg · Live music · Satna</div>
          <div style={{ fontSize: 120, fontWeight: 800, lineHeight: 0.95, marginTop: 20 }}>Food that sings.</div>
          <div style={{ fontSize: 40, marginTop: 30, color: "#b9a7c2" }}>veerji&apos;s cafe club &amp; restaurant · R.S Tower, Railway Colony</div>
        </div>
        <svg viewBox="0 0 64 64" width="340" height="340" style={{ position: "absolute", right: 70, top: 50, transform: "rotate(-12deg)" }}>
          <path d={STAND} fill="none" stroke="#ff4d7d" strokeWidth="4.5" strokeLinecap="round" />
          <path d={HEAD} fill="#f2b544" />
          <path d={GRILLE} fill="none" stroke="#140a18" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
