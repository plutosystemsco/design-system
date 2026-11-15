<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Unchecked, checked, indeterminate, disabled, disabled and checked, and invalid with its error.",
  };
</script>

<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
</script>

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
