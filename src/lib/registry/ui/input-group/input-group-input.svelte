<script lang="ts">
  import { Input } from "#lib/registry/ui/input";
  import { cn } from "#lib/utils";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...props
  }: ComponentProps<typeof Input> = $props();
</script>

<!-- The group draws the focus indicator and the border; the control drops both. -->
<Input
  bind:ref
  data-slot="input-group-control"
  class={cn(
    "h-auto flex-1 self-stretch rounded-none border-0 bg-transparent focus-visible:focus-ring-none",
    className,
  )}
  bind:value
  {...props}
/>
