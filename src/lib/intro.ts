/** Fired on window when the first-visit loader has finished revealing the page. */
export const INTRO_DONE_EVENT = "tyc:intro-done";

export const INTRO_STORAGE_KEY = "tyc-intro";

/** True while the first-visit loader covers the page. */
export function isIntroRunning(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("is-loading");
}

/** Runs `fn` now, or once the loader has lifted. Returns a cleanup. */
export function afterIntro(fn: () => void): () => void {
  if (!isIntroRunning()) {
    fn();
    return () => {};
  }
  window.addEventListener(INTRO_DONE_EVENT, fn, { once: true });
  return () => window.removeEventListener(INTRO_DONE_EVENT, fn);
}

/**
 * Runs before first paint (inlined in <head>). Shows the loader only on the
 * first page of a visit, never for reduced motion, never on slow connections
 * (2G/3G or Data Saver: content first), and removes it after 7 s even if the
 * app's JavaScript never arrives.
 */
export const LOADER_INIT_SCRIPT = `try{var d=document.documentElement,c=navigator.connection,slow=c&&(c.saveData||/2g|3g/.test(c.effectiveType||""));if(!slow&&!sessionStorage.getItem("${INTRO_STORAGE_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("is-loading");setTimeout(function(){d.classList.remove("is-loading")},7000)}}catch(e){}`;
