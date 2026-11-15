<script lang="ts" module>
  export const meta = {
    title: "Contrast",
    intro:
      "WCAG 2.2 ratios, truncated to two decimals. Text needs 4.5 and non-text 3. Tints composite at 10% in light and 20% in dark.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();

  type Row = ThemeData["contrast"]["light"][number];
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

<div class="dark:hidden">
  {@render table(data.contrast.light, "Light theme")}
</div>
<div class="hidden dark:block">
  {@render table(data.contrast.dark, "Dark theme")}
</div>

<h4 class="mt-8 text-base font-semibold">Forbidden: state tints on muted</h4>
<p class="mt-2 max-w-prose text-sm text-muted-foreground">
  Forbidden by rule. The light row is the measured witness and stays below 4.5;
  the dark pairs pass on this palette and stay forbidden all the same.
</p>
<ul class="mt-2 grid gap-1 text-sm">
  {#each data.forbidden as row (row.theme + row.label)}
    <li>
      <code>{row.theme}</code>: {row.label} on <code>{row.bg}</code>, {row.ruleOnly
        ? "by rule"
        : row.ratio.toFixed(2)}
    </li>
  {/each}
</ul>
