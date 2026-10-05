/**
 * The platter (a draft order) shared between the menu list and the thali.
 * A tiny external store so both can subscribe without prop drilling.
 */
import { useSyncExternalStore } from "react";

export interface PlatterLine {
  name: string;
  price: number;
  qty: number;
}

let lines: PlatterLine[] = [];
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const platter = {
  add(name: string, price: number) {
    const found = lines.find((l) => l.name === name);
    lines = found ? lines.map((l) => (l.name === name ? { ...l, qty: l.qty + 1 } : l)) : [...lines, { name, price, qty: 1 }];
    emit();
  },
  remove(name: string) {
    lines = lines.flatMap((l) => (l.name !== name ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []));
    emit();
  },
  clear() {
    lines = [];
    emit();
  },
  /** Whether the platter panel is open (shared by the thali and the phone dock). */
  setOpen(next: boolean) {
    if (open === next) return;
    open = next;
    emit();
  },
  isOpen: () => open,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  get: () => lines,
};

const empty: PlatterLine[] = [];

export function usePlatter(): PlatterLine[] {
  return useSyncExternalStore(platter.subscribe, platter.get, () => empty);
}

export function usePlatterOpen(): boolean {
  return useSyncExternalStore(platter.subscribe, platter.isOpen, () => false);
}

export const platterTotal = (ls: PlatterLine[]) => ls.reduce((sum, l) => sum + l.price * l.qty, 0);
export const platterCount = (ls: PlatterLine[]) => ls.reduce((sum, l) => sum + l.qty, 0);
