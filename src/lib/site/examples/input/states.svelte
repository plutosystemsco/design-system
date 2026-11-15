<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Empty, with a placeholder, filled, disabled, invalid with its error, a file, and in a field with a description.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
</script>

<div class="grid max-w-md gap-8">
  <Field.Field>
    <Field.Label>Empty</Field.Label>
    <Input />
  </Field.Field>
  <Field.Field>
    <Field.Label>With a placeholder</Field.Label>
    <Input placeholder="you@example.com" type="email" />
  </Field.Field>
  <Field.Field>
    <Field.Label>Filled</Field.Label>
    <Input value="pluto-sandbox" />
  </Field.Field>
  <Field.Field>
    <Field.Label>Disabled</Field.Label>
    <Input disabled value="Read only" />
  </Field.Field>
  <Field.Field error="Enter an email address, like name@example.com.">
    <Field.Label>Invalid, with its error</Field.Label>
    <Input type="email" value="ada@" />
  </Field.Field>
  <Field.Field>
    <Field.Label>A file</Field.Label>
    <Input type="file" />
  </Field.Field>
  <Field.Field description="We send the sign-in link here.">
    <Field.Label>In a field, with a description</Field.Label>
    <Input type="email" autocomplete="email" />
  </Field.Field>
</div>
