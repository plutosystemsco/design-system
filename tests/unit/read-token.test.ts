/**
 * 009 decision 10, criterion 12 (the unit half): `read-token` reads a runtime
 * variable, a duration and an easing, and tweens a number. Bun has no
 * document, so it is the server: `readToken` returns "". The browser half is
 * in `tests/e2e/expressive.spec.ts`.
 */
import { afterEach, describe, expect, test } from "bun:test";
import {
  readDuration,
  readEase,
  readToken,
  tween,
} from "../../src/lib/registry/lib/read-token.ts";

const g = globalThis as Record<string, unknown>;

/** A stand-in document whose root holds the given custom properties. */
function stubDocument(vars: Record<string, string>) {
  const root = { vars };
  g.document = { documentElement: root };
  g.getComputedStyle = (el: { vars: Record<string, string> }) => ({
    getPropertyValue: (name: string) => el.vars[name] ?? "",
  });
  return root;
}

/**
 * A stand-in frame clock. Each request gets its own id; a cancel removes only
 * the frame with that id. `next(now)` runs the oldest frame still pending.
 */
function stubFrames() {
  const pending = new Map<number, (now: number) => void>();
  let id = 0;
  g.requestAnimationFrame = (cb: (now: number) => void) => {
    pending.set(++id, cb);
    return id;
  };
  g.cancelAnimationFrame = (frame: number) => pending.delete(frame);
  return {
    pending,
    next(now: number) {
      const [first] = pending;
      if (!first) return;
      pending.delete(first[0]);
      first[1](now);
    },
  };
}

afterEach(() => {
  delete g.document;
  delete g.getComputedStyle;
  delete g.requestAnimationFrame;
  delete g.cancelAnimationFrame;
});

describe("on the server", () => {
  test('readToken returns "" when there is no document', () => {
    expect(typeof document).toBe("undefined");
    expect(readToken("mark-1")).toBe("");
  });

  test("tween with a 0ms duration calls onFrame once, with the final value", () => {
    const frames: number[] = [];
    const cancel = tween({
      from: 0,
      to: 42,
      duration: "motion-fill",
      ease: "ease-standard",
      onFrame: (v) => frames.push(v),
    });
    expect(frames).toEqual([42]);
    expect(typeof cancel).toBe("function");
  });
});

describe("in a document", () => {
  test("readToken trims the value of --<name> on the root, or on an element", () => {
    stubDocument({ "--mark-1": " #2456E6 " });
    expect(readToken("mark-1")).toBe("#2456E6");
    const el = { vars: { "--mark-1": "#7A9BFF" } } as unknown as Element;
    expect(readToken("mark-1", el)).toBe("#7A9BFF");
    expect(readToken("no-such-token")).toBe("");
  });

  test("readDuration reads ms and s, and 0 for an empty or unreadable value", () => {
    stubDocument({
      "--motion-reveal": "600ms",
      "--motion-busy": ".4s",
      "--motion-micro": "0ms",
      "--motion-odd": "fast",
    });
    expect(readDuration("motion-reveal")).toBe(600);
    expect(readDuration("motion-busy")).toBe(400);
    expect(readDuration("motion-micro")).toBe(0);
    expect(readDuration("motion-odd")).toBe(0);
    expect(readDuration("motion-none")).toBe(0);
  });

  // Review finding 4: `..ms` matches the pattern but parses to NaN.
  test("readDuration reads 0 for a value that matches but is not a number", () => {
    stubDocument({ "--motion-odd": "..ms", "--motion-dots": ".s" });
    expect(readDuration("motion-odd")).toBe(0);
    expect(readDuration("motion-dots")).toBe(0);
  });

  test("tween over a duration that is not a number lands on the final value at once", () => {
    stubDocument({ "--motion-odd": "..ms" });
    g.requestAnimationFrame = () => {
      throw new Error("no frame should be requested");
    };
    const frames: number[] = [];
    tween({
      from: 0,
      to: 7,
      duration: "motion-odd",
      ease: "ease-standard",
      onFrame: (v) => frames.push(v),
    });
    expect(frames).toEqual([7]);
  });

  // Review finding 5: the server's 0 ms test has no requestAnimationFrame, so
  // it cannot tell the duration check from the missing clock. Here the clock
  // is present and throws if it is used.
  test("tween with a 0ms duration, with a frame clock present, calls onFrame once with the final value", () => {
    stubDocument({ "--motion-fill": "0ms" });
    g.requestAnimationFrame = () => {
      throw new Error("no frame should be requested");
    };
    const frames: number[] = [];
    const cancel = tween({
      from: 0,
      to: 42,
      duration: "motion-fill",
      ease: "ease-standard",
      onFrame: (v) => frames.push(v),
    });
    expect(frames).toEqual([42]);
    expect(typeof cancel).toBe("function");
  });

  test("readEase parses a cubic-bezier into t → eased t", () => {
    stubDocument({
      "--ease-standard": "cubic-bezier(0.2, 0.7, 0.2, 1)",
      "--ease-short": "cubic-bezier(.2,.7,.2,1)",
      "--ease-linear": "cubic-bezier(0, 0, 1, 1)",
    });
    const ease = readEase("ease-standard");
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    // Fast out of the gate, settling slowly: past the midpoint at half time.
    expect(ease(0.5)).toBeGreaterThan(0.8);
    expect(ease(0.25)).toBeLessThan(ease(0.5));
    expect(readEase("ease-short")(0.5)).toBeCloseTo(ease(0.5), 6);
    const linear = readEase("ease-linear");
    for (const t of [0.1, 0.3, 0.7]) expect(linear(t)).toBeCloseTo(t, 4);
  });

  test("readEase falls back to linear when the token is not a cubic-bezier", () => {
    stubDocument({});
    expect(readEase("ease-none")(0.3)).toBeCloseTo(0.3, 9);
  });

  test("tween over a duration calls onFrame per frame, ends on the final value, and stops when cancelled", () => {
    stubDocument({
      "--motion-fill": "700ms",
      "--ease-linear": "cubic-bezier(0, 0, 1, 1)",
    });
    const clock = stubFrames();
    const frames: number[] = [];
    tween({
      from: 0,
      to: 100,
      duration: "motion-fill",
      ease: "ease-linear",
      onFrame: (v) => frames.push(v),
    });
    for (const now of [1000, 1350, 1700, 1800]) clock.next(now);
    expect(frames[0]).toBe(0);
    expect(frames[1]).toBeCloseTo(50, 1);
    expect(frames.at(-1)).toBe(100);
    expect(frames).toHaveLength(3);

    // A second tween runs beside the cancelled one; the cancel removes only
    // the cancelled tween's own frame.
    const cancelled: number[] = [];
    const other: number[] = [];
    const cancel = tween({
      from: 0,
      to: 1,
      duration: "motion-fill",
      ease: "ease-linear",
      onFrame: (v) => cancelled.push(v),
    });
    tween({
      from: 0,
      to: 1,
      duration: "motion-fill",
      ease: "ease-linear",
      onFrame: (v) => other.push(v),
    });
    clock.next(0);
    clock.next(0);
    expect(clock.pending.size).toBe(2);
    cancel();
    expect(clock.pending.size).toBe(1);
    for (const now of [350, 700]) clock.next(now);
    expect(cancelled).toEqual([0]);
    expect(other).toEqual([0, expect.closeTo(0.5, 3), 1] as never);
  });

  // Review finding 4: a cancel from inside onFrame stops the tween.
  test("tween stops when cancelled from inside onFrame", () => {
    stubDocument({
      "--motion-fill": "700ms",
      "--ease-linear": "cubic-bezier(0, 0, 1, 1)",
    });
    const clock = stubFrames();
    const frames: number[] = [];
    const cancel = tween({
      from: 0,
      to: 100,
      duration: "motion-fill",
      ease: "ease-linear",
      onFrame: (v) => {
        frames.push(v);
        if (frames.length === 2) cancel();
      },
    });
    for (let now = 0; now <= 700; now += 70) clock.next(now);
    expect(frames).toHaveLength(2);
    expect(clock.pending.size).toBe(0);
  });
});
