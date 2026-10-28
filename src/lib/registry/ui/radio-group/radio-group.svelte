<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
  import { getContext } from "svelte";
  import { cn } from "#lib/utils";

  /** The contract a `FieldSet` sets under the key "pluto:field-set" (field decision 11). */
  type FieldSetContext = {
    readonly id: string;
    readonly invalid: boolean;
    readonly describedBy: string | undefined;
    readonly legend: string | undefined;
  };

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(""),
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    "aria-labelledby": labelledBy,
    ...restProps
  }: RadioGroupPrimitive.RootProps = $props();

  // A radio group is a group control: it takes its set's wiring and its legend's name.
  const field = getContext<FieldSetContext | undefined>("pluto:field-set");
</script>

<RadioGroupPrimitive.Root
  bind:ref
  bind:value
  data-slot="radio-group"
  class={cn("group/radio-group grid w-full gap-3", className)}
  id={id ?? field?.id}
  aria-describedby={describedBy ?? field?.describedBy}
  aria-invalid={invalid ?? (field?.invalid ? true : undefined)}
  aria-labelledby={labelledBy ?? field?.legend}
  {...restProps}
/>
