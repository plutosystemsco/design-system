<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    label,
    names,
    class: className,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLUListElement>> & {
    /** The list's accessible name: what the names are. */
    label: string;
    /**
     * The names to list, in order: customers, partners or the like, as text.
     */
    names: string[];
  } = $props();
</script>

<!-- A named list of names in mono furniture, muted, wrapping on a phone. -->
<ul
  bind:this={ref}
  data-slot="name-strip"
  aria-label={label}
  class={cn(
    "flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-muted-foreground",
    className,
  )}
  {...restProps}
>
  {#each names as name, index (index)}
    <li>{name}</li>
  {/each}
</ul>
