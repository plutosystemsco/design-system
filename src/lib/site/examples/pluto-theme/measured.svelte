<script lang="ts" module>
  export const meta = {
    title: "Fields and glass, measured",
    intro:
      "Each field's legend on its fill, and the glass's text over each ground, over its opaque fallback, and its focus ring, in the current theme.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();

  type Row = ThemeData["expressive"]["brand"][number]["fields"][number];
</script>

{#snippet table(rows: Row[], caption: string)}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    role="region"
    aria-label={caption}
    tabindex="0"
    class="overflow-x-auto scrollbar"
  >
    <table class="w-full border-collapse text-left text-sm">
      <caption class="mb-2 text-left text-sm text-muted-foreground">
        {caption}, {rows.length} pairs
      </caption>
      <thead>
        <tr class="border-b border-border">
          <th scope="col" class="py-2 pr-3 font-medium">Number</th>
          <th scope="col" class="py-2 pr-3 font-medium">Kind</th>
          <th scope="col" class="py-2 pr-3 font-medium">Pair</th>
          <th scope="col" class="py-2 pr-3 font-medium">Foreground</th>
          <th scope="col" class="py-2 pr-3 font-medium">Background</th>
          <th scope="col" class="py-2 pr-3 font-medium">Ratio</th>
          <th scope="col" class="py-2 pr-3 font-medium">Minimum</th>
          <th scope="col" class="py-2 font-medium">Result</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row (row.n)}
          <tr class="border-b border-border">
            <td class="py-1 pr-3 font-mono">{row.n}</td>
            <td class="py-1 pr-3">{row.kind}</td>
            <td class="py-1 pr-3">{row.label}</td>
            {#each [row.fg, row.bg] as colour, i (i)}
              <td class="py-1 pr-3">
                <span class="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    class="size-3 shrink-0 rounded-full border border-input"
                    style="background-color: {colour}"
                  ></span>
                  <code>{colour}</code>
                </span>
              </td>
            {/each}
            <td class="py-1 pr-3 font-mono">{row.ratio.toFixed(2)}</td>
            <td class="py-1 pr-3 font-mono">{row.minimum}</td>
            <td class="py-1">{row.result}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/snippet}

{#each data.expressive.brand as set (set.theme)}
  <div
    class={set.theme === "light"
      ? "grid gap-6 dark:hidden"
      : "hidden gap-6 dark:grid"}
  >
    {@render table(set.fields, `The fields, legend on fill, ${set.theme}`)}
    {@render table(
      set.glass,
      `The glass over each ground, its fallback and the ring, ${set.theme}`,
    )}
  </div>
{/each}
