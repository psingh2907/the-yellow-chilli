/**
 * The yellow chilli: the site's mark (logo, loader, cursor, map pin).
 * Paths are exported so GSAP can draw and morph them.
 */
export const CHILLI_POD =
  "M19,17 C31,12 45,18 51,32 C56,43 55,53 59,60 C48,59 40,51 34,43 C27,34 21,27 16,23 C13,21 15,18 19,17 Z";
export const CHILLI_CAP = "M11,19 C13,13 22,10 27,15 C23,18 17,20 11,19 Z";
export const CHILLI_STEM = "M18,15 C17,11 17,7 20,3";

export function ChilliMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d={CHILLI_POD} fill="var(--color-saffron)" />
      <path d="M24,21 C33,19 41,24 45,32" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
      <path d={CHILLI_CAP} fill="var(--color-leaf)" />
      <path d={CHILLI_STEM} fill="none" stroke="var(--color-leaf)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/** "the yellow chilli" wordmark, with the chilli sitting on the "o". */
export function Wordmark({ className, ...rest }: { className?: string } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`inline-flex items-baseline font-display font-extrabold tracking-[-0.04em] lowercase ${className ?? ""}`} {...rest}>
      the&nbsp;yell
      <span className="relative inline-block">
        o
        <ChilliMark className="absolute -top-[0.62em] left-1/2 h-[0.62em] w-[0.62em] -translate-x-[40%] rotate-12" />
      </span>
      w&nbsp;<span className="text-saffron">chilli</span>
    </span>
  );
}
