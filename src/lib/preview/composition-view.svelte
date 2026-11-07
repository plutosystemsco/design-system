<script lang="ts">
  import type { Snippet } from "svelte";
  import { ThemeScript } from "#lib/registry/ui/theme";

  /**
   * A composition's view (010 decision 10), in the (shell) group, which adds
   * no main: the view renders the theme's head script, what comes before the
   * main (a bar), the main with the id a skip link targets, and what comes
   * after it (a footer). A composition with no ground of its own sits in a
   * padded column on the page's ground.
   */
  let {
    title,
    children,
    before,
    after,
    padded = false,
  }: {
    /** The document's title. */
    title: string;
    children: Snippet;
    before?: Snippet;
    after?: Snippet;
    padded?: boolean;
  } = $props();
</script>

<svelte:head><title>{title}</title></svelte:head>

<ThemeScript />

{@render before?.()}
<main
  id="main"
  tabindex="-1"
  class={padded ? "mx-auto min-h-svh max-w-7xl px-6 py-16" : "min-h-svh"}
>
  {@render children()}
</main>
{@render after?.()}
