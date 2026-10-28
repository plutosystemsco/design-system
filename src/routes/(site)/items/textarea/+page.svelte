<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Label } from "#lib/registry/ui/label";
  import { Textarea } from "#lib/registry/ui/textarea";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
</script>

<ItemHeader name="textarea" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="The input recipe, at least 64 px tall. It grows with its text where the browser supports field-sizing; elsewhere it can be resized."
>
  <div class="grid max-w-md gap-6">
    <Field.Field>
      <Field.Label>Notes</Field.Label>
      <Textarea />
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-8">
    <Field.Field>
      <Field.Label>With a placeholder</Field.Label>
      <Textarea placeholder="What changed in this run?" />
    </Field.Field>
    <Field.Field>
      <Field.Label>Filled</Field.Label>
      <Textarea
        value="The build now runs under Bun. Three steps moved from the CI script into the registry."
      />
    </Field.Field>
    <Field.Field>
      <Field.Label>Disabled</Field.Label>
      <Textarea disabled value="Read only" />
    </Field.Field>
    <Field.Field error="Write at least one sentence.">
      <Field.Label>Invalid, with its error</Field.Label>
      <Textarea />
    </Field.Field>
    <Field.Field description="Markdown is allowed.">
      <Field.Label>In a field, with a description</Field.Label>
      <Textarea />
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>A native <code>&lt;textarea&gt;</code> with a visible label.</li>
    <li>
      Inside a <code>Field</code>, it takes its <code>id</code>,
      <code>aria-describedby</code> and <code>aria-invalid</code> from the field.
    </li>
    <li>Invalid is a solid red border and the error in words.</li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: a plain textarea and an invalid one."
>
  <div data-testid="keyboard-fixture" class="grid max-w-md gap-6">
    <div class="grid gap-3">
      <Label for="kb-textarea">Plain</Label>
      <Textarea id="kb-textarea" />
    </div>
    <Field.Field error="This field is required.">
      <Field.Label>Invalid</Field.Label>
      <Textarea data-testid="invalid" />
    </Field.Field>
  </div>
</PreviewSection>
