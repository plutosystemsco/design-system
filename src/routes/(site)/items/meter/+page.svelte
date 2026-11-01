<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import { Label } from "#lib/registry/ui/label";
  import { Meter } from "#lib/registry/ui/meter";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  // A fuel line: 4.81 billion instructions of a 30 billion cap.
  const fuel = { value: 4.81, max: 30 };
</script>

<ItemHeader name="meter" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="The native meter: a measurement within a known range, not progress. An 8 px bar with square ends on the muted track, filled in primary from the theme's rules. The consuming app names it and writes its numbers beside it; the fill is never the only sign."
>
  <div class="grid max-w-md gap-8">
    <Specimen
      caption="the fuel meter · Label for · the numbers beside it"
      class="w-full"
    >
      <div class="grid w-full gap-2" data-testid="fuel-meter">
        <div class="flex items-baseline justify-between gap-4">
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
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-8">
    <Specimen caption="empty · 0 of 30" class="w-full">
      <div class="grid w-full gap-2">
        <div class="flex items-baseline justify-between gap-4">
          <Label for="fuel-empty">Fuel</Label>
          <span class="font-mono text-sm text-muted-foreground"
            >Fuel: 0 of 30 billion</span
          >
        </div>
        <Meter id="fuel-empty" value={0} max={30} valuetext="0 of 30 billion" />
      </div>
    </Specimen>
    <Specimen caption="full · 30 of 30" class="w-full">
      <div class="grid w-full gap-2">
        <div class="flex items-baseline justify-between gap-4">
          <Label for="fuel-full">Fuel</Label>
          <span class="font-mono text-sm text-muted-foreground"
            >Fuel: 30 of 30 billion</span
          >
        </div>
        <Meter
          id="fuel-full"
          value={30}
          max={30}
          valuetext="30 of 30 billion"
        />
      </div>
    </Specimen>
    <Specimen
      caption="in a card row · a narrower meter · aria-label"
      class="w-full"
    >
      <Card.Root size="sm" class="w-full">
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
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A native <code>&lt;meter&gt;</code>, exposed as <code>meter</code> with
      its value; <code>valuetext</code> becomes <code>aria-valuetext</code>, so
      a reader hears "4.81 billion instructions of 30 billion", not a
      percentage.
    </li>
    <li>
      <strong>A meter needs a name.</strong> Give it a
      <code>&lt;Label for&gt;</code>
      or an <code>aria-label</code>; this page shows both.
    </li>
    <li>
      <strong>Write the numbers beside it.</strong> The fill is a sign, not the only
      sign. Primary on the muted track measures 4.90:1 in light and 5.22:1 in dark,
      above the 3:1 a non-text mark needs.
    </li>
    <li>
      No <code>low</code>, <code>high</code> or <code>optimum</code>: fuel is a
      number, not a warning. "Stopped: out of fuel" is an alert's. A meter is
      not progress; progress has its own role.
    </li>
    <li>A meter is not interactive and has no keyboard behaviour.</li>
  </ul>
</PreviewSection>
