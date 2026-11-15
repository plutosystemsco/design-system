<script lang="ts" module>
  export const meta = {
    title: "Colours",
    intro:
      "The semantic tokens in the current theme, each with its value. Components use only these.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();
</script>

<p class="text-sm text-muted-foreground">
  {data.swatches.length} tokens, in light and in dark.
</p>
<ul class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
  {#each data.swatches as swatch (swatch.name)}
    <li class="flex items-center gap-3">
      <span
        aria-hidden="true"
        class="size-8 shrink-0 rounded border border-input"
        style="background-color: var(--{swatch.name})"
      ></span>
      <span class="flex flex-col">
        <code class="text-sm">{swatch.name}</code>
        <span class="font-mono text-xs text-muted-foreground">
          <span class="dark:hidden">{swatch.light}</span>
          <span class="hidden dark:inline">{swatch.dark}</span>
        </span>
      </span>
    </li>
  {/each}
</ul>
