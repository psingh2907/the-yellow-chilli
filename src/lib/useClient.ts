import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * A value that can only be known in the browser (WebGL support, reduced
 * motion…), with a fixed server value. Avoids setting state in an effect
 * just to learn we're on the client. `read` must return a primitive.
 */
export function useClientValue<T extends string | number | boolean | null>(read: () => T, server: T): T {
  return useSyncExternalStore(noop, read, () => server);
}

/** True after hydration (e.g. before rendering portals into <body>). */
export function useIsClient(): boolean {
  return useClientValue(() => true, false);
}
