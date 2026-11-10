/**
 * Veerji's mark: a stage microphone, because the music is what Satna talks
 * about. Used for the logo, loader, cursor wipe and map pin. Paths are
 * exported so GSAP can draw and morph them.
 */
export const MIC_HEAD = "M22,16 C22,10.5 26.5,6 32,6 C37.5,6 42,10.5 42,16 L42,25 C42,30.5 37.5,35 32,35 C26.5,35 22,30.5 22,25 Z";
export const MIC_GRILLE = "M23,15.5 H41 M22.5,20.5 H41.5 M23,25.5 H41";
export const MIC_STAND = "M16,22 C16,33.5 23,41 32,41 C41,41 48,33.5 48,22 M32,41 L32,52 M22,57 H42";

/** The mic's shapes on a 64 × 64 grid, for use inside another SVG. */
export function MicGlyph() {
  return (
    <>
      <path d={MIC_STAND} fill="none" stroke="var(--color-rose)" strokeWidth="4.5" strokeLinecap="round" />
      <path d={MIC_HEAD} fill="var(--color-gold)" />
      <path d={MIC_GRILLE} fill="none" stroke="var(--color-night)" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
      <path d="M27,10.5 C28.5,9.5 30,9 32,9" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
    </>
  );
}

export function MicMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <MicGlyph />
    </svg>
  );
}

/** "veerji's" wordmark, with the mic standing in front of it. */
export function Wordmark({ className, accent = "text-gold", ...rest }: { className?: string; accent?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-center gap-[0.12em] font-display font-extrabold tracking-[-0.04em] lowercase ${className ?? ""}`} {...rest}>
      <MicMark className="-ml-[0.1em] h-[1.05em] w-[1.05em] -rotate-12" />
      <span>
        veerji<span className={accent}>&rsquo;s</span>
      </span>
    </span>
  );
}

/** A small red chilli: the heat guide on the menu and the Spice-o-meter. */
export const CHILLI_POD = "M19,17 C31,12 45,18 51,32 C56,43 55,53 59,60 C48,59 40,51 34,43 C27,34 21,27 16,23 C13,21 15,18 19,17 Z";
const CHILLI_CAP = "M11,19 C13,13 22,10 27,15 C23,18 17,20 11,19 Z";
const CHILLI_STEM = "M18,15 C17,11 17,7 20,3";

export function ChilliIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={CHILLI_POD} fill="#e2412f" />
      <path d="M24,21 C33,19 41,24 45,32" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
      <path d={CHILLI_CAP} fill="var(--color-leaf)" />
      <path d={CHILLI_STEM} fill="none" stroke="var(--color-leaf)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
