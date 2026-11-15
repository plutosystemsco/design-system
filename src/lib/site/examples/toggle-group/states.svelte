<script lang="ts" module>
  export const meta = {
    title: "Outline, small, vertical and disabled",
    intro:
      "The same time-range strip with the outline hairline, at the small size, stacked, and disabled.",
  };
</script>

<script lang="ts">
  import * as ToggleGroup from "#lib/registry/ui/toggle-group";

  const ranges = [
    ["today", "Today"],
    ["7d", "7 days"],
    ["30d", "30 days"],
    ["90d", "90 days"],
  ] as const;

  const rows = [
    { variant: "outline", size: "default" },
    { variant: "default", size: "sm" },
    { variant: "outline", size: "sm" },
  ] as const;
</script>

<div class="flex flex-wrap items-start gap-8">
  {#each rows as { variant, size } (`${variant}-${size}`)}
    <ToggleGroup.Root
      type="single"
      value="7d"
      aria-label="Time range"
      {variant}
      {size}
    >
      {#each ranges as [value, label] (value)}
        <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
      {/each}
    </ToggleGroup.Root>
  {/each}
  <ToggleGroup.Root
    type="single"
    value="7d"
    orientation="vertical"
    variant="outline"
    aria-label="Time range"
  >
    {#each ranges as [value, label] (value)}
      <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
  <ToggleGroup.Root
    type="single"
    value="7d"
    disabled
    variant="outline"
    aria-label="Time range"
  >
    {#each ranges as [value, label] (value)}
      <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
</div>
