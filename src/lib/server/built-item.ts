/**
 * The code view's source (003 decision 17): a block's built item, the exact
 * files `add` writes, mapped to where they land in an app with `#lib`
 * aliases, as the smoke test's first scratch app has. Server-only: `node:fs`
 * never reaches the browser.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

export type BuiltFile = {
  path: string;
  type: string;
  target?: string;
  content?: string;
};

export type AppFile = { appPath: string; text: string };

/** The first scratch app's `#lib` aliases, for the placeholders `registry build` writes. */
export const APP_ALIASES: Record<string, string> = {
  $COMPONENTS$: "#lib/components",
  $UI$: "#lib/components/ui",
  $UTILS$: "#lib/utils",
  $HOOKS$: "#lib/hooks",
  $LIB$: "#lib",
};

/** Where a built file lands in the app: pages under src/routes, components flat. */
export function appPath(file: BuiltFile): string {
  const target = file.target ?? path.basename(file.path);
  if (file.type === "registry:page") return `src/routes/${target}`;
  if (file.type === "registry:component") return `src/lib/components/${target}`;
  if (file.type === "registry:ui") return `src/lib/components/ui/${target}`;
  return target;
}

/** A file's text with each placeholder replaced by the app's alias. */
export function appText(content: string): string {
  let text = content;
  for (const [placeholder, alias] of Object.entries(APP_ALIASES))
    text = text.replaceAll(placeholder, alias);
  return text;
}

/** Maps each built file to its app path and its text, in the item's order. */
export function toAppFiles(files: BuiltFile[]): AppFile[] {
  return files.map((file) => ({
    appPath: appPath(file),
    text: appText(file.content ?? ""),
  }));
}

/** Reads `static/r/styles/maia/<name>.json`, which the registry build writes. */
export function readBuiltItem(
  name: string,
  root: string = process.cwd(),
): AppFile[] {
  const item = JSON.parse(
    readFileSync(
      path.join(root, "static", "r", "styles", "maia", `${name}.json`),
      "utf8",
    ),
  ) as { files: BuiltFile[] };
  return toAppFiles(item.files);
}
