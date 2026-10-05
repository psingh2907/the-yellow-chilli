import { ImageResponse } from "next/og";

export const alt = "The Yellow Chilli, Satna: Redefining Indian food";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview: the wordmark, the line and the chilli on night navy. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0d1020", color: "#fbf3e4", padding: 80, position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1 }}>
          <div style={{ fontSize: 28, letterSpacing: 6, color: "#f4a521", textTransform: "uppercase" }}>Master Chef Sanjeev Kapoor&apos;s · Satna</div>
          <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 0.95, marginTop: 20 }}>Redefining Indian food.</div>
          <div style={{ fontSize: 40, marginTop: 30, color: "#a7accb" }}>the yellow chilli · NH-75, Panna Naka Road</div>
        </div>
        <svg viewBox="0 0 64 64" width="360" height="360" style={{ position: "absolute", right: 60, top: 60, transform: "rotate(12deg)" }}>
          <path d="M19,17 C31,12 45,18 51,32 C56,43 55,53 59,60 C48,59 40,51 34,43 C27,34 21,27 16,23 C13,21 15,18 19,17 Z" fill="#f4a521" />
          <path d="M11,19 C13,13 22,10 27,15 C23,18 17,20 11,19 Z" fill="#3f8f4f" />
          <path d="M18,15 C17,11 17,7 20,3" fill="none" stroke="#3f8f4f" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
