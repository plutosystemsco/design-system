<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A row of joined toggles. Single picks one, as a time-range strip does; multiple picks several, as text styles do. The selected item is inverted.",
  };
</script>

<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextUnderline from "phosphor-svelte/lib/TextUnderline";
  import * as ToggleGroup from "#lib/registry/ui/toggle-group";

  const ranges = [
    ["today", "Today"],
    ["7d", "7 days"],
    ["30d", "30 days"],
    ["90d", "90 days"],
  ] as const;
</script>

<div class="flex flex-wrap items-center gap-8">
  <ToggleGroup.Root
    type="single"
    value="7d"
    aria-label="Time range"
    data-testid="toggle-group-single"
  >
    {#each ranges as [value, label] (value)}
      <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
  <ToggleGroup.Root type="multiple" value={["bold"]} aria-label="Text style">
    <ToggleGroup.Item value="bold" aria-label="Bold"
      ><TextB aria-hidden="true" /></ToggleGroup.Item
    >
    <ToggleGroup.Item value="italic" aria-label="Italic"
      ><TextItalic aria-hidden="true" /></ToggleGroup.Item
    >
    <ToggleGroup.Item value="underline" aria-label="Underline"
      ><TextUnderline aria-hidden="true" /></ToggleGroup.Item
    >
  </ToggleGroup.Root>
</div>
