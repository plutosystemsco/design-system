import { readFileSync } from "node:fs";
import path from "node:path";

type Theme = {
  name: string;
  cssVars: { light: Record<string, string> };
  css: Record<string, unknown>;
};

/**
 * The names `readToken` reads, from the generated `pluto-theme` item: the
 * theme's colours and the custom properties on `:root`. The syntax colours
 * exist for the code slots alone, so they are not listed. No generated list
 * ships with the item.
 */
export function load() {
  const registry = JSON.parse(
    readFileSync(path.resolve("registry.json"), "utf8"),
  ) as { items: Theme[] };
  const theme = registry.items.find((i) => i.name === "pluto-theme")!;
  const colours = Object.keys(theme.cssVars.light).filter(
    (name) => name !== "radius" && !name.startsWith("syntax-"),
  );
  const root = [
    "radius",
    ...Object.keys(theme.css[":root"] as Record<string, string>)
      .filter((key) => key.startsWith("--"))
      .map((key) => key.slice(2)),
  ];
  return { colours, root };
}
