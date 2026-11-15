<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One input, 48 px tall, on the raised ground with a visible border. Its text stays at 16 px.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
</script>

<div class="grid max-w-md gap-6">
  <Field.Field>
    <Field.Label>Project name</Field.Label>
    <Input />
  </Field.Field>
</div>
