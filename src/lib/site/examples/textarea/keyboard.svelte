<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "Two stops: a plain textarea and an invalid one.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Label } from "#lib/registry/ui/label";
  import { Textarea } from "#lib/registry/ui/textarea";
</script>

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
