<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<!--
  Round: the radio's mark is a dot, so it is dot-derived, and the circle tells
  one of many from a checkbox's square (decisions.md, "Radio buttons are round").
-->
<RadioGroupPrimitive.Item
  bind:ref
  data-slot="radio-group-item"
  class={cn(
    "group/radio-group-item peer relative flex size-6 shrink-0 items-center justify-center rounded-full border border-input bg-card transition-[border-color] group-aria-[invalid=true]/radio-group:border-destructive disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary",
    className,
  )}
  {...restProps}
>
  {#snippet children({ checked })}
    {#if checked}
      <span
        data-slot="radio-group-indicator"
        aria-hidden="true"
        class="size-3 rounded-full bg-primary"
      ></span>
    {/if}
  {/snippet}
</RadioGroupPrimitive.Item>
