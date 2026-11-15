/**
 * Every example file, for the frameless example views at
 * `/example/<item>/<example>/`. The glob is lazy: a view loads its own
 * example's module alone, in its universal load. The theme item's examples
 * are left out: they change the page's theme, so they show inline only, and
 * a frame never holds the theme module.
 */
import type { Component } from "svelte";
import type { ExampleMeta } from "./shown-source.ts";

export type ExampleModule = {
  // A view passes the page's data; an example takes what it needs.
  default: Component<any>;
  meta: ExampleMeta;
};

const EXAMPLES = import.meta.glob<ExampleModule>([
  "./examples/*/*.svelte",
  "!./examples/theme/*.svelte",
]);

/** An example's module by its item and its id, loaded on demand. */
export async function exampleModule(
  item: string,
  id: string,
): Promise<ExampleModule | undefined> {
  const load = EXAMPLES[`./examples/${item}/${id}.svelte`];
  return load ? await load() : undefined;
}
