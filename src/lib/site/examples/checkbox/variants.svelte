<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One checkbox, 24 px, at the case radius. Checked and mixed are blue, and told by their mark as well.",
  };
</script>

<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
</script>

<Field.Field orientation="horizontal" class="max-w-md">
  <Checkbox />
  <Field.Label>Email me a summary of each run</Field.Label>
</Field.Field>
