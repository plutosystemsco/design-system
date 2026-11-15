<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Two stops: a plain input and an invalid one. The disabled input is skipped.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
</script>

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
