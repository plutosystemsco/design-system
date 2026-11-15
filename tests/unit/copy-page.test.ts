/**
 * 018 decision 6, and the re-check's ruling: Copy page writes the twin
 * through a ClipboardItem whose data is the fetch's promise, so the click's
 * user activation holds; where ClipboardItem is missing, or rejects a
 * promise value, it falls back to writeText of the awaited text.
 */
import { describe, expect, test } from "bun:test";
import { copyText } from "../../src/lib/site/copy-page.ts";

const text = Promise.resolve("# Button\n");

describe("018: Copy page", () => {
  test("with ClipboardItem, it writes one item whose text/plain is the promise", async () => {
    const written: unknown[] = [];
    class Item {
      constructor(public data: Record<string, Promise<Blob>>) {}
    }
    await copyText(text, {
      ClipboardItem: Item as unknown as typeof ClipboardItem,
      clipboard: {
        write: async (items: unknown[]) => void written.push(...items),
        writeText: async () => {
          throw new Error("not this path");
        },
      },
    });
    expect(written).toHaveLength(1);
    const blob = await (written[0] as Item).data["text/plain"];
    expect(await blob.text()).toBe("# Button\n");
  });

  test("without ClipboardItem, it falls back to writeText of the awaited text", async () => {
    let got = "";
    await copyText(text, {
      ClipboardItem: undefined,
      clipboard: {
        write: async () => {
          throw new Error("not this path");
        },
        writeText: async (t: string) => void (got = t),
      },
    });
    expect(got).toBe("# Button\n");
  });

  test("when ClipboardItem rejects a promise value, it falls back too", async () => {
    let got = "";
    class Item {
      constructor(data: Record<string, unknown>) {
        if (Object.values(data).some((v) => v instanceof Promise))
          throw new TypeError("promises not supported");
      }
    }
    await copyText(text, {
      ClipboardItem: Item as unknown as typeof ClipboardItem,
      clipboard: {
        write: async () => undefined,
        writeText: async (t: string) => void (got = t),
      },
    });
    expect(got).toBe("# Button\n");
  });

  test("when write rejects, it falls back to writeText", async () => {
    let got = "";
    class Item {
      constructor(public data: unknown) {}
    }
    await copyText(text, {
      ClipboardItem: Item as unknown as typeof ClipboardItem,
      clipboard: {
        write: async () => {
          throw new DOMException("NotAllowedError");
        },
        writeText: async (t: string) => void (got = t),
      },
    });
    expect(got).toBe("# Button\n");
  });
});
