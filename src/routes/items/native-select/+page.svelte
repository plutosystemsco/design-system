<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Label } from "#lib/registry/ui/label";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
</script>

<ItemHeader name="native-select" />

{#snippet regions()}
  <NativeSelect.Option value="">Choose a region</NativeSelect.Option>
  <NativeSelect.OptGroup label="Europe">
    <NativeSelect.Option value="fra">Frankfurt</NativeSelect.Option>
    <NativeSelect.Option value="ams">Amsterdam</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Americas">
    <NativeSelect.Option value="iad">Ashburn</NativeSelect.Option>
  </NativeSelect.OptGroup>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="The browser's own select, styled as an input, with a caret. The open list is drawn by the operating system in the theme's colour scheme."
>
  <div class="grid max-w-md gap-6">
    <Field.Field>
      <Field.Label>Region</Field.Label>
      <NativeSelect.Root>{@render regions()}</NativeSelect.Root>
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-8">
    <Field.Field>
      <Field.Label>Chosen</Field.Label>
      <NativeSelect.Root value="ams">{@render regions()}</NativeSelect.Root>
    </Field.Field>
    <Field.Field>
      <Field.Label>Disabled</Field.Label>
      <NativeSelect.Root disabled>{@render regions()}</NativeSelect.Root>
    </Field.Field>
    <Field.Field error="Choose a region.">
      <Field.Label>Invalid, with its error</Field.Label>
      <NativeSelect.Root>{@render regions()}</NativeSelect.Root>
    </Field.Field>
    <Field.Field description="Runs execute in this region.">
      <Field.Label>In a field, with a description</Field.Label>
      <NativeSelect.Root>{@render regions()}</NativeSelect.Root>
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A native <code>&lt;select&gt;</code>: the arrow keys, typing and the
      platform's own list all work.
    </li>
    <li>
      Inside a <code>Field</code>, it takes its <code>id</code>,
      <code>aria-describedby</code> and <code>aria-invalid</code> from the field.
    </li>
    <li>The caret is decorative.</li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: a plain select and an invalid one."
>
  <div data-testid="keyboard-fixture" class="grid max-w-md gap-6">
    <div class="grid gap-3">
      <Label for="kb-select">Plain</Label>
      <NativeSelect.Root id="kb-select">{@render regions()}</NativeSelect.Root>
    </div>
    <Field.Field error="Choose a region.">
      <Field.Label>Invalid</Field.Label>
      <NativeSelect.Root data-testid="invalid"
        >{@render regions()}</NativeSelect.Root
      >
    </Field.Field>
  </div>
</PreviewSection>
