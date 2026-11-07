/**
 * The glass's specular edge follows the pointer, and only the pointer: a
 * move over the glass lights its edge where the pointer is, and the light
 * goes out `--motion-light` after the last move. Under reduced motion it sets
 * nothing, so the edge stays dark. Use it as an attachment on an element that carries
 * the `glass` utility: `<div class="glass" {@attach pointerLight}>`.
 */
import type { Attachment } from "svelte/attachments";
import { readDuration } from "#lib/registry/lib/read-token";

type Part = "x" | "y" | "lit";

/** Sets one of the glass's custom properties: the one style write the lint allows (L24). */
function set(element: HTMLElement, part: Part, value: string): void {
  element.style.setProperty(`--glass-${part}`, value);
}

/** A share of a length, as a percentage of the element's box. */
function share(offset: number, length: number): string {
  return `${((offset / length) * 100).toFixed(2)}%`;
}

export const pointerLight: Attachment<HTMLElement> = (element) => {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reduce = motion.matches;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const onChange = () => {
    reduce = motion.matches;
  };
  const onMove = (event: PointerEvent) => {
    if (reduce) return;
    const box = element.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    set(element, "x", share(event.clientX - box.left, box.width));
    set(element, "y", share(event.clientY - box.top, box.height));
    set(element, "lit", "1");
    clearTimeout(timer);
    timer = setTimeout(
      () => set(element, "lit", "0"),
      readDuration("motion-light", element),
    );
  };

  motion.addEventListener("change", onChange);
  element.addEventListener("pointermove", onMove);
  return () => {
    clearTimeout(timer);
    motion.removeEventListener("change", onChange);
    element.removeEventListener("pointermove", onMove);
  };
};
