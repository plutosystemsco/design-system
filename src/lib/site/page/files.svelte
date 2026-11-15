<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    files,
    children,
  }: {
    files: string[];
    /** More about the files, such as a block's code view. */
    children?: Snippet;
  } = $props();
</script>

{#if files.length}
  <ul class="groove-b max-w-prose">
    {#each files as file (file)}
      <li class="groove py-3 font-mono text-sm wrap-anywhere">{file}</li>
    {/each}
  </ul>
  <p class="mt-3 text-sm text-muted-foreground">
    Paths follow your <code>components.json</code>.
  </p>
{:else}
  <p class="max-w-prose">
    It writes no file of its own: <code>add</code> puts its variables and
    utilities into your stylesheet, the one <code>components.json</code> names.
  </p>
{/if}
{@render children?.()}
