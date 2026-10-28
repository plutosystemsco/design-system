<script lang="ts">
  import { Textarea } from "#lib/registry/ui/textarea";
  import { cn } from "#lib/utils";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...props
  }: ComponentProps<typeof Textarea> = $props();
</script>

<!-- The group draws the focus indicator and the border; the control drops both. -->
<Textarea
  bind:ref
  data-slot="input-group-control"
  class={cn(
    "flex-1 resize-none rounded-none border-0 bg-transparent py-2 focus-visible:focus-ring-none",
    className,
  )}
  bind:value
  {...props}
/>
