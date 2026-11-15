<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Nothing chosen, and invalid with its error. Enterprise is disabled in both.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as RadioGroup from "#lib/registry/ui/radio-group";

  const options = [
    { value: "hobby", label: "Hobby" },
    { value: "team", label: "Team" },
    { value: "enterprise", label: "Enterprise", disabled: true },
  ];
</script>

{#snippet plans(prefix: string, value: string)}
  <RadioGroup.Root {value}>
    {#each options as option (option.value)}
      <Field.Field orientation="horizontal">
        <RadioGroup.Item
          value={option.value}
          id="{prefix}-{option.value}"
          disabled={option.disabled}
        />
        <Field.Label for="{prefix}-{option.value}">{option.label}</Field.Label>
      </Field.Field>
    {/each}
  </RadioGroup.Root>
{/snippet}

<div class="grid max-w-md gap-8">
  <Field.Set>
    <Field.Legend>Nothing chosen</Field.Legend>
    {@render plans("none", "")}
  </Field.Set>
  <Field.Set error="Choose a plan.">
    <Field.Legend>Invalid, with its error</Field.Legend>
    {@render plans("invalid", "")}
  </Field.Set>
</div>
