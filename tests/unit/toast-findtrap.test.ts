/**
 * 026 test 28: an ancestor that makes `position: fixed` relative to itself
 * traps the toaster's layer inside it. `findTrap` reads computed-style
 * records, nearest ancestor first, and names the first that traps
 * (026 decision 7).
 */
import { describe, expect, test } from "bun:test";
import {
  findTrap,
  type TrapStyle,
} from "../../src/lib/registry/ui/toast/toast-queue.ts";

/** A computed style with nothing that traps. */
const CLEAR: TrapStyle = {
  transform: "none",
  translate: "none",
  rotate: "none",
  scale: "none",
  filter: "none",
  backdropFilter: "none",
  perspective: "none",
  contain: "none",
  containerType: "normal",
  contentVisibility: "visible",
  willChange: "auto",
};

describe("026: findTrap", () => {
  test("28. a transformed ancestor is named", () => {
    expect(findTrap([])).toBeNull();
    expect(findTrap([{ ...CLEAR }, { ...CLEAR }])).toBeNull();
    expect(findTrap([{ ...CLEAR, contain: "style" }])).toBeNull();
    expect(findTrap([{ ...CLEAR, willChange: "opacity" }])).toBeNull();

    const trapping: Partial<TrapStyle>[] = [
      { transform: "matrix(1, 0, 0, 1, 0, 0)" },
      { translate: "10px" },
      { rotate: "45deg" },
      { scale: "1.1" },
      { filter: "blur(2px)" },
      { backdropFilter: "blur(4px)" },
      { perspective: "100px" },
      { contain: "paint" },
      { contain: "layout" },
      { contain: "strict" },
      { contain: "content" },
      { contain: "layout style" },
      { containerType: "inline-size" },
      { contentVisibility: "auto" },
      { willChange: "transform" },
      { willChange: "opacity, filter" },
    ];
    for (const trap of trapping) {
      const near = { ...CLEAR, ...trap };
      const far = { ...CLEAR, transform: "matrix(2, 0, 0, 2, 0, 0)" };
      expect(findTrap([{ ...CLEAR }, near, far]), JSON.stringify(trap)).toBe(
        near,
      );
    }
  });
});
