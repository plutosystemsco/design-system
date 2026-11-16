<script lang="ts">
  import type { Snippet } from "svelte";
  import { Popover as PopoverPrimitive } from "bits-ui";

  let { children: childrenProp }: { children?: Snippet } = $props();
</script>

<PopoverPrimitive.Trigger>
  {#snippet children()}
    {@render childrenProp?.()}
  {/snippet}
</PopoverPrimitive.Trigger>
