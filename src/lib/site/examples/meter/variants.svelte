<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "The native meter: a measurement within a known range, not progress. An 8 px bar with square ends on the muted track, filled in primary from the theme's rules. The consuming app names it and writes its numbers beside it; the fill is never the only sign.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { Meter } from "#lib/registry/ui/meter";

  // A fuel line: 4.81 billion instructions of a 30 billion cap.
  const fuel = { value: 4.81, max: 30 };
</script>

<div class="grid max-w-md gap-2" data-testid="fuel-meter">
  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <Label for="fuel">Fuel</Label>
    <span class="font-mono text-sm text-muted-foreground"
      >Fuel: {fuel.value} billion instructions of {fuel.max} billion</span
    >
  </div>
  <Meter
    id="fuel"
    value={fuel.value}
    max={fuel.max}
    valuetext="{fuel.value} billion instructions of {fuel.max} billion"
  />
</div>
