<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import Install from "./install.svelte";

  let {
    name,
    since,
    modes,
    stock,
    lines,
    note,
  }: {
    name: string;
    since: string;
    modes: string[];
    /** The shadcn-svelte item this one is based on, when there is one. */
    stock?: string;
    lines: {
      site: HighlightedLine[] | null;
      github: HighlightedLine[] | null;
    } | null;
    /** A line under the install commands, such as a block's note on `-o`. */
    note?: Snippet;
  } = $props();
</script>

<!-- The facts: a flat card, as product screens are flat. -->
<div
  data-slot="facts"
  class="grid min-w-0 gap-5 rounded border border-border bg-card p-5 text-card-foreground"
>
  <div class="min-w-0">
    <Install {name} {lines} />
    {@render note?.()}
  </div>
  <dl class="flex flex-wrap gap-x-10 gap-y-3 text-sm">
    <div class="flex gap-2">
      <dt class="text-muted-foreground">Since</dt>
      <dd>{since}</dd>
    </div>
    <div class="flex gap-2">
      <dt class="text-muted-foreground">Modes</dt>
      <dd>{modes.join(", ")}</dd>
    </div>
    {#if stock}
      <div class="flex gap-2">
        <dt class="text-muted-foreground">Based on</dt>
        <dd>shadcn-svelte's <code>{stock}</code></dd>
      </div>
    {/if}
  </dl>
</div>
