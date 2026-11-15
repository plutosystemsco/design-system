<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "Two stops, off and on; Space flips the first.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Switch } from "#lib/registry/ui/switch";
</script>

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
