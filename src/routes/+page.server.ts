import { readFileSync } from "node:fs";
import path from "node:path";
import type { PageServerLoad } from "./$types";

type Item = { name: string; type: string; title: string; description: string };

export const load: PageServerLoad = () => {
  const registry = JSON.parse(
    readFileSync(path.resolve("registry.json"), "utf8"),
  );
  const items: Item[] = registry.items.map(
    ({ name, type, title, description }: Item) => ({
      name,
      type,
      title,
      description,
    }),
  );
  return { name: registry.name as string, items };
};
