<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "Two stops: a plain select and an invalid one.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { Label } from "#lib/registry/ui/label";
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

<div data-testid="keyboard-fixture" class="grid max-w-md gap-6">
  <div class="grid gap-3">
    <Label for="kb-select">Plain</Label>
    <NativeSelect.Root id="kb-select">{@render regions()}</NativeSelect.Root>
  </div>
  <Field.Field error="Choose a region.">
    <Field.Label>Invalid</Field.Label>
    <NativeSelect.Root data-testid="invalid"
      >{@render regions()}</NativeSelect.Root
    >
  </Field.Field>
</div>
