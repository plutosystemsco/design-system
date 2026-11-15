<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Chosen, disabled, invalid with its error, and in a field with a description.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as NativeSelect from "#lib/registry/ui/native-select";
</script>

{#snippet regions()}
  <NativeSelect.Option value="">Choose a region</NativeSelect.Option>
  <NativeSelect.OptGroup label="Europe">
    <NativeSelect.Option value="fra">Frankfurt</NativeSelect.Option>
    <NativeSelect.Option value="ams">Amsterdam</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Americas">
    <NativeSelect.Option value="iad">Ashburn</NativeSelect.Option>
  </NativeSelect.OptGroup>
{/snippet}

<div class="grid max-w-md gap-8">
  <Field.Field>
    <Field.Label>Chosen</Field.Label>
    <NativeSelect.Root value="ams">{@render regions()}</NativeSelect.Root>
  </Field.Field>
  <Field.Field>
    <Field.Label>Disabled</Field.Label>
    <NativeSelect.Root disabled>{@render regions()}</NativeSelect.Root>
  </Field.Field>
  <Field.Field error="Choose a region.">
    <Field.Label>Invalid, with its error</Field.Label>
    <NativeSelect.Root>{@render regions()}</NativeSelect.Root>
  </Field.Field>
  <Field.Field description="Runs execute in this region.">
    <Field.Label>In a field, with a description</Field.Label>
    <NativeSelect.Root>{@render regions()}</NativeSelect.Root>
  </Field.Field>
</div>
