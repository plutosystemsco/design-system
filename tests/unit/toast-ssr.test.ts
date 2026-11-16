/**
 * 026 test 29: on the server every `toast` call is a no-op, and the queue is
 * created only in a browser, on the first call there (026 decision 18).
 */
import { afterAll, describe, expect, test } from "bun:test";
import { toast, toastQueue } from "../../src/lib/registry/ui/toast/toast.ts";
import type { Snapshot } from "../../src/lib/registry/ui/toast/toast-queue.ts";

const g = globalThis as { document?: unknown };

describe("026: server safety", () => {
  afterAll(() => {
    toastQueue()?.dismiss(undefined, "unmount");
    delete g.document;
  });

  test("29. on the server every call is a no-op", () => {
    expect(g.document).toBeUndefined();
    expect(toast.success("x")).toBe("");
    expect(toast("x")).toBe("");
    expect(toast.error("x")).toBe("");
    expect(
      toast.promise(Promise.resolve(1), {
        loading: "a",
        success: "b",
        error: "c",
      }),
    ).toBe("");
    expect(toastQueue()).toBeUndefined();

    g.document = {};
    const id = toast.success("y");
    expect(id).not.toBe("");
    let last: Snapshot | undefined;
    toastQueue()!.subscribe(
      (s) => (last = s),
      () => {},
    );
    expect(last!.showing.map((t) => t.title)).toEqual(["y"]);
    expect(last!.waiting).toBe(0);
  });
});
