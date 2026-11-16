/**
 * The install guide's steps (017 decision 13): the code blocks the page
 * shows, in order, and the files each `add` writes. The page renders them;
 * the smoke test runs them, with four named substitutions.
 */
import registry from "../../../../registry.json";
import { appPath, type ItemFile } from "../files.ts";
import { listedItems } from "../items.ts";
import { addCommand, CLI, SITE_REGISTRY } from "../site.ts";

type Item = {
  name: string;
  files: ItemFile[];
  registryDependencies?: string[];
};
const items = listedItems(registry.items as Item[]);

/** An empty SvelteKit 3 app with Tailwind. */
export const CREATE = `bunx sv create my-app --template minimal --types ts --add tailwindcss --install bun
cd my-app`;

/** The imports block of package.json that gives the app its #lib alias. */
export const IMPORTS = `"imports": {
  "#lib": "./src/lib",
  "#lib/*": ["./src/lib/*", "./src/lib/*.ts", "./src/lib/*/index.ts"]
}`;

/** components.json, with #lib aliases and this release's registry. */
export const COMPONENTS = `{
  "$schema": "https://shadcn-svelte.com/schema.json",
  "tailwind": { "css": "src/app.css", "baseColor": "neutral" },
  "aliases": {
    "components": "#lib/components",
    "ui": "#lib/components/ui",
    "hooks": "#lib/hooks",
    "utils": "#lib/utils",
    "lib": "#lib"
  },
  "typescript": true,
  "registry": "${SITE_REGISTRY}",
  "style": "maia"
}`;

/** The alternative to writing components.json by hand. */
export const INIT = `${CLI} init`;

/**
 * The two adds, in order. `-o` lets the command update `src/app.css`
 * without stopping to ask, so each runs unattended, as a script would.
 */
export const ADD_THEME = `${addCommand("kuiper-theme")} -o`;
export const ADD_BUTTON = `${addCommand("button")} -o`;

/** Every item an item brings, depth first, each once. */
function chain(name: string, seen: string[] = []): string[] {
  for (const d of items.find((i) => i.name === name)?.registryDependencies ??
    []) {
    if (seen.includes(d)) continue;
    seen.push(d);
    chain(d, seen);
  }
  return seen;
}

/** The files `add <name>` writes into an app that already has `after`'s. */
export function filesWritten(name: string, after: string[] = []): string[] {
  const before = new Set(after.flatMap((a) => [a, ...chain(a)]));
  return [name, ...chain(name)]
    .filter((n) => !before.has(n))
    .flatMap((n) => items.find((i) => i.name === n)?.files ?? [])
    .map(appPath);
}
