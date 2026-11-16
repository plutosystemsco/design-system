<script lang="ts">
  import * as ToggleGroup from "#lib/components/ui/toggle-group";
</script>

<ToggleGroup.Root type="single" value="day" aria-label="Range">
  <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
  <ToggleGroup.Item value="week" data-cost="target">Week</ToggleGroup.Item>
</ToggleGroup.Root>
