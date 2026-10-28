<script lang="ts">
  import type { ContrastRow } from "../../../scripts/contrast.ts";

  let { rows, caption }: { rows: ContrastRow[]; caption: string } = $props();
</script>

<table class="w-full border-collapse text-left text-sm">
  <caption
    class="mb-2 text-left font-mono text-xs text-muted-foreground lowercase"
  >
    {caption} · {rows.length} pairs
  </caption>
  <thead>
    <tr class="border-b border-border">
      <th scope="col" class="py-2 pr-3 font-medium">#</th>
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
        <td class="py-1 pr-3">
          <span class="flex items-center gap-2">
            <span
              aria-hidden="true"
              class="size-3 shrink-0 rounded-full border border-input"
              style="background-color: {row.fg}"
            ></span>
            <code>{row.fg}</code>
          </span>
        </td>
        <td class="py-1 pr-3">
          <span class="flex items-center gap-2">
            <span
              aria-hidden="true"
              class="size-3 shrink-0 rounded-full border border-input"
              style="background-color: {row.bg}"
            ></span>
            <code>{row.bg}</code>
          </span>
        </td>
        <td class="py-1 pr-3 font-mono">{row.ratio.toFixed(2)}</td>
        <td class="py-1 pr-3 font-mono">{row.minimum}</td>
        <td class="py-1">{row.result}</td>
      </tr>
    {/each}
  </tbody>
</table>
