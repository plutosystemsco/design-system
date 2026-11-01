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

/**
 * 002 decision 6's groups, 003 decision 18's blocks, 004 decision 4's code
 * and data and 005 decision 4's navigation and chat, in order, with their
 * headings: ten groups.
 */
const GROUPS: [key: string, heading: string][] = [
  ["foundation", "Foundation"],
  ["actions", "Actions"],
  ["surfaces", "Surfaces"],
  ["feedback", "Feedback"],
  ["forms", "Forms"],
  ["code", "Code"],
  ["data", "Data"],
  ["navigation", "Navigation"],
  ["chat", "Chat"],
  ["blocks", "Blocks"],
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
