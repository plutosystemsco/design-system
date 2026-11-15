<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "With a placeholder, filled, disabled, invalid with its error, and in a field with a description.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Textarea } from "#lib/registry/ui/textarea";
</script>

<div class="grid max-w-md gap-8">
  <Field.Field>
    <Field.Label>With a placeholder</Field.Label>
    <Textarea placeholder="What changed in this run?" />
  </Field.Field>
  <Field.Field>
    <Field.Label>Filled</Field.Label>
    <Textarea
      value="The build now runs under Bun. Three steps moved from the CI script into the registry."
    />
  </Field.Field>
  <Field.Field>
    <Field.Label>Disabled</Field.Label>
    <Textarea disabled value="Read only" />
  </Field.Field>
  <Field.Field error="Write at least one sentence.">
    <Field.Label>Invalid, with its error</Field.Label>
    <Textarea />
  </Field.Field>
  <Field.Field description="Markdown is allowed.">
    <Field.Label>In a field, with a description</Field.Label>
    <Textarea />
  </Field.Field>
</div>
