<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
  import { getContext } from "svelte";
  import { cn } from "#lib/utils";

  /** The contract a `FieldSet` sets under the key "kuiper:field-set". */
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
  }: RadioGroupPrimitive.RootProps & {
    /** The value of the chosen radio. Bind it to read or set it. */
    value?: RadioGroupPrimitive.RootProps["value"];
    /** The group's id. Inside a `FieldSet` it defaults to the set's. */
    id?: RadioGroupPrimitive.RootProps["id"];
    /**
     * The ids of the text that describes the group. Inside a `FieldSet` it
     * defaults to the set's description and error.
     */
    "aria-describedby"?: RadioGroupPrimitive.RootProps["aria-describedby"];
    /**
     * Marks the group invalid. Inside a `FieldSet` it follows the set's `error`
     * or `invalid`.
     */
    "aria-invalid"?: RadioGroupPrimitive.RootProps["aria-invalid"];
    /**
     * The id of what names the group. Inside a `FieldSet` it defaults to the
     * set's `FieldLegend`.
     */
    "aria-labelledby"?: RadioGroupPrimitive.RootProps["aria-labelledby"];
  } = $props();

  // A radio group is a group control: it takes its set's wiring and its legend's name.
  // A field set from before 0.13.0 sets only its old key, read until 0.14.0.
  const field =
    getContext<FieldSetContext | undefined>("kuiper:field-set") ??
    getContext<FieldSetContext | undefined>("pluto:field-set");
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
