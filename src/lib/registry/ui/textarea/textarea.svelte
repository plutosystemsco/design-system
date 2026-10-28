<script lang="ts">
  import { getContext } from "svelte";
  import { cn, type WithElementRef, type WithoutChildren } from "#lib/utils";
  import type { HTMLTextareaAttributes } from "svelte/elements";

  /** The contract a `Field` sets under the key "pluto:field" (field decision 11). */
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
  }: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();

  const field = getContext<FieldContext | undefined>("pluto:field");
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
