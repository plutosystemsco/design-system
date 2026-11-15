/**
 * Copy page (018 decision 6): the page's Markdown twin, to the clipboard,
 * without losing the click's user activation. The click hands over a
 * ClipboardItem whose data is the fetch's promise, so the write starts
 * inside the click; where ClipboardItem is missing or rejects a promise
 * value, or the write fails, it falls back to writeText of the awaited text.
 */
type Clipboard = {
  write(items: ClipboardItem[]): Promise<void>;
  writeText(text: string): Promise<void>;
};

export async function copyText(
  text: Promise<string>,
  deps: {
    ClipboardItem: typeof ClipboardItem | undefined;
    clipboard: Clipboard;
  },
): Promise<void> {
  const { ClipboardItem: Item, clipboard } = deps;
  if (Item) {
    try {
      const blob = text.then((t) => new Blob([t], { type: "text/plain" }));
      await clipboard.write([new Item({ "text/plain": blob })]);
      return;
    } catch {
      // Fall through to the plain write.
    }
  }
  await clipboard.writeText(await text);
}

/** The twin's text, fetched once per page and reused. */
const cache = new Map<string, Promise<string>>();
export function twinText(href: string): Promise<string> {
  let t = cache.get(href);
  if (!t) {
    t = fetch(href).then((r) => {
      if (!r.ok) throw new Error(`${href}: ${r.status}`);
      return r.text();
    });
    t.catch(() => cache.delete(href));
    cache.set(href, t);
  }
  return t;
}
