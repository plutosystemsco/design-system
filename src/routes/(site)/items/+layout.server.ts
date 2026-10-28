import { readFileSync } from "node:fs";
import path from "node:path";
import type { LayoutServerLoad } from "./$types";

export type RegistryEntry = {
  name: string;
  type: string;
  title: string;
  description: string;
};

/** Every item page's header reads its title and description from registry.json. */
export const load: LayoutServerLoad = () => {
  const registry = JSON.parse(
    readFileSync(path.resolve("registry.json"), "utf8"),
  );
  const entries: Record<string, RegistryEntry> = {};
  for (const {
    name,
    type,
    title,
    description,
  } of registry.items as RegistryEntry[])
    entries[name] = { name, type, title, description };
  return { registry: entries };
};
