import { readFileSync } from "node:fs";
import path from "node:path";
import { highlightCode } from "#lib/registry/lib/highlighter";
import { componentData } from "#lib/site/component-data.server";
import { listedItems } from "#lib/site/items";
import { addCommand, GITHUB_REGISTRY, SITE_REGISTRY } from "#lib/site/site";
import type { LayoutServerLoad } from "./$types";

export type RegistryEntry = {
  name: string;
  type: string;
  title: string;
  description: string;
  meta: {
    since: string;
    group: string;
    modes: string[];
    stock?: { item: string };
  };
};

/**
 * Every component page reads its title, description and facts from
 * registry.json, and its two install commands as prerendered lines, so no
 * page loads the highlighter for them.
 */
export const load: LayoutServerLoad = async ({ route }) => {
  const registry = JSON.parse(
    readFileSync(path.resolve("registry.json"), "utf8"),
  ) as { items: RegistryEntry[] };
  const entries: Record<string, RegistryEntry> = {};
  // 020 decision 3: the landing lists no alias.
  for (const { name, type, title, description, meta } of listedItems(
    registry.items,
  ))
    entries[name] = { name, type, title, description, meta };
  const name = /^\/\(site\)\/components\/([^/]+)$/.exec(route.id ?? "")?.[1];
  const install = name
    ? {
        site: await highlightCode(addCommand(name, SITE_REGISTRY), "bash"),
        github: await highlightCode(addCommand(name, GITHUB_REGISTRY), "bash"),
      }
    : null;
  const component = name ? await componentData(name) : null;
  // A component page needs its own entry alone; the landing lists them all.
  return {
    registry: name ? { [name]: entries[name] } : entries,
    install,
    component,
  };
};
