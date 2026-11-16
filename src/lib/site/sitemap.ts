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
import { listedItems } from "./items.ts";

export type SitePage = {
  path: string;
  title: string;
  /** The door the page belongs to; the home page and the changelog have none. */
  door: DoorId | null;
  /** One sentence: what the page holds. */
  summary: string;
  /** The page above it: a door's landing, or the home page. */
  parent: string | null;
  spec: "015" | "017" | "020";
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

// 020 decision 3: a deprecated entry (an alias) has no page.
const items = listedItems(registry.items as RegistryItem[]);

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

// 017: Start, Brand and Foundations, behind the three doors 015 left empty.
const PAGES_017: Omit<SitePage, "parent" | "spec">[] = [
  {
    path: "/foundations/tokens/",
    title: "Tokens",
    door: "foundations",
    summary:
      "Every primitive and every theme role in the token file, in both themes.",
  },
  {
    path: "/foundations/colour/",
    title: "Colour",
    door: "foundations",
    summary:
      "Each colour role by its job, in both themes, with its measured contrast.",
  },
  {
    path: "/foundations/type/",
    title: "Type",
    door: "foundations",
    summary:
      "The three families, the text scale, and the display steps for expressive pages.",
  },
  {
    path: "/foundations/space-and-shape/",
    title: "Space and shape",
    door: "foundations",
    summary:
      "The 4 px atom and its ladder, the one radius, the hairline and the focus ring.",
  },
  {
    path: "/foundations/motion/",
    title: "Motion",
    door: "foundations",
    summary: "Every duration and ease, and what reduced motion does.",
  },
  {
    path: "/foundations/accessibility/",
    title: "Accessibility",
    door: "foundations",
    summary: "What the system promises, what is checked, and what is not yet.",
  },
  {
    path: "/foundations/code/",
    title: "Code",
    door: "foundations",
    summary:
      "The roles highlighted code is coloured by, their colours in both themes, and the languages.",
  },
  {
    path: "/brand/mark/",
    title: "The mark",
    door: "brand",
    summary:
      "The four dots and the lockup, drawn to measure, and which version goes on which ground.",
  },
  {
    path: "/brand/colour/",
    title: "Colour",
    door: "brand",
    summary:
      "The four colours, the canvas and graphite, and when the four come together.",
  },
  {
    path: "/brand/type/",
    title: "Type",
    door: "brand",
    summary:
      "The three faces and their jobs, and the display ladder drawn to measure.",
  },
  {
    path: "/brand/surfaces/",
    title: "Surfaces",
    door: "brand",
    summary:
      "One radius, flat product screens, the four fields and frosted glass.",
  },
  {
    path: "/brand/motion/",
    title: "Motion",
    door: "brand",
    summary:
      "How Pluto moves: in answer to the reader, with springs for the dots alone.",
  },
  {
    path: "/brand/imagery/",
    title: "Imagery",
    door: "brand",
    summary: "The four kinds of picture Pluto shows, and what each is for.",
  },
  {
    path: "/brand/voice/",
    title: "Voice",
    door: "brand",
    summary:
      "How Pluto writes: warm and human, about the work and not the tool.",
  },
  {
    path: "/brand/products/",
    title: "Products",
    door: "brand",
    summary: "How a Pluto product is named, and what it may make its own.",
  },
  {
    path: "/brand/downloads/",
    title: "Downloads",
    door: "brand",
    summary:
      "The mark and the lockup as SVG files, each for the grounds it suits.",
  },
  {
    path: "/start/install/",
    title: "Install",
    door: "start",
    summary:
      "From an empty SvelteKit app to a first part, and what you own after.",
  },
  {
    path: "/start/theme/",
    title: "The theme",
    door: "start",
    summary:
      "What the theme writes into your app: variables, utilities, a few global names and three fonts.",
  },
  {
    path: "/start/light-and-dark/",
    title: "Light and dark",
    door: "start",
    summary:
      "Ship both themes: the head script, the stored choice and the toggle.",
  },
  {
    path: "/start/modes/",
    title: "Modes",
    door: "start",
    summary: "Productive or expressive: which a page is, and what each allows.",
  },
  {
    path: "/start/your-product/",
    title: "Your product",
    door: "start",
    summary:
      "Put your product's logo and name on the system, and keep the rest shared.",
  },
];

SITEMAP.push(
  ...PAGES_017.map((p): SitePage => ({
    ...p,
    parent: `/${p.door}/`,
    spec: "017",
  })),
);

// 020 decision 12: a release's upgrade guide sits under the changelog, at
// /changelog/<version>/upgrade/. 0.13.0's is the first.
SITEMAP.push({
  path: "/changelog/0.13.0/upgrade/",
  title: "Upgrade to 0.13.0",
  door: null,
  summary:
    "What an app that installed an earlier release changes for 0.13.0, in order: the Kuiper rename first.",
  parent: "/changelog/",
  spec: "020",
});

/**
 * 018 decision 1: a door's pages in the one order every consumer reads (the
 * left nav, the phone sheet, previous and next): the landing, then its
 * pages; Components' under the registry's groups, in `GROUPS` order, each
 * group in registry order. With no door (the changelog), the four landings,
 * the changelog and the pages under it (020 decision 12).
 */
export function navOrder(door: DoorId | null): SitePage[] {
  if (!door)
    return [
      ...DOORS.map((d) => sitePage(d.path)!),
      sitePage("/changelog/")!,
      ...SITEMAP.filter((p) => p.parent === "/changelog/"),
    ];
  const landing = sitePage(DOORS.find((d) => d.id === door)!.path)!;
  const pages = doorPages(door);
  if (door !== "components") return [landing, ...pages];
  return [
    landing,
    ...GROUPS.flatMap((g) => pages.filter((p) => p.group === g.id)),
  ];
}
