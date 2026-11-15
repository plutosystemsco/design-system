<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A 64 × 32 track with a 24 px thumb inset 4 px, both at the case radius. On is blue, and the thumb moves to the end. The tests measure the two below.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Switch } from "#lib/registry/ui/switch";
</script>

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
