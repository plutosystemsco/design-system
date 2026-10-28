<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="label" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One label, in sentence case."
>
  <div class="flex flex-wrap items-start gap-12">
    <Specimen caption="alone, for an input">
      <div class="grid w-64 gap-3">
        <Label for="label-email">Email address</Label>
        <Input id="label-email" type="email" placeholder="you@example.com" />
      </div>
    </Specimen>
    <Specimen caption="beside a checkbox">
      <div class="flex items-center gap-3">
        <Checkbox id="label-terms" />
        <Label for="label-terms">Accept the terms</Label>
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Specimen caption="beside a disabled checkbox">
    <div class="flex items-center gap-3">
      <Checkbox id="label-disabled" disabled class="peer" />
      <Label for="label-disabled">Send weekly digest</Label>
    </div>
  </Specimen>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A native <code>&lt;label&gt;</code>, linked to its control by
      <code>for</code>.
    </li>
    <li>A placeholder is not a label: every control keeps a visible one.</li>
    <li>A disabled peer dims the label.</li>
  </ul>
</PreviewSection>
