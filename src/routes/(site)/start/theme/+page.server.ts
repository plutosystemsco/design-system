import registry from "../../../../../registry.json";
import { readTokens } from "../../../../../scripts/tokens.ts";
import type { PageServerLoad } from "./$types";

type Theme = {
  cssVars: Record<"light" | "dark" | "theme", Record<string, string>>;
  css: Record<string, unknown>;
  registryDependencies: string[];
};

/** What `kuiper-theme` writes, read from registry.json at prerender. */
export const load: PageServerLoad = () => {
  const item = registry.items.find(
    (i) => i.name === "kuiper-theme",
  ) as unknown as Theme;
  const keys = Object.keys(item.css);
  const families = readTokens().type.families;
  return {
    light: Object.keys(item.cssVars.light).length,
    dark: Object.keys(item.cssVars.dark).length,
    theme: Object.keys(item.cssVars.theme).length,
    utilities: keys
      .filter((k) => k.startsWith("@utility "))
      .map((k) => k.slice("@utility ".length)),
    selectors: keys.filter((k) => !k.startsWith("@") && k !== ":root"),
    fonts: item.registryDependencies.map((name) => {
      const f = Object.values(families).find((x) => x.item === name)!;
      return {
        item: name,
        name: f.family
          .split(",")[0]
          .replaceAll("'", "")
          .replace(/ Variable$/, ""),
        variable: f.variable,
        package: f.package,
      };
    }),
  };
};
