<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Disabled off and on, invalid with its error, and in a field with a description.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Switch } from "#lib/registry/ui/switch";
</script>

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
