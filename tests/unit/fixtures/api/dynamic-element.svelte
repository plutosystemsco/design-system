<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { WithElementRef } from "#lib/utils";

  let {
    ref = $bindable(null),
    tag = "h2",
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> & {
    /** The heading's tag. */
    tag?: "h2" | "h3";
  } = $props();
</script>

<svelte:element this={tag} bind:this={ref} {...restProps} />
