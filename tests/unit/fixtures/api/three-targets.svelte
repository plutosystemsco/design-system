<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { WithElementRef } from "#lib/utils";

  let {
    ref = $bindable(null),
    side = "a",
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> & {
    /** Which branch renders. */
    side?: "a" | "b" | "c";
  } = $props();
</script>

{#if side === "a"}
  <nav bind:this={ref} {...restProps}></nav>
{:else if side === "b"}
  <div bind:this={ref} {...restProps}></div>
{:else}
  <aside bind:this={ref} {...restProps}></aside>
{/if}
