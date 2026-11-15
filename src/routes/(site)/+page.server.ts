import { readFileSync } from "node:fs";
import path from "node:path";
import { highlightCode } from "#lib/registry/lib/highlighter";
import { addCommand } from "#lib/site/site";
import type { PageServerLoad } from "./$types";

type Item = {
  name: string;
  files: { path: string; type: string; target?: string }[];
  registryDependencies?: string[];
  dependencies?: string[];
};

/**
 * The home page's two commands, highlighted here at prerender, and what
 * `add button` writes into an app and brings with it, from registry.json.
 */
export const load: PageServerLoad = async () => {
  const registry = JSON.parse(
    readFileSync(path.resolve("registry.json"), "utf8"),
  ) as { items: Item[] };
  const button = registry.items.find((i) => i.name === "button")!;
  const theme = addCommand("pluto-theme");
  const add = addCommand("button");
  return {
    theme: { code: theme, lines: await highlightCode(theme, "bash") },
    add: { code: add, lines: await highlightCode(add, "bash") },
    gives: {
      files: button.files.map((f) => f.path),
      brings: button.registryDependencies ?? [],
      packages: button.dependencies ?? [],
    },
  };
};
