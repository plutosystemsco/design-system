<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "#lib/utils";

  let {
    class: className,
    child,
    ...restProps
  }: HTMLAttributes<HTMLDivElement> & {
    /** Renders in place of the `<div>`, with its props. */
    child?: Snippet<[{ props: Record<string, unknown> }]>;
  } = $props();

  const merged = $derived({ class: cn("p-4", className), ...restProps });
</script>

{#if child}{@render child({ props: merged })}{:else}<div {...merged}></div>{/if}
