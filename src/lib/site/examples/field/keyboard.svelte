<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Two stops: a valid input and an invalid one, each described by its field.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
</script>

<div data-testid="keyboard-fixture" class="grid max-w-md gap-6">
  <Field.Field id="kb-valid" description="Lowercase letters and numbers.">
    <Field.Label>Username</Field.Label>
    <Input />
  </Field.Field>
  <Field.Field
    id="kb-invalid"
    description="At least twelve characters."
    error="Too short."
  >
    <Field.Label>Password</Field.Label>
    <Input type="password" />
  </Field.Field>
</div>
