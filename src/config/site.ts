/**
 * Site-level configuration (not business data).
 *
 * Values come from environment variables so the same code can run as a
 * sales prototype or as the production website. See `.env.example`.
 */

function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

const prototypeMode = process.env.NEXT_PUBLIC_PROTOTYPE_MODE !== "false";

export const siteConfig = {
  /**
   * `true`  — sample menu, illustrated placeholders and preview banner are
   *           shown, and the site is hidden from search engines.
   * `false` — production: indexable, no preview labels.
   */
  prototypeMode,

  /**
   * Public URL, used for canonical links, Open Graph and structured data.
   * On Vercel it falls back to the project's production domain, so shared
   * links show the preview image without any setup.
   */
  url:
    readEnv(process.env.NEXT_PUBLIC_SITE_URL) ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),

  locale: "en_IN",

  /** Google Analytics 4 measurement ID (G-XXXXXXX). Loaded only when set. */
  gaId: readEnv(process.env.NEXT_PUBLIC_GA_ID),
} as const;
