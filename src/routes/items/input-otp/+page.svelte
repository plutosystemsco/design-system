<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import OtpSix from "#lib/preview/otp-six.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
</script>

<ItemHeader name="input-otp" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Six 48 px cells in two groups of three, over one real input. The active cell has a blue border and a still caret."
>
  <Field.Field class="max-w-md">
    <Field.Label>Verification code</Field.Label>
    <OtpSix />
  </Field.Field>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-8">
    <div data-testid="otp-paste">
      <Field.Field>
        <Field.Label>Empty</Field.Label>
        <OtpSix />
      </Field.Field>
    </div>
    <Field.Field>
      <Field.Label>Partly filled</Field.Label>
      <OtpSix value="123" />
    </Field.Field>
    <Field.Field>
      <Field.Label>Complete</Field.Label>
      <OtpSix value="123456" />
    </Field.Field>
    <div data-testid="invalid">
      <Field.Field error="That code has expired. We sent a new one.">
        <Field.Label>Invalid, with its error</Field.Label>
        <OtpSix value="123456" />
      </Field.Field>
    </div>
    <Field.Field>
      <Field.Label>Disabled</Field.Label>
      <OtpSix disabled />
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      One real <code>&lt;input&gt;</code> with
      <code>autocomplete="one-time-code"</code>,
      <code>inputmode="numeric"</code> and a digits-only pattern.
    </li>
    <li>
      A pasted code loses every non-digit first, so "123 456" or "123-456" fills
      all six cells.
    </li>
    <li>
      Inside a <code>Field</code>, its label names the real input, which carries
      the field's description, error and invalid state.
    </li>
    <li>Invalid turns every cell's border red; the error says why in words.</li>
    <li>The caret does not blink.</li>
  </ul>
</PreviewSection>

<PreviewSection id="keyboard" title="Keyboard" intro="One stop.">
  <div data-testid="keyboard-fixture" class="max-w-md">
    <Field.Field>
      <Field.Label>Code from your authenticator</Field.Label>
      <OtpSix />
    </Field.Field>
  </div>
</PreviewSection>
