/**
 * 020 decision 3: the items a person meets. A registry entry with
 * `meta.deprecated` (the theme item's old name, until 0.14.0) is built into the
 * index, so the CLI can resolve it, but it has no page, thumbnail, sitemap or
 * search entry, example, door entry or lint profile. Every reader that lists
 * items for people reads them through `listedItems`.
 */
import registry from "../../../registry.json";

/** 020 decision 3: the shape `048` will extend for deprecations. */
export type Deprecation = { replacement: string; removedIn: string };

/** True for an entry without `meta.deprecated`. */
export function isListed(item: object): boolean {
  return !(item as { meta?: { deprecated?: unknown } }).meta?.deprecated;
}

/** A parsed `registry.json` with its listed items alone. */
export function withListedItems<T extends { items: object[] }>(registry: T): T {
  return { ...registry, items: listedItems(registry.items) };
}

/** The registry's items without `meta.deprecated`, in its order. */
export function listedItems<T extends object = (typeof registry.items)[number]>(
  items: readonly T[] = registry.items as unknown as T[],
): T[] {
  return items.filter(isListed);
}
