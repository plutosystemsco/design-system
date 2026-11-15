<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "A password hidden and shown, and a group that is invalid, with its error.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as InputGroup from "#lib/registry/ui/input-group";
</script>

<div class="grid max-w-md gap-8">
  <Field.Field>
    <Field.Label>Password, hidden</Field.Label>
    <InputGroup.Password autocomplete="current-password" />
  </Field.Field>
  <Field.Field>
    <Field.Label>Password, shown</Field.Label>
    <InputGroup.Password
      autocomplete="new-password"
      value="correct horse"
      shown
    />
  </Field.Field>
  <Field.Field error="Enter a subdomain.">
    <Field.Label>Invalid, with its error</Field.Label>
    <InputGroup.Root>
      <InputGroup.Input />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Text>.example.com</InputGroup.Text>
      </InputGroup.Addon>
    </InputGroup.Root>
  </Field.Field>
</div>
