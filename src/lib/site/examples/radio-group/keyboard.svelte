<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop for the group; ArrowDown moves to the next option and checks it.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as RadioGroup from "#lib/registry/ui/radio-group";
</script>

<div data-testid="keyboard-fixture" class="max-w-md">
  <Field.Set>
    <Field.Legend>Region</Field.Legend>
    <RadioGroup.Root value="eu">
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="eu" id="kb-eu" />
        <Field.Label for="kb-eu">Europe</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="us" id="kb-us" />
        <Field.Label for="kb-us">Americas</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="ap" id="kb-ap" />
        <Field.Label for="kb-ap">Asia Pacific</Field.Label>
      </Field.Field>
    </RadioGroup.Root>
  </Field.Set>
</div>
