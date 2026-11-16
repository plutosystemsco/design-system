import { readdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { EntryGenerator, PageServerLoad } from "./$types";

const ROOT = "src/lib/site/examples";

/** Every example with a frame: all but the theme item's. */
export const entries: EntryGenerator = () =>
  readdirSync(path.resolve(ROOT))
    .filter((item) => item !== "theme")
    .flatMap((item) =>
      readdirSync(path.resolve(ROOT, item))
        // A pair file is no example on the page, but has a view of its own,
        // which `027a` test 52 scans with axe.
        .filter((f) => f.endsWith(".svelte"))
        .map((f) => ({ item, example: f.replace(/\.svelte$/, "") })),
    );

/** An example that reads page data gets its item's, from its data module. */
const DATA = import.meta.glob<{ load: () => Promise<unknown> | unknown }>(
  "/src/lib/site/examples/*/data.server.ts",
);

export const load: PageServerLoad = async ({ params }) => {
  const registry = JSON.parse(
    (await import("node:fs")).readFileSync(
      path.resolve("registry.json"),
      "utf8",
    ),
  ) as { items: { name: string; title: string; meta: { modes: string[] } }[] };
  const item = registry.items.find((i) => i.name === params.item);
  const modes = item?.meta.modes ?? [];
  const module = DATA[`/src/lib/site/examples/${params.item}/data.server.ts`];
  const extra = module ? await (await module()).load() : {};
  if (!existsSync(path.resolve(ROOT, params.item, `${params.example}.svelte`)))
    throw new Error(`no example ${params.item}/${params.example}`);
  return {
    ...(extra as object),
    mode: modes.includes("productive") ? "productive" : "expressive",
    itemTitle: item?.title ?? params.item,
  };
};
