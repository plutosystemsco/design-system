import { readFileSync } from "node:fs";
import path from "node:path";
import type { PageServerLoad } from "./$types";

type Item = {
  name: string;
  type: string;
  title: string;
  description: string;
  meta?: { group?: string };
};

/** 002 decision 6's groups, in order, with their headings. */
const GROUPS: [key: string, heading: string][] = [
  ["foundation", "Foundation"],
  ["actions", "Actions"],
  ["surfaces", "Surfaces"],
  ["feedback", "Feedback"],
  ["forms", "Forms"],
];

export const load: PageServerLoad = () => {
  const registry = JSON.parse(
    readFileSync(path.resolve("registry.json"), "utf8"),
  );
  const items = (registry.items as Item[]).map(
    ({ name, type, title, description, meta }) => ({
      name,
      type,
      title,
      description,
      group: meta?.group ?? "",
    }),
  );
  const groups = GROUPS.map(([key, heading]) => ({
    key,
    heading,
    items: items.filter((item) => item.group === key),
  }));
  return { name: registry.name as string, count: items.length, groups };
};
