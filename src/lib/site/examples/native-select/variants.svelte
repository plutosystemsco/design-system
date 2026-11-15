<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "The browser's own select, styled as an input, with a caret. The open list is drawn by the operating system in the theme's colour scheme.",
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

<div class="grid max-w-md gap-6">
  <Field.Field>
    <Field.Label>Region</Field.Label>
    <NativeSelect.Root>{@render regions()}</NativeSelect.Root>
  </Field.Field>
</div>
