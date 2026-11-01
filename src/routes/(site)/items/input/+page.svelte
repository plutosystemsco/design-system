<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
</script>

<ItemHeader name="input" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One input, 48 px tall, on the raised ground with a visible border. Its text stays at 16 px."
>
  <div class="grid max-w-md gap-6">
    <Field.Field>
      <Field.Label>Project name</Field.Label>
      <Input />
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-8">
    <Field.Field>
      <Field.Label>Empty</Field.Label>
      <Input />
    </Field.Field>
    <Field.Field>
      <Field.Label>With a placeholder</Field.Label>
      <Input placeholder="you@example.com" type="email" />
    </Field.Field>
    <Field.Field>
      <Field.Label>Filled</Field.Label>
      <Input value="pluto-sandbox" />
    </Field.Field>
    <Field.Field>
      <Field.Label>Disabled</Field.Label>
      <Input disabled value="Read only" />
    </Field.Field>
    <Field.Field error="Enter an email address, like name@example.com.">
      <Field.Label>Invalid, with its error</Field.Label>
      <Input type="email" value="ada@" />
    </Field.Field>
    <Field.Field>
      <Field.Label>A file</Field.Label>
      <Input type="file" />
    </Field.Field>
    <Field.Field description="We send the sign-in link here.">
      <Field.Label>In a field, with a description</Field.Label>
      <Input type="email" autocomplete="email" />
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>A native <code>&lt;input&gt;</code> with a visible label.</li>
    <li>
      Inside a <code>Field</code>, it takes its <code>id</code>,
      <code>aria-describedby</code> and <code>aria-invalid</code> from the field.
    </li>
    <li>Invalid is a solid red border and the error in words.</li>
    <li><code>autocomplete</code> is the consuming app's, passed through.</li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: a plain input and an invalid one. The disabled input is skipped."
>
  <div data-testid="keyboard-fixture" class="grid max-w-md gap-6">
    <div class="grid gap-3">
      <Label for="kb-plain">Plain</Label>
      <Input id="kb-plain" />
    </div>
    <div class="grid gap-3">
      <Label for="kb-disabled">Disabled</Label>
      <Input id="kb-disabled" disabled />
    </div>
    <Field.Field id="kb-invalid" error="This field is required.">
      <Field.Label>Invalid</Field.Label>
      <Input data-testid="invalid" />
    </Field.Field>
  </div>
</PreviewSection>
