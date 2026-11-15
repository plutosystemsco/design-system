/**
 * Where an item's files land in an app, and the import paths its shown
 * code uses: the aliases `shadcn-svelte init` writes in a SvelteKit 3 app
 * with a `#lib/*` imports map. `#lib/components/ui/…` is
 * `src/lib/components/ui/…` on disk, as `$lib/…` is in a SvelteKit 2 app,
 * so the paths hold for both.
 */

/** This repository's source folders, and the folder each lands in. Longest first. */
export const ALIAS_MAP: readonly [from: string, to: string][] = [
  ["#lib/registry/ui/", "#lib/components/ui/"],
  ["#lib/registry/components/", "#lib/components/"],
  ["#lib/registry/hooks/", "#lib/hooks/"],
  ["#lib/registry/lib/", "#lib/"],
];

export type ItemFile = { path: string; type: string; target?: string };

/** A file's path in an app made by `shadcn-svelte init`. */
export function appPath(file: ItemFile): string {
  if (file.type === "registry:page")
    return `src/routes/${file.target ?? file.path.replace(/^src\/lib\/registry\/blocks\//, "")}`;
  for (const [from, to] of ALIAS_MAP) {
    const source = from.replace("#lib/", "src/lib/");
    if (file.path.startsWith(source))
      return to.replace("#lib/", "src/lib/") + file.path.slice(source.length);
  }
  return file.path;
}

/** The files an item writes into an app, at their paths there, in registry.json's order. */
export function filesYouOwn(item: { files: ItemFile[] }): string[] {
  return item.files.map((f) => appPath(f));
}

type Related = { name: string; registryDependencies?: string[] };

/** What an item brings (its registry dependencies), and the items that bring it. */
export function related(
  name: string,
  items: Related[],
): { brings: string[]; broughtBy: string[] } {
  const item = items.find((i) => i.name === name);
  return {
    brings: item?.registryDependencies ?? [],
    broughtBy: items
      .filter((i) => (i.registryDependencies ?? []).includes(name))
      .map((i) => i.name),
  };
}
