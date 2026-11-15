/**
 * Everything a component page shows that is generated: its examples'
 * shown sources (highlighted here, at prerender), its API, the files it
 * writes into an app, and what it brings and what brings it.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  highlightCode,
  type HighlightedLine,
} from "#lib/registry/lib/highlighter";
import { apiTables, type ApiTable } from "./api.server.ts";
import { parseChangelog, updatedIn } from "./changelog.ts";
import { filesYouOwn, related } from "./files.ts";
import {
  exampleMeta,
  hasSwitch,
  shownSource,
  type ExampleMeta,
} from "./shown-source.ts";

type Item = {
  name: string;
  type: string;
  title: string;
  files: { path: string; type: string; target?: string }[];
  registryDependencies?: string[];
  dependencies?: string[];
};

export type ExampleData = ExampleMeta & {
  id: string;
  /** The frame has a Light | Dark switch. */
  switch: boolean;
  /** The file as an app writes it, when it has no tokens; else empty, and read from `lines`. */
  code: string;
  lines: HighlightedLine[] | null;
  lineCount: number;
  /** Files beside the example that its code imports: this site's sample data, which an app supplies itself. */
  samples: string[];
};

export type ComponentData = {
  examples: Record<string, ExampleData>;
  api: ApiTable[];
  files: string[];
  brings: { name: string; title: string }[];
  broughtBy: { name: string; title: string }[];
  packages: string[];
  /** The release the item last changed in, else the one it arrived in (018 decision 4). */
  updated: string;
};

export const EXAMPLES_DIR = "src/lib/site/examples";

export async function componentData(name: string): Promise<ComponentData> {
  const registry = JSON.parse(
    readFileSync(path.resolve("registry.json"), "utf8"),
  ) as {
    items: Item[];
  };
  const item = registry.items.find((i) => i.name === name)!;
  const title = (n: string) =>
    registry.items.find((i) => i.name === n)?.title ?? n;
  const dir = path.resolve(EXAMPLES_DIR, name);
  const examples: Record<string, ExampleData> = {};
  if (existsSync(dir))
    for (const file of readdirSync(dir)
      .filter((f) => f.endsWith(".svelte"))
      .sort()) {
      const text = readFileSync(path.join(dir, file), "utf8");
      const meta = exampleMeta(text);
      const code = shownSource(text);
      const samples = [
        ...new Set(
          [...code.matchAll(/^\s*import\b[^\n]*from "\.\/([^"$]+)";?$/gm)].map(
            (m) => {
              const base = m[1];
              const file = [base, `${base}.ts`, `${base}.svelte`].find((f) =>
                existsSync(path.join(dir, f)),
              );
              return file ?? base;
            },
          ),
        ),
      ];
      const lines = await highlightCode(code, "svelte");
      examples[file.replace(/\.svelte$/, "")] = {
        ...meta,
        id: file.replace(/\.svelte$/, ""),
        switch: hasSwitch(name, meta, registry.items),
        // The page carries the code once: as its tokens when it has them.
        code: lines ? "" : code,
        lines,
        lineCount: code.replace(/\n$/, "").split("\n").length,
        samples,
      };
    }
  const r = related(name, registry.items);
  return {
    examples,
    api: apiTables(item),
    files: filesYouOwn(item),
    brings: r.brings.map((n) => ({ name: n, title: title(n) })),
    broughtBy: r.broughtBy.map((n) => ({ name: n, title: title(n) })),
    packages: item.dependencies ?? [],
    updated: updatedIn(
      name,
      (item as unknown as { meta: { since: string } }).meta.since,
      parseChangelog(readFileSync(path.resolve("CHANGELOG.md"), "utf8")),
    )!,
  };
}
