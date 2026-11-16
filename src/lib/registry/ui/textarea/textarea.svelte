<script lang="ts">
  import { getContext } from "svelte";
  import { cn, type WithElementRef, type WithoutChildren } from "#lib/utils";
  import type { HTMLTextareaAttributes } from "svelte/elements";

  /** The contract a `Field` sets under the key "kuiper:field". */
  type FieldContext = {
    readonly id: string;
    readonly invalid: boolean;
    readonly describedBy: string | undefined;
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    "data-slot": dataSlot = "textarea",
    ...restProps
  }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {
    /** The text in the box. Bind it to read or set it. */
    value?: HTMLTextareaAttributes["value"];
    /**
     * The control's id. Inside a `Field` it defaults to the field's, so the
     * field's label points here.
     */
    id?: HTMLTextareaAttributes["id"];
    /**
     * The ids of the text that describes the control. Inside a `Field` it
     * defaults to the field's description and error.
     */
    "aria-describedby"?: HTMLTextareaAttributes["aria-describedby"];
    /**
     * Marks the control invalid and draws its border in the destructive colour.
     * Inside a `Field` it follows the field's `error` or `invalid`.
     */
    "aria-invalid"?: HTMLTextareaAttributes["aria-invalid"];
    /**
     * The `data-slot` the box carries, so a part that wraps it, such as an
     * input group's control, can name itself.
     */
    "data-slot"?: HTMLTextareaAttributes["data-slot"];
  } = $props();

  // A field from before 0.13.0 sets only its old key, read until 0.14.0.
  const field =
    getContext<FieldContext | undefined>("kuiper:field") ??
    getContext<FieldContext | undefined>("pluto:field");
</script>

<!--
  Grows with its text where the browser supports field-sizing; elsewhere it
  keeps its minimum height and the person can resize it.
-->
<textarea
  bind:this={ref}
  data-slot={dataSlot}
  class={cn(
    "field-sizing-content flex min-h-16 w-full resize-y rounded border border-input bg-card px-3 py-2 text-base text-foreground transition-[color,background-color,border-color] placeholder:text-muted-foreground aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50",
    className,
  )}
  id={id ?? field?.id}
  aria-describedby={describedBy ?? field?.describedBy}
  aria-invalid={invalid ?? (field?.invalid ? true : undefined)}
  bind:value
  {...restProps}></textarea>
