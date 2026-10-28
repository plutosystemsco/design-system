<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
</script>

<ItemHeader name="checkbox" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One checkbox, 24 px, at the case radius. Checked and mixed are blue, and told by their mark as well."
>
  <Field.Field orientation="horizontal" class="max-w-md">
    <Checkbox />
    <Field.Label>Email me a summary of each run</Field.Label>
  </Field.Field>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-6">
    <Field.Field orientation="horizontal">
      <Checkbox />
      <Field.Label>Unchecked</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Checkbox checked />
      <Field.Label>Checked</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Checkbox indeterminate />
      <Field.Label>Indeterminate</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Checkbox disabled />
      <Field.Label>Disabled</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Checkbox disabled checked />
      <Field.Label>Disabled, checked</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal" error="Accept the terms to continue.">
      <Checkbox />
      <Field.Label>Invalid, with its error</Field.Label>
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A <code>&lt;button role="checkbox"&gt;</code> with
      <code>aria-checked</code> true, false or mixed. Space toggles it.
    </li>
    <li>A check or a dash tells the state by shape, not colour alone.</li>
    <li>
      Named by its label; inside a <code>Field</code>, wired to its description
      and error.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Three stops; Space flips the first."
>
  <div data-testid="keyboard-fixture" class="grid max-w-md gap-4">
    <Field.Field orientation="horizontal">
      <Checkbox />
      <Field.Label>Runs</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Checkbox checked />
      <Field.Label>Deploys</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Checkbox indeterminate />
      <Field.Label>Billing</Field.Label>
    </Field.Field>
  </div>
</PreviewSection>
