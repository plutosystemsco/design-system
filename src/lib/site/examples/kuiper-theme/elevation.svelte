<script lang="ts" module>
  export const meta = {
    title: "Elevation and scrim",
    intro:
      "Menus and dialogs only. In both themes an overlay is told from the page by its edge alone, a hairline at the input's strength, with no shadow. The scrim dims the page behind a modal dialog.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();
</script>

<div class="flex flex-wrap items-start gap-12">
  <div class="flex flex-col items-start gap-2">
    <div
      data-token="shadow-elevation"
      class="rounded bg-popover p-6 text-popover-foreground shadow-elevation"
    >
      An elevated surface.
    </div>
    <code class="text-xs">shadow-elevation</code>
  </div>
  <div class="flex flex-col items-start gap-2">
    <span
      data-token="bg-scrim"
      aria-hidden="true"
      class="block size-24 rounded border border-border bg-scrim"
    ></span>
    <code class="text-xs">bg-scrim</code>
  </div>
</div>
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  role="region"
  aria-label="Edges over the scrim"
  tabindex="0"
  class="mt-8 overflow-x-auto scrollbar"
>
  <table class="w-full border-collapse text-left text-sm">
    <caption class="mb-2 text-left text-sm text-muted-foreground">
      Edges over the scrim, {data.scrim.length} rows
    </caption>
    <thead>
      <tr class="border-b border-border">
        <th scope="col" class="py-2 pr-3 font-medium">Theme</th>
        <th scope="col" class="py-2 pr-3 font-medium">Edge</th>
        <th scope="col" class="py-2 pr-3 font-medium">Over</th>
        <th scope="col" class="py-2 pr-3 font-medium">Scrimmed ground</th>
        <th scope="col" class="py-2 pr-3 font-medium">Ratio</th>
        <th scope="col" class="py-2 font-medium">Minimum</th>
      </tr>
    </thead>
    <tbody>
      {#each data.scrim as row (row.theme + row.over)}
        <tr class="border-b border-border">
          <td class="py-1 pr-3">{row.theme}</td>
          <td class="py-1 pr-3"><code>{row.edge}</code> {row.edgeHex}</td>
          <td class="py-1 pr-3"><code>{row.over}</code></td>
          <td class="py-1 pr-3 font-mono">{row.scrimmed}</td>
          <td class="py-1 pr-3 font-mono">{row.ratio.toFixed(2)}</td>
          <td class="py-1 font-mono">{row.min}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
