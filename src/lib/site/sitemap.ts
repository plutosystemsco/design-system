/**
 * Every page the site has, listed once. The bar, the landings' indexes, the
 * footer, search, `llms.txt`, `sitemap.xml`, the Markdown build and every
 * test that counts pages read this list. A page that is not here fails a
 * test; an entry without a page fails the prerender.
 *
 * A later specification appends its pages to `SITEMAP`; `spec` names which
 * specification added an entry, for the tests alone, and is never shown.
 */
import registry from "../../../registry.json";
import { DOORS, type DoorId } from "./doors.ts";

export type SitePage = {
  path: string;
  title: string;
  /** The door the page belongs to; the home page and the changelog have none. */
  door: DoorId | null;
  /** One sentence: what the page holds. */
  summary: string;
  /** The page above it: a door's landing, or the home page. */
  parent: string | null;
  spec: "015" | "017";
  /** A component page's registry group. */
  group?: string;
};

type RegistryItem = {
  name: string;
  title: string;
  description: string;
  meta: { group: string };
};

/** The registry's groups, in its order, with the names a reader sees. */
export const GROUPS: readonly { id: string; title: string }[] = [
  { id: "foundation", title: "Foundation" },
  { id: "actions", title: "Actions" },
  { id: "surfaces", title: "Surfaces" },
  { id: "feedback", title: "Feedback" },
  { id: "forms", title: "Forms" },
  { id: "code", title: "Code" },
  { id: "data", title: "Data" },
  { id: "navigation", title: "Navigation" },
  { id: "chat", title: "Chat" },
  { id: "compositions", title: "Compositions" },
  { id: "blocks", title: "Blocks" },
];

/** A component page's path. */
export function componentPath(name: string): string {
  return `/components/${name}/`;
}

const items = registry.items as RegistryItem[];

export const SITEMAP: SitePage[] = [
  {
    path: "/",
    title: "Home",
    door: null,
    summary:
      "The tokens, components and brand behind every Pluto Systems product.",
    parent: null,
    spec: "015",
  },
  ...DOORS.map((d): SitePage => ({
    path: d.path,
    title: d.name,
    door: d.id,
    summary: d.summary,
    parent: "/",
    spec: "015",
  })),
  ...items.map((item): SitePage => ({
    path: componentPath(item.name),
    title: item.title,
    door: "components",
    summary: item.description,
    parent: "/components/",
    spec: "015",
    group: item.meta.group,
  })),
  {
    path: "/changelog/",
    title: "Changelog",
    door: null,
    summary: "What changed in each release, newest first.",
    parent: "/",
    spec: "015",
  },
];

/** The entry for a path, if the site has that page. */
export function sitePage(path: string): SitePage | undefined {
  return SITEMAP.find((p) => p.path === path);
}

/** A door's pages below its landing, in the list's order. */
export function doorPages(door: DoorId): SitePage[] {
  const landing = DOORS.find((d) => d.id === door)!.path;
  return SITEMAP.filter((p) => p.door === door && p.path !== landing);
}
