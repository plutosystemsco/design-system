<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    children,
    ...restProps
  }: HTMLAttributes<HTMLDivElement> & {
    /** The item's own sentence, which the generator keeps. */
    children?: Snippet;
  } = $props();
</script>

<div {...restProps}>{@render children?.()}</div>
