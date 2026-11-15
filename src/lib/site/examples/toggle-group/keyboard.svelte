<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop: the checked item, which here is the first. The row's Tab stop starts on its first item and follows the selection from then on. ArrowRight moves focus to the next without checking it; Space then checks it.",
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
</script>

<div data-testid="keyboard-fixture">
  <ToggleGroup.Root type="single" value="today" aria-label="Time range">
    {#each ranges as [value, label] (value)}
      <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
</div>
