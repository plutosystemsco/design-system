/**
 * 026 tests 1 to 27: the toast queue, with an injected clock. Bun's runner
 * cannot compile a rune module, so the queue is plain TypeScript and its
 * clock and frame scheduler are passed in (026 decision 21). A frame is 16 ms
 * of the fake clock.
 */
import { describe, expect, test } from "bun:test";
import {
  createToastQueue,
  TOAST_MIN_MS,
  TOAST_MODAL_HOLD_MS,
  TOAST_MS_PER_WORD,
  TOAST_PROMISE_GRACE_MS,
  TOAST_ROUTE_HOLD_MS,
  type Snapshot,
  type Speech,
  type ToastCloseReason,
} from "../../src/lib/registry/ui/toast/toast-queue.ts";

const FRAME = 16;

/** A fake clock, a queue on it, and what the queue drew and said. */
function harness(options: { subscribe?: boolean } = {}) {
  let t = 0;
  let seq = 0;
  const timers = new Map<number, { at: number; fn: () => void }>();
  const warnings: string[] = [];
  const setTimeout = (fn: () => void, ms: number) => {
    const id = ++seq;
    timers.set(id, { at: t + Math.max(0, ms), fn });
    return id;
  };
  const queue = createToastQueue({
    now: () => t,
    setTimeout,
    clearTimeout: (h) => void timers.delete(h as number),
    frame: (fn) => void setTimeout(fn, FRAME),
    warn: (m) => void warnings.push(m),
  });
  const snapshots: Snapshot[] = [];
  const said: (Speech & { at: number })[] = [];
  const subscribe = () =>
    queue.subscribe(
      (s) => snapshots.push(s),
      (s) => said.push({ ...s, at: t }),
    );
  if (options.subscribe !== false) subscribe();

  /** Runs every timer due within `ms`, in time order. */
  function advance(ms: number) {
    const end = t + ms;
    for (;;) {
      let next: [number, { at: number; fn: () => void }] | undefined;
      for (const e of timers)
        if (
          e[1].at <= end &&
          (!next ||
            e[1].at < next[1].at ||
            (e[1].at === next[1].at && e[0] < next[0]))
        )
          next = e;
      if (!next) break;
      timers.delete(next[0]);
      t = next[1].at;
      next[1].fn();
    }
    t = end;
  }

  /** As `advance`, a few ms at a time, letting promise callbacks run between. */
  async function advanceAsync(ms: number, step = 4) {
    for (let done = 0; done < ms; done += step) {
      advance(Math.min(step, ms - done));
      for (let i = 0; i < 4; i++) await Promise.resolve();
    }
  }

  const last = () => snapshots[snapshots.length - 1]!;
  const showing = () => last().showing.map((s) => s.title);
  const ids = () => last().showing.map((s) => s.id);
  /** The words written to the regions; a clear ("") is not speech. */
  const spoken = (channel?: Speech["channel"]) =>
    said.filter((s) => s.text !== "" && (!channel || s.channel === channel));
  return {
    queue,
    advance,
    advanceAsync,
    subscribe,
    snapshots,
    said,
    spoken,
    warnings,
    last,
    showing,
    ids,
    now: () => t,
  };
}

const words = (n: number) =>
  Array.from({ length: n }, (_, i) => `word${i + 1}`).join(" ");

describe("026: timing", () => {
  test("1. success and info leave at max(6000, 2000 + 300 × words)", () => {
    expect(TOAST_MIN_MS).toBe(6000);
    expect(TOAST_MS_PER_WORD).toBe(300);
    const h = harness();
    h.queue.raise("success", "Project saved now");
    h.advance(5999);
    expect(h.showing()).toEqual(["Project saved now"]);
    h.advance(1);
    expect(h.showing()).toEqual([]);

    const i = harness();
    i.queue.raise("info", words(30));
    i.advance(10_999);
    expect(i.showing()).toHaveLength(1);
    i.advance(1);
    expect(i.showing()).toEqual([]);
  });

  test("2. duration lengthens, never shortens, and Infinity keeps", () => {
    const closesAt = (duration: number) => {
      const h = harness();
      h.queue.raise("success", "Saved", { duration });
      let at = 0;
      while (h.showing().length && at < 600_000) {
        h.advance(1000);
        at += 1000;
      }
      return { at, warnings: h.warnings.length };
    };
    expect(closesAt(2000)).toEqual({ at: 6000, warnings: 0 });
    expect(closesAt(12_000)).toEqual({ at: 12_000, warnings: 0 });
    expect(closesAt(Infinity)).toEqual({ at: 600_000, warnings: 0 });
    expect(closesAt(2 ** 31)).toEqual({ at: 600_000, warnings: 0 });
    expect(closesAt(Number.NaN)).toEqual({ at: 6000, warnings: 1 });
    expect(closesAt(-5)).toEqual({ at: 6000, warnings: 1 });

    const e = harness();
    e.queue.raise("error", "Couldn't save", { duration: 8000 });
    e.advance(600_000);
    expect(e.showing()).toEqual(["Couldn't save"]);
  });

  test("3. error, caution, loading and action toasts never leave", () => {
    const h = harness();
    h.queue.setMax(5);
    h.queue.raise("error", "E");
    h.queue.raise("caution", "C");
    h.queue.raise("loading", "L");
    h.queue.raise("info", "A", { action: { label: "Undo", onclick() {} } });
    h.advance(600_000);
    expect(h.showing().sort()).toEqual(["A", "C", "E", "L"]);
  });

  test("4. a pause keeps the remaining time", () => {
    const h = harness();
    h.queue.raise("success", "Saved");
    h.advance(4000);
    h.queue.pause("hover");
    h.advance(60_000);
    expect(h.showing()).toEqual(["Saved"]);
    h.queue.resume("hover");
    h.advance(1999);
    expect(h.showing()).toEqual(["Saved"]);
    h.advance(1);
    expect(h.showing()).toEqual([]);
  });

  test("5. pause causes count apart", () => {
    const h = harness();
    h.queue.raise("success", "Saved");
    h.queue.pause("hover");
    h.queue.pause("focus");
    h.queue.resume("hover");
    h.advance(60_000);
    expect(h.showing()).toEqual(["Saved"]);
    h.queue.resume("focus");
    h.advance(5999);
    expect(h.showing()).toEqual(["Saved"]);
    h.advance(1);
    expect(h.showing()).toEqual([]);
  });

  test("6. timers off stops every clock, and on resumes it", () => {
    const h = harness();
    h.queue.raise("success", "Saved");
    h.queue.raise("info", "Sent");
    h.advance(1000);
    h.queue.setTimers(false);
    h.advance(60_000);
    expect(h.showing()).toHaveLength(2);
    h.queue.setTimers(true);
    h.advance(4999);
    expect(h.showing()).toHaveLength(2);
    h.advance(1);
    expect(h.showing()).toEqual([]);
  });
});

describe("026: the stack", () => {
  test("7. max show; the rest wait, unspoken and unclocked", () => {
    const h = harness();
    for (let i = 1; i <= 5; i++) h.queue.raise("success", `Saved ${i}`);
    expect(h.last().showing).toHaveLength(3);
    expect(h.last().waiting).toBe(2);
    h.advance(3500);
    expect(h.spoken().map((s) => s.text)).toEqual([
      "Success: Saved 1.",
      "Success: Saved 2.",
      "Success: Saved 3.",
    ]);
    // The first closes: the fourth shows, is spoken, and runs its own 6 s.
    h.queue.dismiss(h.ids().at(-1));
    expect(h.showing()).toEqual(["Saved 4", "Saved 3", "Saved 2"]);
    const shownAt = h.now();
    h.advance(2000);
    expect(h.spoken().map((s) => s.text)).toContain("Success: Saved 4.");
    h.advance(shownAt + 5999 - h.now());
    expect(h.showing()).toContain("Saved 4");
    h.advance(1);
    expect(h.showing()).not.toContain("Saved 4");
  });

  test("8. an error takes the oldest free timed toast's place", () => {
    const h = harness();
    const a = h.queue.raise("success", "A");
    h.advance(4000);
    const b = h.queue.raise("success", "B");
    const c = h.queue.raise("loading", "C");
    const e = h.queue.raise("error", "E");
    expect([...h.ids()].sort()).toEqual([b, c, e].sort());
    // Newest first: the error, then C, then B.
    expect(h.ids()).toEqual([e, c, b]);
    const waiting = h.queue.entries().waiting;
    expect(waiting.map((w) => w.id)).toEqual([a]);
    expect(waiting[0]!.remaining).toBe(2000);
    h.advance(5000);
    h.queue.dismiss(e);
    expect(h.ids()).toContain(a);
    h.advance(5000);
    expect(h.spoken().filter((s) => s.text === "Success: A.")).toHaveLength(1);
  });

  test("9. an error waits first when no showing toast qualifies", () => {
    const h = harness();
    for (const n of ["L1", "L2", "L3"]) h.queue.raise("loading", n);
    h.queue.raise("info", "I");
    h.queue.raise("error", "E");
    expect(h.queue.entries().waiting.map((w) => w.title)).toEqual(["E", "I"]);
  });

  test("10. displacement skips a toast held by focus or the pointer", () => {
    const h = harness();
    h.queue.setMax(1);
    const a = h.queue.raise("success", "A");
    h.queue.hold(a, "focus", true);
    const e = h.queue.raise("error", "E");
    expect(h.ids()).toEqual([a]);
    expect(h.queue.entries().waiting.map((w) => w.id)).toEqual([e]);
    h.queue.hold(a, "focus", false);
    h.queue.dismiss(a);
    expect(h.ids()).toEqual([e]);
  });

  // The change review, finding 3: focus and the pointer hold apart.
  test("10b. the pointer passing over a focused toast does not free it", () => {
    const h = harness();
    h.queue.setMax(1);
    const a = h.queue.raise("success", "A");
    h.queue.hold(a, "focus", true);
    h.queue.hold(a, "pointer", true);
    h.queue.hold(a, "pointer", false);
    const e = h.queue.raise("error", "E");
    expect(h.ids()).toEqual([a]);
    expect(h.queue.entries().waiting.map((w) => w.id)).toEqual([e]);
    expect(h.queue.entries().showing[0]!.held).toBe(true);
    // Focus leaves too: now it is free, and the error shows when A closes.
    h.queue.hold(a, "focus", false);
    expect(h.queue.entries().showing[0]!.held).toBe(false);
    h.queue.dismiss(a);
    expect(h.ids()).toEqual([e]);
  });

  test("11. a smaller max keeps the held toast", () => {
    const h = harness();
    const [x, y, z] = ["X", "Y", "Z"].map((n) => h.queue.raise("success", n));
    h.queue.hold(y!, "pointer", true);
    h.queue.setMax(1);
    expect(h.ids()).toEqual([y]);
    expect(h.last().waiting).toBe(2);
    expect(h.queue.entries().waiting.map((w) => w.id)).toEqual([x, z]);
    h.queue.hold(y!, "pointer", false);
    expect(h.ids()).toEqual([y]);
    expect(h.last().waiting).toBe(2);
  });

  test("12. newest first", () => {
    const h = harness();
    const raised = ["a", "b", "c"].map((n) => h.queue.raise("info", n));
    expect(h.ids()).toEqual([...raised].reverse());
  });
});

describe("026: updates, repeats and callbacks", () => {
  test("13. an id updates in place", () => {
    const h = harness();
    h.queue.raise("loading", "Saving…", { id: "x" });
    h.advance(10_000);
    h.queue.raise("success", "Saved", { id: "x" });
    expect(h.last().showing).toHaveLength(1);
    expect(h.last().showing[0]!.kind).toBe("success");
    h.advance(5999);
    expect(h.ids()).toEqual(["x"]);
    h.advance(1);
    expect(h.ids()).toEqual([]);
    expect(h.spoken().map((s) => s.text)).toEqual([
      "Saving…",
      "Success: Saved.",
    ]);
  });

  test("14. an update's onclose replaces the old one, which runs as replaced", () => {
    const calls: string[] = [];
    const f = (r: ToastCloseReason) => calls.push(`f:${r}`);
    const g = (r: ToastCloseReason) => calls.push(`g:${r}`);

    const h = harness();
    h.queue.raise("error", "One", { id: "x", onclose: f });
    h.queue.raise("error", "Two", { id: "x", onclose: g });
    expect(calls).toEqual(["f:replaced"]);
    h.queue.dismiss("x", "dismiss");
    expect(calls).toEqual(["f:replaced", "g:dismiss"]);

    calls.length = 0;
    const k = harness();
    k.queue.raise("error", "One", { id: "x", onclose: f });
    k.queue.raise("error", "Two", { id: "x" });
    expect(calls).toEqual([]);
    k.queue.dismiss("x", "dismiss");
    expect(calls).toEqual(["f:dismiss"]);

    calls.length = 0;
    const s = harness();
    s.queue.raise("error", "One", { id: "x", onclose: f });
    s.queue.raise("error", "Two", { id: "x", onclose: f });
    expect(calls).toEqual([]);
    s.queue.dismiss("x", "dismiss");
    s.queue.dismiss("x", "dismiss");
    expect(calls).toEqual(["f:dismiss"]);
  });

  test("15. a loading toast's own updates are silent", () => {
    const h = harness();
    for (let i = 1; i <= 3; i++)
      h.queue.raise("loading", `Uploading ${i} of 3`, { id: "x" });
    h.advance(5000);
    expect(h.spoken()).toHaveLength(1);
    h.queue.raise("error", "Upload failed", { id: "x" });
    h.advance(5000);
    expect(h.spoken().map((s) => s.text)).toEqual([
      "Uploading 1 of 3.",
      "Error: Upload failed.",
    ]);
  });

  test("16. a plain repeat refreshes and speaks again", () => {
    const h = harness();
    const first = h.queue.raise("success", "Saved");
    h.advance(3000);
    const second = h.queue.raise("success", "Saved");
    expect(second).toBe(first);
    expect(h.last().showing).toHaveLength(1);
    h.advance(5999);
    expect(h.showing()).toEqual(["Saved"]);
    h.advance(1);
    expect(h.showing()).toEqual([]);
    expect(h.spoken().map((s) => s.text)).toEqual([
      "Success: Saved.",
      "Success: Saved.",
    ]);
  });

  test("17. two action toasts with equal text stay two", () => {
    const calls: string[] = [];
    const h = harness();
    const undo1 = () => calls.push("undo1");
    const undo2 = () => calls.push("undo2");
    h.queue.raise("info", "Message deleted", {
      action: { label: "Undo", onclick: undo1 },
      onclose: (r) => calls.push(`f:${r}`),
    });
    h.queue.raise("info", "Message deleted", {
      action: { label: "Undo", onclick: undo2 },
      onclose: (r) => calls.push(`g:${r}`),
    });
    const shown = h.last().showing;
    expect(shown).toHaveLength(2);
    for (const t of shown) t.action!.onclick();
    expect(calls.sort()).toEqual(["undo1", "undo2"]);
    calls.length = 0;
    for (const t of shown) h.queue.dismiss(t.id, "dismiss");
    expect(calls.sort()).toEqual(["f:dismiss", "g:dismiss"]);

    const k = harness();
    k.queue.raise("success", "Saved", { onclose() {} });
    k.queue.raise("success", "Saved", { onclose() {} });
    expect(k.last().showing).toHaveLength(2);
  });
});

describe("026: promises", () => {
  /** A promise that settles `ms` into the fake clock, checked by `run`. */
  const later = <T>(
    h: ReturnType<typeof harness>,
    ms: number,
    value: T,
    fail = false,
  ) =>
    new Promise<T>((resolve, reject) => {
      const start = h.now();
      const tick = () => {
        if (h.now() - start >= ms) (fail ? reject : resolve)(value as T);
        else pending.push(tick);
      };
      pending.push(tick);
    });
  let pending: (() => void)[] = [];
  /** Advances 4 ms at a time, settling due promises and their callbacks between. */
  async function run(h: ReturnType<typeof harness>, ms: number) {
    for (let done = 0; done < ms; done += 4) {
      h.advance(4);
      const now = pending;
      pending = [];
      for (const fn of now) fn();
      for (let i = 0; i < 4; i++) await Promise.resolve();
    }
  }

  test("18. a promise settled within 400 ms shows no loading toast", async () => {
    expect(TOAST_PROMISE_GRACE_MS).toBe(400);
    const h = harness();
    h.queue.promise(later(h, 300, "ok"), {
      loading: "Saving…",
      success: "Saved",
      error: "Couldn't save",
    });
    await run(h, 3000);
    expect(
      h.snapshots.some((s) => s.showing.some((t) => t.kind === "loading")),
    ).toBe(false);
    expect(h.spoken().map((s) => s.text)).toEqual(["Success: Saved."]);
  });

  test("19. a slower promise replaces its loading toast in place", async () => {
    const h = harness();
    const closed: string[] = [];
    const id = h.queue.promise(
      later(h, 1500, "ok"),
      { loading: "Saving…", success: "Saved", error: "Couldn't save" },
      { onclose: (r) => closed.push(r) },
    );
    await run(h, 396);
    expect(h.showing()).toEqual([]);
    await run(h, 8);
    expect(h.last().showing.map((t) => [t.id, t.kind])).toEqual([
      [id, "loading"],
    ]);
    await run(h, 1200);
    expect(h.last().showing.map((t) => [t.id, t.kind])).toEqual([
      [id, "success"],
    ]);
    expect(closed).toEqual([]);
  });

  test("20. a dismissed loading toast's result still comes, with the promise's onclose", async () => {
    const h = harness();
    const closed: string[] = [];
    const id = h.queue.promise(
      later(h, 1500, "ok"),
      { loading: "Saving…", success: (v) => `Saved ${v}`, error: "No" },
      { onclose: (r) => closed.push(r) },
    );
    await run(h, 600);
    h.queue.dismiss(id, "dismiss");
    expect(closed).toEqual([]);
    await run(h, 1000);
    expect(h.last().showing.map((t) => [t.id, t.kind, t.title])).toEqual([
      [id, "success", "Saved ok"],
    ]);
    h.queue.dismiss(id, "dismiss");
    expect(closed).toEqual(["dismiss"]);
  });

  test("a rejected promise is an error, and the app's own catch still runs", async () => {
    const h = harness();
    const p = later(h, 1000, new Error("offline"), true);
    let caught = false;
    p.catch(() => (caught = true));
    h.queue.promise(p, {
      loading: "Saving…",
      success: "Saved",
      error: (e) => `Couldn't save: ${(e as Error).message}`,
    });
    await run(h, 1200);
    expect(caught).toBe(true);
    expect(h.last().showing.map((t) => [t.kind, t.title])).toEqual([
      ["error", "Couldn't save: offline"],
    ]);
  });
});

describe("026: close reasons", () => {
  test("21. each onclose runs once, with its reason", () => {
    const reasons: ToastCloseReason[] = [];
    const onclose = (r: ToastCloseReason) => reasons.push(r);

    const h = harness();
    h.queue.setMax(10);
    h.queue.raise("error", "1", { id: "1", onclose });
    h.queue.dismiss("1", "dismiss");
    h.queue.raise("success", "2", { id: "2", onclose });
    h.advance(6000);
    h.queue.raise("error", "3", { id: "3", onclose });
    h.queue.dismiss("3", "action");
    h.queue.raise("success", "4", { id: "4", onclose });
    h.queue.navigating();
    h.queue.navigated();
    h.queue.navigating();
    h.queue.navigated();
    h.queue.raise("error", "5", { id: "5", onclose });
    h.queue.dismiss("5");
    h.queue.raise("error", "6", { id: "6", onclose });
    h.queue.raise("error", "6b", { id: "6", onclose: () => {} });
    h.queue.raise("error", "7", { id: "7", onclose });
    h.queue.dismiss(undefined, "unmount");
    // Closing again calls nothing.
    for (const id of ["1", "2", "3", "4", "5", "6", "7"])
      h.queue.dismiss(id, "dismiss");
    expect(reasons).toEqual([
      "dismiss",
      "timeout",
      "action",
      "navigation",
      "api",
      "replaced",
      "unmount",
    ]);
  });
});

describe("026: navigation", () => {
  test("22. a timed toast survives one navigation; the rest stay", () => {
    const h = harness();
    h.queue.setMax(10);
    h.queue.setTimers(false);
    h.queue.raise("success", "Project created");
    h.queue.raise("info", "Message deleted", {
      action: { label: "Undo", onclick() {} },
    });
    h.queue.raise("error", "E");
    h.queue.raise("caution", "C");
    h.queue.raise("loading", "L");
    h.queue.navigating();
    h.queue.navigated();
    expect(h.showing()).toContain("Project created");
    expect(h.showing()).toContain("Message deleted");
    h.queue.navigating();
    h.queue.navigated();
    expect(h.showing().sort()).toEqual(["C", "E", "L", "Message deleted"]);

    // Hydration's afterNavigate has no beforeNavigate: it is not a navigation.
    const k = harness();
    k.queue.setTimers(false);
    k.queue.raise("success", "Welcome back");
    k.queue.navigated();
    k.queue.navigating();
    k.queue.navigated();
    expect(k.showing()).toEqual(["Welcome back"]);
  });

  test("23. navigating holds speech; navigated releases it", () => {
    expect(TOAST_ROUTE_HOLD_MS).toBe(1500);
    const h = harness();
    h.advance(100);
    h.queue.navigating();
    h.queue.raise("success", "Project created");
    h.queue.raise("error", "Couldn't load");
    h.advance(500);
    expect(h.spoken()).toEqual([]);
    const at = h.now();
    h.queue.navigated();
    h.advance(2000);
    const polite = h.spoken("polite")[0]!;
    const assertive = h.spoken("assertive")[0]!;
    expect(polite.at - at).toBeGreaterThan(0);
    expect(polite.at - at).toBeLessThanOrEqual(2 * FRAME);
    expect(assertive.at - at).toBeGreaterThanOrEqual(1500);
    expect(assertive.at - at).toBeLessThanOrEqual(1500 + 2 * FRAME);

    // A hold with no release ends by itself at 3 s.
    const k = harness();
    k.queue.navigating();
    k.queue.raise("success", "Saved");
    k.advance(2999);
    expect(k.spoken()).toEqual([]);
    k.advance(100);
    expect(k.spoken().map((s) => s.text)).toEqual(["Success: Saved."]);
  });
});

describe("026: modals", () => {
  test("24. a modal holds new toasts, and their speech waits after it closes", () => {
    expect(TOAST_MODAL_HOLD_MS).toBe(1000);
    const h = harness();
    h.queue.raise("success", "Before");
    h.advance(1000);
    h.queue.pause("modal");
    h.queue.raise("success", "Project deleted");
    h.advance(5000);
    expect(h.showing()).toEqual(["Before"]);
    expect(h.spoken().map((s) => s.text)).toEqual(["Success: Before."]);
    expect(h.queue.entries().showing[0]!.remaining).toBe(5000);
    h.queue.resume("modal");
    const closed = h.now();
    expect(h.showing()).toEqual(["Project deleted", "Before"]);
    h.advance(999);
    expect(h.spoken()).toHaveLength(1);
    h.advance(2 * FRAME);
    expect(h.spoken().map((s) => s.text)).toEqual([
      "Success: Before.",
      "Success: Project deleted.",
    ]);
    expect(h.spoken()[1]!.at - closed).toBeGreaterThanOrEqual(1000);

    // A modal closed 200 ms after navigated(): the later hold's end wins.
    const k = harness();
    k.queue.pause("modal");
    k.queue.navigating();
    k.queue.raise("success", "Moved");
    k.queue.raise("error", "Couldn't move");
    k.advance(100);
    const nav = k.now();
    k.queue.navigated();
    k.advance(200);
    k.queue.resume("modal");
    k.advance(3000);
    const polite = k.spoken("polite")[0]!;
    const assertive = k.spoken("assertive")[0]!;
    expect(polite.at - nav).toBeGreaterThanOrEqual(1200);
    expect(polite.at - nav).toBeLessThanOrEqual(1200 + 2 * FRAME);
    expect(assertive.at - nav).toBeGreaterThanOrEqual(1500);
    expect(assertive.at - nav).toBeLessThanOrEqual(1500 + 2 * FRAME);
  });
});

describe("026: the announcers' one schedule", () => {
  test("25. toasts raised before a subscriber are kept", () => {
    const h = harness({ subscribe: false });
    h.queue.raise("success", "Welcome back");
    h.advance(10_000);
    h.subscribe();
    expect(h.showing()).toEqual(["Welcome back"]);
    h.advance(FRAME);
    expect(h.spoken()).toEqual([]);
    h.advance(2 * FRAME);
    expect(h.spoken().map((s) => s.text)).toEqual(["Success: Welcome back."]);
  });

  test("26. an error does not silence a success raised beside it", () => {
    const h = harness();
    h.advance(100);
    h.queue.raise("success", "Record A saved");
    h.queue.raise("error", "Couldn't save Record B");
    const t0 = h.now();
    h.advance(FRAME);
    const writes = () => h.spoken().map((s) => [s.channel, s.text, s.at - t0]);
    expect(writes()).toEqual([
      ["polite", "Success: Record A saved.", FRAME],
      ["assertive", "Error: Couldn't save Record B.", FRAME],
    ]);
    h.advance(400);
    h.queue.raise("success", "Record C saved");
    h.advance(3000);
    const all = h.spoken();
    const alertClear = h.said.find(
      (s) => s.channel === "assertive" && s.text === "",
    )!;
    expect(alertClear.at - t0).toBe(FRAME + 1000);
    const again = all.filter((s) => s.text === "Success: Record A saved.");
    expect(again).toHaveLength(2);
    expect(again[1]!.at).toBe(alertClear.at + FRAME);
    const c = all.find((s) => s.text === "Success: Record C saved.")!;
    expect(c.at).toBeGreaterThan(alertClear.at);
  });

  // The change review, finding 4: the schedule's rules, each held by a test.
  test("26b. while an error is held, a polite message waits for it to clear", () => {
    const h = harness();
    h.advance(100);
    h.queue.raise("error", "Couldn't save");
    h.advance(500);
    h.queue.raise("success", "Record saved");
    h.advance(3000);
    const clear = h.said.find(
      (s) => s.channel === "assertive" && s.text === "",
    )!;
    const saved = h.spoken("polite")[0]!;
    expect(saved.text).toBe("Success: Record saved.");
    expect(saved.at).toBeGreaterThan(clear.at);
  });

  test("26c. a success raised with two errors is heard again once, after the last error", () => {
    const h = harness();
    h.advance(100);
    h.queue.raise("success", "Record A saved");
    h.queue.raise("error", "Couldn't save Record B");
    h.queue.raise("error", "Couldn't save Record C");
    h.advance(6000);
    const success = h
      .spoken("polite")
      .filter((s) => s.text === "Success: Record A saved.");
    expect(success).toHaveLength(2);
    const lastError = h.said.filter(
      (s) => s.channel === "assertive" && s.text === "",
    );
    expect(lastError).toHaveLength(2);
    expect(success[1]!.at).toBeGreaterThan(lastError[1]!.at);
  });

  test("26d. a rewrite is written once, even when another error interrupts it", () => {
    const h = harness();
    h.advance(100);
    h.queue.raise("success", "Record A saved");
    h.queue.raise("error", "Couldn't save Record B");
    // Until the rewrite is in the region.
    let rewrite: number | undefined;
    for (let i = 0; i < 400 && rewrite === undefined; i++) {
      h.advance(8);
      const s = h
        .spoken("polite")
        .filter((x) => x.text === "Success: Record A saved.");
      if (s.length === 2) rewrite = s[1]!.at;
    }
    expect(rewrite).toBeDefined();
    h.queue.raise("error", "Couldn't save Record C");
    h.advance(6000);
    expect(
      h.spoken("polite").filter((x) => x.text === "Success: Record A saved."),
    ).toHaveLength(2);
    expect(h.spoken("assertive")).toHaveLength(2);
  });

  test("8b. a waiting toast updated by id is spoken, in its new words, when it shows", () => {
    const h = harness();
    h.queue.setMax(1);
    h.queue.raise("success", "Uploaded 1 file", { id: "a" });
    // After its words have cleared, so the error interrupts nothing.
    h.advance(1500);
    const e = h.queue.raise("error", "Couldn't sync");
    expect(h.queue.entries().waiting.map((w) => w.id)).toEqual(["a"]);
    h.queue.raise("success", "Uploaded 2 files", { id: "a" });
    h.advance(3000);
    h.queue.dismiss(e);
    h.advance(3000);
    expect(h.spoken().map((s) => s.text)).toEqual([
      "Success: Uploaded 1 file.",
      "Error: Couldn't sync.",
      "Success: Uploaded 2 files.",
    ]);
  });

  test("a repeat of the region's text is cleared first, then written", () => {
    const h = harness();
    h.queue.raise("success", "Saved");
    h.advance(500);
    h.queue.raise("success", "Saved");
    h.advance(3000);
    const polite = h.said.filter((s) => s.channel === "polite");
    expect(polite.map((s) => s.text)).toEqual([
      "Success: Saved.",
      "",
      "Success: Saved.",
      "",
    ]);
  });
});

describe("026: a step aside", () => {
  test("27. a toast aside keeps its time", () => {
    const h = harness();
    const id = h.queue.raise("success", "Saved");
    h.advance(2000);
    h.queue.aside(id, true);
    expect(h.last().aside).toBe(1);
    expect(h.last().showing[0]!.aside).toBe(true);
    h.advance(60_000);
    expect(h.showing()).toEqual(["Saved"]);
    h.queue.aside(id, false);
    h.advance(3999);
    expect(h.showing()).toEqual(["Saved"]);
    h.advance(1);
    expect(h.showing()).toEqual([]);

    // A toast that shows while aside is still spoken.
    const k = harness();
    const j = k.queue.raise("success", "Shown aside");
    k.queue.aside(j, true);
    k.advance(100);
    expect(k.spoken().map((s) => s.text)).toEqual(["Success: Shown aside."]);
  });
});
