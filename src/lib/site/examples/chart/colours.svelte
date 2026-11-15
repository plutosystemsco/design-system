<script lang="ts" module>
  export const meta = {
    title: "Series colours",
    intro:
      "The five series colours, chart-1 to chart-5. The third is the brand yellow.",
  };
</script>

<script lang="ts">
  // The classes are written out, so Tailwind finds them.
  const swatches = [
    ["series-1", "bg-chart-1"],
    ["series-2", "bg-chart-2"],
    ["series-3", "bg-chart-3"],
    ["series-4", "bg-chart-4"],
    ["series-5", "bg-chart-5"],
  ] as const;
</script>

<ul class="flex flex-wrap gap-4 text-sm">
  {#each swatches as [id, swatch], i (id)}
    <li class="flex items-center gap-2">
      <span aria-hidden="true" class="size-6 rounded {swatch}" data-testid={id}
      ></span>
      <code>chart-{i + 1}</code>
    </li>
  {/each}
</ul>
