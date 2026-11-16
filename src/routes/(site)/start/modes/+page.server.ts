import registry from "../../../../../registry.json";
import { listedItems } from "#lib/site/items";
import type { PageServerLoad } from "./$types";

type Item = { name: string; title: string; meta: { modes?: string[] } };

/** Each item's modes, read from registry.json at prerender. */
export const load: PageServerLoad = () => {
  // 020 decision 3: an alias has no modes of its own.
  const items = listedItems(registry.items as Item[]);
  const only = (mode: string) =>
    items
      .filter((i) => i.meta.modes?.length === 1 && i.meta.modes[0] === mode)
      .map((i) => ({ name: i.name, title: i.title }));
  return {
    expressive: only("expressive"),
    productive: only("productive").length,
    both: items.filter((i) => i.meta.modes?.length === 2).length,
  };
};
