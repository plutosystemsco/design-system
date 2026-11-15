<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";
  import ExampleThemeScript from "#lib/site/example-theme-script.svelte";

  let { children }: { children: Snippet } = $props();

  // The page that holds the frame shows it once this is set, so it never
  // flashes.
  onMount(() => document.body.setAttribute("data-view-ready", ""));
</script>

<!-- No ThemeScript and no chrome: the frame's theme is its address's. -->
<ExampleThemeScript />

{@render children()}
