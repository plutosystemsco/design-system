<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";

  // Horizontal: the control in the first column; the label, description and
  // error stacked in the second, so one control has one text column.
  export const fieldVariants = tv({
    base: "group/field w-full",
    variants: {
      orientation: {
        vertical: "flex flex-col gap-3 *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 has-[>[data-slot=field-content]]:items-start *:data-[slot=field-description]:col-start-2 *:data-[slot=field-error]:col-start-2",
        responsive:
          "flex flex-col gap-3 *:w-full [&>.sr-only]:w-auto @md/field-group:grid @md/field-group:grid-cols-[auto_1fr] @md/field-group:items-center @md/field-group:gap-x-3 @md/field-group:gap-y-1 @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-description]:col-start-2 @md/field-group:*:data-[slot=field-error]:col-start-2",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  });

  export type FieldOrientation = VariantProps<
    typeof fieldVariants
  >["orientation"];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import FieldDescription from "./field-description.svelte";
  import FieldError from "./field-error.svelte";
  import {
    fieldContext,
    setFieldContext,
    setLabelTarget,
  } from "./field-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    orientation = "vertical",
    id,
    description,
    error,
    invalid,
    children,
    ...restProps
  }: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, "id"> & {
    orientation?: FieldOrientation;
    /** The control's id. Without it, the field makes one. */
    id?: string;
    /** Rendered after the children, and wired to the control by `aria-describedby`. */
    description?: string | Snippet;
    /** Rendered after the description, wired to the control, and making it invalid. */
    error?: string | Snippet;
    /** Overrides the invalid state that `error` implies. */
    invalid?: boolean;
  } = $props();

  const uid = $props.id();
  const context = setFieldContext(
    fieldContext({
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
    }),
  );
  setLabelTarget(context);
</script>

<div
  bind:this={ref}
  role="group"
  data-slot="field"
  data-orientation={orientation}
  data-invalid={context.invalid ? "true" : undefined}
  class={cn(fieldVariants({ orientation }), className)}
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
</div>
