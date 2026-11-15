<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A field renders its children, then its description, then its error, and wires both to the control. From the top: a vertical field, a horizontal one with a switch, a set of radios with a legend, a choice card, and a separator with text.",
  };
</script>

<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as RadioGroup from "#lib/registry/ui/radio-group";
  import { Switch } from "#lib/registry/ui/switch";
</script>

<div class="grid max-w-md gap-12">
  <Field.Field
    description="Lowercase letters, numbers and hyphens."
    class="w-full"
  >
    <Field.Label>Project name</Field.Label>
    <Input />
  </Field.Field>
  <Field.Field orientation="horizontal" class="w-full">
    <Switch />
    <Field.Label>Email me when a run fails</Field.Label>
  </Field.Field>
  <Field.Set>
    <Field.Legend>Plan</Field.Legend>
    <RadioGroup.Root value="hobby">
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="hobby" id="plan-hobby" />
        <Field.Label for="plan-hobby">Hobby</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="team" id="plan-team" />
        <Field.Label for="plan-team">Team</Field.Label>
      </Field.Field>
    </RadioGroup.Root>
  </Field.Set>
  <Field.Label for="choice-logs">
    <Field.Field id="choice-logs" orientation="horizontal">
      <Checkbox checked aria-labelledby="choice-logs-title" />
      <Field.Content>
        <Field.Title id="choice-logs-title"
          >Keep run logs for 30 days</Field.Title
        >
        <Field.Description>Older logs are deleted each night.</Field.Description
        >
      </Field.Content>
    </Field.Field>
  </Field.Label>
  <div class="grid w-full gap-6">
    <Field.Separator>or continue with</Field.Separator>
  </div>
</div>
