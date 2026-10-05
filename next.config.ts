import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Google Analytics 4 (loaded only when NEXT_PUBLIC_GA_ID is set).
const ga = ["https://www.googletagmanager.com", "https://*.google-analytics.com", "https://*.analytics.google.com"];

/**
 * Content Security Policy. The site is fully static, so inline scripts
 * (Next's hydration data, the loader's head script) need 'unsafe-inline'
 * rather than per-request nonces. Everything else is locked to this origin
 * plus Google Maps (embed) and GA4. Three.js textures are drawn on canvas
 * locally, hence `blob:` / `data:` for images.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${ga.join(" ")}`,
  "font-src 'self'",
  `connect-src 'self' ${ga.join(" ")} ${isDev ? "ws: wss:" : ""}`,
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ")
  .replace(/\s+/g, " ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Geolocation stays off: directions open in Google Maps, which asks itself.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1280, 1600, 2048],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
