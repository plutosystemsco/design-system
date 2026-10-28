<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as RadioGroup from "#lib/registry/ui/radio-group";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";

  const options = [
    { value: "hobby", label: "Hobby" },
    { value: "team", label: "Team" },
    { value: "enterprise", label: "Enterprise", disabled: true },
  ];
</script>

<ItemHeader name="radio-group" />

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

<PreviewSection
  id="variants"
  title="Variants"
  intro="Round radios: the radio's mark is a dot, and the circle tells one of many from a checkbox's square."
>
  <Field.Set class="max-w-md">
    <Field.Legend>Plan</Field.Legend>
    {@render plans("variant", "hobby")}
  </Field.Set>
</PreviewSection>

<PreviewSection id="states" title="States">
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
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A <code>radiogroup</code> of <code>radio</code> items with one stop; the arrow
      keys move focus and choose.
    </li>
    <li>
      Inside a <code>FieldSet</code>, the legend names the group, and the group
      is wired to its description and error.
    </li>
    <li>The checked radio holds a blue dot and a blue ring.</li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop for the group; ArrowDown moves to the next option and checks it."
>
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
</PreviewSection>
