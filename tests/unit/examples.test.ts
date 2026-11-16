/**
 * 015 decisions 12 and 13, criterion 13: examples are files, so the code
 * shown is the code run. Read from source with node:fs; the glob in
 * `examples.ts` is not imported here.
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { withListedItems } from "../../src/lib/site/items.ts";
import path from "node:path";
import {
  bringsTheme,
  exampleMeta,
  hasSwitch,
  importGraph,
  PAIR_FILE,
  shownSource,
} from "../../src/lib/site/shown-source.ts";

type Item = {
  name: string;
  type: string;
  meta: { group: string };
  registryDependencies?: string[];
};
const registry = withListedItems(
  JSON.parse(readFileSync("registry.json", "utf8")),
) as {
  items: Item[];
};
const ROOT = "src/lib/site/examples";
const WITH_EXAMPLES = registry.items.filter(
  (i) => i.type !== "registry:block" && i.meta.group !== "compositions",
);
// 026 decision 22: a do or don't pair file is no example (toast-site.test.ts
// checks its meta).
const files = (name: string) =>
  existsSync(path.join(ROOT, name))
    ? readdirSync(path.join(ROOT, name))
        .filter((f) => f.endsWith(".svelte") && !PAIR_FILE.test(f))
        .map((f) => path.join(ROOT, name, f))
    : [];
const ALL = WITH_EXAMPLES.flatMap((i) =>
  files(i.name).map((f) => ({ item: i, file: f })),
);

describe("015: examples are files", () => {
  test("each of the 59 items that are not blocks or compositions has at least 1 example file", () => {
    expect(WITH_EXAMPLES).toHaveLength(59);
    expect(
      WITH_EXAMPLES.filter((i) => files(i.name).length === 0).map(
        (i) => i.name,
      ),
    ).toEqual([]);
    console.log(
      `examples: ${ALL.length} files for ${WITH_EXAMPLES.length} items`,
    );
  });

  test("blocks and compositions have no example files", () => {
    const others = registry.items.filter((i) => !WITH_EXAMPLES.includes(i));
    expect(
      others.filter((i) => files(i.name).length > 0).map((i) => i.name),
    ).toEqual([]);
  });

  test("every example exports meta with a title and a one-sentence intro", () => {
    for (const { file } of ALL) {
      const meta = exampleMeta(readFileSync(file, "utf8"));
      expect(meta.title.length, file).toBeGreaterThan(0);
      expect(meta.intro.length, file).toBeGreaterThan(0);
    }
  });

  test("0 shown sources hold data-testid, #lib/registry/, $lib or site:hide", () => {
    const bad: string[] = [];
    for (const { file } of ALL) {
      const shown = shownSource(readFileSync(file, "utf8"));
      for (const word of [
        "data-testid",
        "#lib/registry/",
        "$lib",
        "site:hide",
        "site:show",
        "export const meta",
      ])
        if (shown.includes(word)) bad.push(`${file}: ${word}`);
    }
    expect(bad).toEqual([]);
  });

  // 018 decision 7 amends this: the line leaves the frames and is said once
  // per page, in the Install section.
  test("the SvelteKit 2 line is in no frame, and once in a component page's Install section", () => {
    const frame = readFileSync("src/lib/site/page/frame.svelte", "utf8");
    expect(frame).not.toContain("In a SvelteKit 2 app, read");
    const page = readFileSync("src/lib/site/page/component.svelte", "utf8");
    expect(page.split("In a SvelteKit 2 app, read")).toHaveLength(2);
    const install = page.indexOf('aria-labelledby="install"');
    expect(install).toBeGreaterThan(0);
    expect(page.indexOf("In a SvelteKit 2 app, read")).toBeGreaterThan(install);
  });

  test("every example with no switch is of decision 12's kinds; every example with a switch imports no theme module", () => {
    const wrong: string[] = [];
    for (const { item, file } of ALL) {
      const text = readFileSync(file, "utf8");
      const meta = exampleMeta(text);
      const graph = importGraph(file);
      const importsTheme = graph.some((f) => f.includes("/registry/ui/theme/"));
      const sw = hasSwitch(item.name, meta, registry.items);
      if (sw && importsTheme)
        wrong.push(`${file}: a switch, and imports the theme`);
      if (!sw && meta.live !== false && !bringsTheme(item.name, registry.items))
        wrong.push(`${file}: no switch, of no kind`);
    }
    expect(wrong).toEqual([]);
  });

  test("0 files under src/routes/(example)/ read searchParams", () => {
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((e) => {
        const f = path.join(d, e);
        return statSync(f).isDirectory() ? walk(f) : [f];
      });
    expect(existsSync("src/routes/(example)")).toBe(true);
    expect(
      walk("src/routes/(example)").filter((f) =>
        readFileSync(f, "utf8").includes("searchParams"),
      ),
    ).toEqual([]);
  });
});

describe("015: shownSource", () => {
  // Ten named examples, each read and checked by hand once: the file as an
  // app writes it.
  const NAMED = readdirSync("tests/fixtures/shown-source").filter((f) =>
    f.endsWith(".svelte.txt"),
  );
  test("10 named examples give their expected text", () => {
    expect(NAMED).toHaveLength(10);
    for (const f of NAMED) {
      const [item, id] = f.replace(".svelte.txt", "").split("--");
      expect(
        shownSource(
          readFileSync(path.join(ROOT, item, `${id}.svelte`), "utf8"),
        ),
        f,
      ).toBe(readFileSync(path.join("tests/fixtures/shown-source", f), "utf8"));
    }
  });

  const SOURCE = `<script lang="ts" module>
  export const meta = { title: "Variants", intro: "One blue default." };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import Thing from "#lib/registry/components/thing.svelte";
  import { useIt } from "#lib/registry/hooks/use-it.svelte";
  import { highlightCode } from "#lib/registry/lib/highlighter";
  import { cn } from "#lib/utils";
</script>

<!-- site:hide -->
<p>Only on the site.</p>
<!-- site:show -->
<Button data-testid="save" variant="secondary">Save</Button>
`;

  test("maps the aliases, drops data-testid, meta and the hidden lines", () => {
    expect(shownSource(SOURCE)).toBe(`<script lang="ts">
  import { Button } from "#lib/components/ui/button";
  import Thing from "#lib/components/thing.svelte";
  import { useIt } from "#lib/hooks/use-it.svelte";
  import { highlightCode } from "#lib/highlighter";
  import { cn } from "#lib/utils";
</script>

<Button variant="secondary">Save</Button>
`);
  });
});
