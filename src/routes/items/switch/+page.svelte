<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Switch } from "#lib/registry/ui/switch";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
</script>

<ItemHeader name="switch" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A 64 × 32 track with a 24 px thumb inset 4 px, both at the case radius. On is blue, and the thumb moves to the end. The tests measure the two below."
>
  <div class="grid max-w-md gap-6">
    <Field.Field orientation="horizontal">
      <Switch data-testid="switch-off" />
      <Field.Label>Off</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Switch data-testid="switch-on" checked />
      <Field.Label>On</Field.Label>
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-6">
    <Field.Field orientation="horizontal">
      <Switch disabled />
      <Field.Label>Disabled, off</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Switch disabled checked />
      <Field.Label>Disabled, on</Field.Label>
    </Field.Field>
    <Field.Field
      orientation="horizontal"
      error="Turn on two-factor sign-in to continue."
    >
      <Switch />
      <Field.Label>Invalid, with its error</Field.Label>
    </Field.Field>
    <Field.Field
      orientation="horizontal"
      description="We email you when a run fails on main."
    >
      <Switch />
      <Field.Label>In a field, with a description</Field.Label>
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A <code>&lt;button role="switch"&gt;</code> with
      <code>aria-checked</code>. Space and Enter toggle it.
    </li>
    <li>On is told by the thumb's position as well as by colour.</li>
    <li>A switch always has a visible label; a <code>Field</code> wires it.</li>
    <li>
      Invalid is said in words only: the track has no border to turn red. A
      required consent is a checkbox, not a switch.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops, off and on; Space flips the first."
>
  <div data-testid="keyboard-fixture" class="grid max-w-md gap-4">
    <Field.Field orientation="horizontal">
      <Switch />
      <Field.Label>Notifications</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <Switch checked />
      <Field.Label>Public profile</Field.Label>
    </Field.Field>
  </div>
</PreviewSection>
