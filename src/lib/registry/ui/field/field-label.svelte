<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { cn } from "#lib/utils";
  import type { ComponentProps } from "svelte";
  import { getLabelTarget } from "./field-context.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    for: forProp,
    children,
    ...restProps
  }: ComponentProps<typeof Label> = $props();

  // Points at the control of the nearest Field, unless the app names one.
  const target = getLabelTarget();
</script>

<Label
  bind:ref
  data-slot="field-label"
  for={forProp ?? target?.id}
  class={cn(
    "group/field-label peer/field-label flex w-fit gap-2 group-data-[disabled=true]/field:opacity-50",
    "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-border has-data-checked:border-primary *:data-[slot=field]:p-4",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</Label>
