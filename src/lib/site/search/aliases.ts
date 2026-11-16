/**
 * 018 decision 8: the names other systems give a part this system has under
 * another title. Each is matched after the titles, and a result it matched
 * says "Also called <alias>".
 *
 * An alias names a part this system has, and only that part: never a part
 * it lacks ("toast"), and never another item ("toggle" is Toggle). Or it is
 * the old name of a renamed item, which leads to the item's new page until
 * the old name goes (020 decision 10). It does not start a word of another
 * page's title. `search.test.ts` checks the list against a fixture
 * copy, and each path against `SITEMAP`.
 */
export type SearchAlias = { alias: string; path: string };

export const ALIASES: readonly SearchAlias[] = [
  { alias: "modal", path: "/components/dialog/" },
  { alias: "popup", path: "/components/popover/" },
  { alias: "loader", path: "/components/spinner/" },
  { alias: "drawer", path: "/components/sheet/" },
  // 020 decision 10: the theme item's old name, until 0.14.0.
  { alias: "pluto-theme", path: "/components/kuiper-theme/" },
  // 027a decision 12: the link's other names.
  { alias: "hyperlink", path: "/components/link/" },
  { alias: "anchor", path: "/components/link/" },
];

/** A page's aliases, in the list's order. */
export function aliasesOf(path: string): string[] {
  return ALIASES.filter((a) => a.path === path).map((a) => a.alias);
}
