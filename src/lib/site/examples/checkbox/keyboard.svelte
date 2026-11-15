<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "Three stops; Space flips the first.",
  };
</script>

<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
</script>

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
