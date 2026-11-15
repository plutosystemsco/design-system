<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "The input recipe, at least 64 px tall. It grows with its text where the browser supports field-sizing; elsewhere it can be resized.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Textarea } from "#lib/registry/ui/textarea";
</script>

<div class="grid max-w-md gap-6">
  <Field.Field>
    <Field.Label>Notes</Field.Label>
    <Textarea />
  </Field.Field>
</div>
