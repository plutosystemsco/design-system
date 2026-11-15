<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    label,
    caption,
    head,
    children,
  }: {
    /** The scrolling region's name. */
    label: string;
    caption?: string;
    /** The column headers. */
    head: string[];
    /** The body's rows. */
    children: Snippet;
  } = $props();
</script>

<!--
  A generated table on a Foundations page. Each cell is styled from the
  table, so a row's markup stays small. Below md each row stacks, its cells
  one under another, and the header is read by screen readers alone.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  data-slot="site-scroll"
  role="region"
  aria-label="{label}, table"
  tabindex="0"
  class="mt-6 min-w-0 overflow-x-auto rounded border border-border"
>
  <table
    class="w-full border-collapse text-sm [&_tbody_tr]:groove-b [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:px-4 [&_th]:py-3 [&_th]:text-start [&_th]:font-medium max-md:[&_tbody_tr]:grid max-md:[&_tbody_tr]:gap-y-2 max-md:[&_tbody_tr]:px-4 max-md:[&_tbody_tr]:py-3 max-md:[&_td]:p-0"
  >
    {#if caption}
      <caption class="groove-b bg-card px-4 py-3 text-start font-semibold"
        >{caption}</caption
      >
    {/if}
    <thead class="max-md:sr-only">
      <tr class="groove-b text-muted-foreground">
        {#each head as h (h)}<th scope="col">{h}</th>{/each}
      </tr>
    </thead>
    <tbody>{@render children()}</tbody>
  </table>
</div>
