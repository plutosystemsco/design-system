/**
 * Reads the theme's runtime variables from script, so a canvas, a count-up or
 * a meter takes its colour and its timing from the one source the stylesheet
 * uses.
 *
 * A name is a variable's name without its two dashes: `mark-1`,
 * `motion-reveal`, `ease-standard`. Only runtime variables read back: the
 * theme's colours and the values on `:root`. A Tailwind theme value such as
 * `text-xs` is inlined into utilities and reads empty.
 *
 * Call these in the browser. On the server there is no document, and
 * `readToken` returns an empty string.
 */

/** The value of `--<name>` on `element`, or on the root, trimmed. */
export function readToken(name: string, element?: Element): string {
  if (typeof document === "undefined") return "";
  const value = getComputedStyle(element ?? document.documentElement)
    .getPropertyValue("--" + name)
    .trim();
  // A misspelled name reads empty; say so while developing.
  if (!value && import.meta.env?.DEV)
    console.warn(`readToken: --${name} is empty here; check the name.`);
  return value;
}

/** A duration token in milliseconds: 600 for `600ms` or `.6s`, 0 when it does not read. */
export function readDuration(name: string, element?: Element): number {
  const match = /^(-?[\d.]+)(ms|s)$/.exec(readToken(name, element));
  if (!match) return 0;
  const value = parseFloat(match[1]) * (match[2] === "s" ? 1000 : 1);
  // `..ms` matches the pattern but is not a number.
  return Number.isFinite(value) ? value : 0;
}

/**
 * The curve of a `cubic-bezier(x1, y1, x2, y2)` token as a function from
 * time to progress, both 0 to 1. The time is found on the curve's x by
 * Newton's method, with bisection where the slope is too flat. A token that
 * is not a cubic-bezier reads as linear.
 */
export function readEase(
  name: string,
  element?: Element,
): (t: number) => number {
  const match = /^cubic-bezier\(([^)]*)\)$/.exec(readToken(name, element));
  const points = match?.[1].split(",").map((n) => parseFloat(n));
  if (!points || points.length !== 4 || points.some(Number.isNaN))
    return (t) => t;
  const [x1, y1, x2, y2] = points as [number, number, number, number];
  // One axis of the curve, from its two control values, at parameter s.
  const axis = (s: number, a: number, b: number) =>
    3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;
  const slope = (s: number, a: number, b: number) =>
    3 * (1 - s) * (1 - s) * a + 6 * (1 - s) * s * (b - a) + 3 * s * s * (1 - b);
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let s = t;
    for (let i = 0; i < 8; i++) {
      const error = axis(s, x1, x2) - t;
      if (Math.abs(error) < 1e-7) break;
      const d = slope(s, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      s -= error / d;
    }
    if (!(s >= 0 && s <= 1) || Math.abs(axis(s, x1, x2) - t) > 1e-6) {
      let lo = 0;
      let hi = 1;
      s = t;
      for (let i = 0; i < 40; i++) {
        if (axis(s, x1, x2) < t) lo = s;
        else hi = s;
        s = (lo + hi) / 2;
      }
    }
    return axis(s, y1, y2);
  };
}

export type TweenOptions = {
  from: number;
  to: number;
  /** A duration token's name, such as `motion-fill`. */
  duration: string;
  /** An easing token's name, such as `ease-standard`. */
  ease: string;
  /** Where the tokens are read; the root when omitted. */
  element?: Element;
  onFrame: (value: number) => void;
};

/**
 * Animates a number from `from` to `to` over a duration token and an easing
 * token, calling `onFrame` once per animation frame. When the duration reads
 * 0, as it does under reduced motion, it calls `onFrame` once with `to` at
 * once. Returns a function that cancels the animation.
 */
export function tween(options: TweenOptions): () => void {
  const { from, to, element, onFrame } = options;
  const duration = readDuration(options.duration, element);
  if (duration <= 0 || typeof requestAnimationFrame === "undefined") {
    onFrame(to);
    return () => {};
  }
  const curve = readEase(options.ease, element);
  let start: number | undefined;
  let frame = 0;
  // Set by the cancel function, so a cancel from inside onFrame stops the
  // frame that step would otherwise schedule after it.
  let cancelled = false;
  const step = (now: number) => {
    start ??= now;
    const progress = Math.min(1, (now - start) / duration);
    onFrame(progress === 1 ? to : from + (to - from) * curve(progress));
    if (progress < 1 && !cancelled) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
}
