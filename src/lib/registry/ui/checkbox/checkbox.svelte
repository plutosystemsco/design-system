<script lang="ts">
  import { Checkbox as CheckboxPrimitive } from "bits-ui";
  import CheckIcon from "phosphor-svelte/lib/Check";
  import MinusIcon from "phosphor-svelte/lib/Minus";
  import { getContext } from "svelte";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";

  /** The contract a `Field` sets under the key "pluto:field". */
  type FieldContext = {
    readonly id: string;
    readonly invalid: boolean;
    readonly describedBy: string | undefined;
  };

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    ...restProps
  }: WithoutChildrenOrChild<CheckboxPrimitive.RootProps> = $props();

  const field = getContext<FieldContext | undefined>("pluto:field");
</script>

<!-- 24 px, so the 8 px case radius draws a rounded square, not a circle. -->
<CheckboxPrimitive.Root
  bind:ref
  data-slot="checkbox"
  class={cn(
    "peer relative flex size-6 shrink-0 items-center justify-center rounded border border-input bg-card text-primary-foreground transition-[background-color,border-color] group-has-disabled/field:opacity-50 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary data-checked:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
    className,
  )}
  id={id ?? field?.id}
  aria-describedby={describedBy ?? field?.describedBy}
  aria-invalid={invalid ?? (field?.invalid ? true : undefined)}
  bind:checked
  bind:indeterminate
  {...restProps}
>
  {#snippet children({ checked, indeterminate })}
    <span
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current"
    >
      {#if checked}
        <CheckIcon aria-hidden="true" weight="bold" class="size-4" />
      {:else if indeterminate}
        <MinusIcon aria-hidden="true" weight="bold" class="size-4" />
      {/if}
    </span>
  {/snippet}
</CheckboxPrimitive.Root>
