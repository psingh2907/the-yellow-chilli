/**
 * Draggable, created only while it's in use.
 *
 * A live Draggable listens to page scroll and re-measures its element's
 * position on every scroll frame (inserting a temporary measuring element
 * each time). With five of them on the site that cost was paid on every
 * frame of every scroll, even when nobody was dragging. Here the Draggable
 * is created once a press starts moving, started from that press, and
 * killed once the drag and its momentum have finished. Position lives in the element's
 * GSAP transform, so nothing is lost between drags.
 */
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { gsap } from "@/lib/gsap";

gsap.registerPlugin(Draggable, InertiaPlugin);

export interface LazyDraggable {
  /** True while dragging or coasting with momentum. */
  active: () => boolean;
  kill: () => void;
}

export function lazyDraggable(target: Element, vars: Draggable.Vars & { trigger?: Element }): LazyDraggable {
  const trigger = vars.trigger ?? target;
  let drag: Draggable | null = null;

  const finish = () => {
    if (drag && !drag.isDragging && !drag.isThrowing) {
      drag.kill();
      drag = null;
    }
  };

  // Wait until the pointer has really moved before creating the Draggable,
  // so plain taps and clicks (e.g. on category chips) behave normally.
  const THRESHOLD = 5;
  const onDown = (down: Event) => {
    if (drag) return;
    const d = down as PointerEvent;
    if (d.button !== 0) return;
    const onMove = (move: PointerEvent) => {
      if (Math.hypot(move.clientX - d.clientX, move.clientY - d.clientY) < THRESHOLD) return;
      stop();
      drag = Draggable.create(target, {
        ...vars,
        trigger,
        onRelease(...args: unknown[]) {
          vars.onRelease?.apply(this, args as []);
          if (!this.tween) gsap.delayedCall(0.05, finish);
        },
        onThrowComplete(...args: unknown[]) {
          vars.onThrowComplete?.apply(this, args as []);
          gsap.delayedCall(0.05, finish);
        },
      })[0];
      // Start from the original press point so no movement is lost.
      drag.startDrag(d);
    };
    const stop = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  };

  trigger.addEventListener("pointerdown", onDown);
  return {
    active: () => !!drag && (drag.isDragging || drag.isThrowing),
    kill: () => {
      trigger.removeEventListener("pointerdown", onDown);
      drag?.kill();
      drag = null;
    },
  };
}
