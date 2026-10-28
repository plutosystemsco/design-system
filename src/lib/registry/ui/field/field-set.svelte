<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { Snippet } from "svelte";
  import type { HTMLFieldsetAttributes } from "svelte/elements";
  import FieldDescription from "./field-description.svelte";
  import FieldError from "./field-error.svelte";
  import {
    fieldContext,
    setFieldSetContext,
    setLabelTarget,
    type FieldSetContext,
  } from "./field-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    id,
    description,
    error,
    invalid,
    children,
    ...restProps
  }: Omit<WithElementRef<HTMLFieldsetAttributes>, "id"> & {
    /** The group control's id, such as a radio group's. Without it, the set makes one. */
    id?: string;
    /** Rendered after the children, and wired to the fieldset, and to a group control, by `aria-describedby`. */
    description?: string | Snippet;
    /** Rendered after the description, wired to the fieldset and a group control, and making the group invalid. */
    error?: string | Snippet;
    /** Overrides the invalid state that `error` implies. */
    invalid?: boolean;
  } = $props();

  const uid = $props.id();
  let legendGetter: (() => string | undefined) | undefined;
  const wiring = fieldContext({
    get id() {
      return id ?? uid;
    },
    get invalid() {
      return invalid;
    },
    get hasDescription() {
      return description !== undefined;
    },
    get hasError() {
      return error !== undefined;
    },
  });
  // Not the field context: only a group control reads the set's wiring.
  const context: FieldSetContext = setFieldSetContext({
    get id() {
      return wiring.id;
    },
    get descriptionId() {
      return wiring.descriptionId;
    },
    get errorId() {
      return wiring.errorId;
    },
    get invalid() {
      return wiring.invalid;
    },
    get describedBy() {
      return wiring.describedBy;
    },
    get legendId() {
      return `${wiring.id}-legend`;
    },
    get legend() {
      return legendGetter?.();
    },
    registerLegend(id) {
      legendGetter = id;
    },
  });
  // The legend names the group; a label here belongs to a Field of its own.
  setLabelTarget(undefined);
</script>

<fieldset
  bind:this={ref}
  data-slot="field-set"
  data-invalid={context.invalid ? "true" : undefined}
  aria-describedby={context.describedBy}
  class={cn(
    "flex flex-col gap-6 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
  {#if description !== undefined}
    <FieldDescription id={context.descriptionId}>
      {#if typeof description === "string"}{description}{:else}{@render description()}{/if}
    </FieldDescription>
  {/if}
  {#if error !== undefined}
    <FieldError id={context.errorId}>
      {#if typeof error === "string"}{error}{:else}{@render error()}{/if}
    </FieldError>
  {/if}
</fieldset>
