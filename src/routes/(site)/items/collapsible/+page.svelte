<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as Collapsible from "#lib/registry/ui/collapsible";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="collapsible" />

{#snippet details(open: boolean)}
  <Collapsible.Root {open} class="grid max-w-md gap-3">
    <Collapsible.Trigger
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Environment variables</Collapsible.Trigger
    >
    <Collapsible.Content class="rounded border border-border p-4 text-sm">
      <code>PYTHONPATH</code>, <code>SANDBOX_FUEL</code> and two secrets.
    </Collapsible.Content>
  </Collapsible.Root>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A button that shows and hides a region. It has no look of its own: style the trigger and the content."
>
  <Specimen caption="closed" class="w-full">{@render details(false)}</Specimen>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Specimen caption="open" class="w-full">{@render details(true)}</Specimen>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The trigger is a button with <code>aria-expanded</code> and
      <code>aria-controls</code>; Enter and Space toggle it.
    </li>
    <li>It opens and closes without animation.</li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop; Enter opens it."
>
  <div data-testid="keyboard-fixture">{@render details(false)}</div>
</PreviewSection>
