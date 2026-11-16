/**
 * 020 decision 3: the rule for a listed item, in a module that imports
 * nothing. `items.ts` re-exports it. `scripts/build-registry.ts` imports it
 * from here, so the generator never reaches `listed-items.ts`, the file it
 * writes, and can rebuild that file when it is missing or broken (024b's
 * change review, finding 1).
 */

/** 020 decision 3: the shape `048` will extend for deprecations. */
export type Deprecation = { replacement: string; removedIn: string };

/** True for an entry without `meta.deprecated`. */
export function isListed(item: object): boolean {
  return !(item as { meta?: { deprecated?: unknown } }).meta?.deprecated;
}
