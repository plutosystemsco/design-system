<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "Round radios: the radio's mark is a dot, and the circle tells one of many from a checkbox's square.",
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

<Field.Set class="max-w-md">
  <Field.Legend>Plan</Field.Legend>
  {@render plans("variant", "hobby")}
</Field.Set>
