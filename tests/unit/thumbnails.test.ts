/**
 * 018 decision 13, criterion 18: every component has a light and a dark
 * thumbnail, and none is stale: each item's hash, recomputed from source,
 * equals the manifest's. Also: each route passes its examples in
 * exampleOrder's order.
 */
import { describe, expect, test } from "bun:test";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { withListedItems } from "../../src/lib/site/items.ts";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  lockedVersions,
  MANIFEST,
  staleMessage,
  THUMBNAILS,
  thumbnailHash,
  thumbnailInputs,
} from "../../scripts/site/thumbnail-hash.ts";
import { exampleOrder } from "../../src/lib/site/example-order.ts";

const registry = withListedItems(
  JSON.parse(readFileSync("registry.json", "utf8")),
) as {
  items: { name: string }[];
};
const NAMES = registry.items.map((i) => i.name);

/** A WebP's width and height, from its first chunk. */
function webpSize(buf: Buffer): [number, number] | null {
  if (
    buf.toString("ascii", 0, 4) !== "RIFF" ||
    buf.toString("ascii", 8, 12) !== "WEBP"
  )
    return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X")
    return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (chunk === "VP8L") {
    const b = buf.readUInt32LE(21);
    return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)];
  }
  if (chunk === "VP8 ")
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  return null;
}

describe("018 decision 13: the thumbnails", () => {
  test("75 of 75 items have 2 images, each a WebP of 480 × 300 and at most 20 kB", () => {
    expect(NAMES).toHaveLength(75);
    const wrong: string[] = [];
    for (const n of NAMES)
      for (const scheme of ["light", "dark"]) {
        const f = path.join(THUMBNAILS, `${n}-${scheme}.webp`);
        if (!existsSync(f)) {
          wrong.push(`${f}: missing`);
          continue;
        }
        const buf = readFileSync(f);
        const size = webpSize(buf);
        if (
          !size ||
          size[0] !== 480 ||
          size[1] !== 300 ||
          buf.length > 20 * 1024
        )
          wrong.push(`${f}: ${size} ${buf.length} B`);
      }
    expect(wrong).toEqual([]);
  });

  // 018 checkpoint 2: the picture's smallest text, as the tile shows it.
  test("no picture sets text below 9 px at its shown size", () => {
    const sizes = JSON.parse(
      readFileSync(path.join(THUMBNAILS, "text-sizes.json"), "utf8"),
    ) as Record<string, number | null>;
    const small = Object.entries(sizes).filter(
      ([, px]) => px !== null && px < 8.95,
    );
    expect(Object.keys(sizes)).toHaveLength(150);
    expect(small).toEqual([]);
  });

  test("each recomputed hash equals the manifest's", () => {
    const manifest = existsSync(MANIFEST)
      ? (JSON.parse(readFileSync(MANIFEST, "utf8")) as Record<string, string>)
      : {};
    const stale = NAMES.filter((n) => manifest[n] !== thumbnailHash(".", n));
    expect(stale, staleMessage(stale)).toEqual([]);
  });

  test("the hash reads the example's local imports, the stage, the theme, the fonts and the browser", () => {
    const inputs = thumbnailInputs(".", "code-editor");
    for (const f of [
      "src/lib/site/examples/code-editor/variants.svelte",
      "src/lib/site/examples/code-editor/example.ts",
      "src/lib/site/page/frame.svelte",
      "src/lib/site/site.css",
      "src/app.css",
      "scripts/site/thumbnails.ts",
    ])
      expect(inputs).toContain(f);
    expect(
      lockedVersions(".").map((v) => v.split("@").slice(0, -1).join("@")),
    ).toEqual([
      "@fontsource-variable/geist",
      "@fontsource-variable/ibm-plex-sans",
      "@fontsource-variable/jetbrains-mono",
      "@playwright/test",
    ]);
    for (const v of lockedVersions(".")) expect(v).toMatch(/@\d+\.\d+\.\d+$/);
  });

  test("mutation: a byte changed in code-editor's example.ts, in a copy of the tree, stales its pair, and the message names both files", () => {
    const root = mkdtempSync(path.join(tmpdir(), "kuiper-thumbs-"));
    try {
      for (const f of [
        ...thumbnailInputs(".", "code-editor"),
        "registry.json",
        "bun.lock",
        "src/lib/preview/blocks.ts",
        "src/lib/site/example-order.ts",
      ])
        cpSync(f, path.join(root, f), { recursive: true });
      const before = thumbnailHash(root, "code-editor");
      expect(before).toBe(thumbnailHash(".", "code-editor"));
      const f = path.join(root, "src/lib/site/examples/code-editor/example.ts");
      writeFileSync(f, readFileSync(f, "utf8") + " ");
      expect(thumbnailHash(root, "code-editor")).not.toBe(before);
      const message = staleMessage(["code-editor"]);
      expect(message).toContain(`${THUMBNAILS}/code-editor-light.webp`);
      expect(message).toContain(`${THUMBNAILS}/code-editor-dark.webp`);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("each route passes its examples in exampleOrder's order", () => {
    const wrong: string[] = [];
    for (const n of NAMES) {
      const order = exampleOrder(n);
      if (!order.length) continue;
      const route = readFileSync(
        `src/routes/(site)/components/${n}/+page.svelte`,
        "utf8",
      );
      const m = route.match(/examples=\{\{([^}]*)\}\}/);
      const ids = (m?.[1] ?? "")
        .split(",")
        .map((s) => s.trim().split(":")[0].trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
      if (JSON.stringify(ids) !== JSON.stringify(order))
        wrong.push(`${n}: ${ids} vs ${order}`);
    }
    expect(wrong).toEqual([]);
  });
});

// 018 change review, finding 2: the page the pictures are taken from.
describe("018 review: the photographed page is in the hash", () => {
  const registry = withListedItems(
    JSON.parse(readFileSync("registry.json", "utf8")),
  ) as {
    items: { name: string }[];
  };
  const names = registry.items.map((i) => i.name);
  const examples = names.filter((n) => exampleOrder(n).length);

  /** The items whose hash changes when `file` gains a line, in a copy of the tree. */
  function staledBy(file: string): string[] {
    const root = mkdtempSync(path.join(tmpdir(), "kuiper-thumbs-page-"));
    try {
      const all = new Set<string>([
        "registry.json",
        "bun.lock",
        "src/lib/preview/blocks.ts",
        "src/lib/site/example-order.ts",
        file,
      ]);
      for (const n of names)
        for (const f of thumbnailInputs(".", n)) all.add(f);
      for (const f of all)
        if (existsSync(f)) cpSync(f, path.join(root, f), { recursive: true });
      cpSync("src/routes", path.join(root, "src/routes"), { recursive: true });
      const before = Object.fromEntries(
        names.map((n) => [n, thumbnailHash(root, n)]),
      );
      writeFileSync(
        path.join(root, file),
        readFileSync(path.join(root, file), "utf8") + "\n// changed\n",
      );
      return names.filter((n) => thumbnailHash(root, n) !== before[n]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  test("the component page template stales every example item", () => {
    expect(staledBy("src/lib/site/page/component.svelte").sort()).toEqual(
      [...examples].sort(),
    );
  });
  test("the site layout stales every example item", () => {
    expect(staledBy("src/routes/(site)/+layout.svelte").sort()).toEqual(
      [...examples].sort(),
    );
  });
  test("Button's route stales Button alone", () => {
    expect(
      staledBy("src/routes/(site)/components/button/+page.svelte"),
    ).toEqual(["button"]);
  });
  test("font-geist's data.server.ts stales font-geist alone", () => {
    expect(staledBy("src/lib/site/examples/font-geist/data.server.ts")).toEqual(
      ["font-geist"],
    );
  });
});
