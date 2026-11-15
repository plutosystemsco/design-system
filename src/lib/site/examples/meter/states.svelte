<script lang="ts" module>
  export const meta = {
    title: "Empty, full and in a card",
    intro:
      "Empty and full keep the label and the numbers. In a card row, a narrower meter is named by its aria-label.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import { Label } from "#lib/registry/ui/label";
  import { Meter } from "#lib/registry/ui/meter";
</script>

<div class="grid max-w-md gap-8">
  <div class="grid gap-2">
    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <Label for="fuel-empty">Fuel</Label>
      <span class="font-mono text-sm text-muted-foreground"
        >Fuel: 0 of 30 billion</span
      >
    </div>
    <Meter id="fuel-empty" value={0} max={30} valuetext="0 of 30 billion" />
  </div>
  <div class="grid gap-2">
    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <Label for="fuel-full">Fuel</Label>
      <span class="font-mono text-sm text-muted-foreground"
        >Fuel: 30 of 30 billion</span
      >
    </div>
    <Meter id="fuel-full" value={30} max={30} valuetext="30 of 30 billion" />
  </div>
  <Card.Root size="sm">
    <Card.Content>
      <dl class="grid gap-3 text-sm">
        <div class="flex items-center justify-between gap-4">
          <dt class="text-muted-foreground">Fuel</dt>
          <dd class="flex items-center gap-3">
            <span class="font-mono tabular-nums">4.81 of 30 billion</span>
            <Meter
              class="w-24"
              aria-label="Fuel"
              value={4.81}
              max={30}
              valuetext="4.81 billion instructions of 30 billion"
            />
          </dd>
        </div>
        <div class="flex items-center justify-between gap-4">
          <dt class="text-muted-foreground">Memory</dt>
          <dd class="flex items-center gap-3">
            <span class="font-mono tabular-nums">38 of 128 MB</span>
            <Meter
              class="w-24"
              aria-label="Memory"
              value={38}
              max={128}
              valuetext="38 of 128 megabytes"
            />
          </dd>
        </div>
      </dl>
    </Card.Content>
  </Card.Root>
</div>
