<script lang="ts" module>
  export const meta = {
    title: "States",
    intro: "Invalid: the error shows under the control, which turns red.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
</script>

<div class="grid max-w-md gap-8">
  <Field.Field error="Enter a project name.">
    <Field.Label>Invalid, with its error</Field.Label>
    <Input />
  </Field.Field>
</div>
