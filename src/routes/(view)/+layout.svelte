<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { ThemeScript } from "#lib/registry/ui/theme";

  // A view is what an app's layout gives a page: a bare <main> and nothing
  // else (003 decision 16). It marks itself once hydrated, for the tests.
  let { children }: { children: Snippet } = $props();
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
</script>

<!-- The theme's head script, once per page (005 decision 16). -->
<ThemeScript />

<main class="min-h-svh" data-view-ready={ready ? "" : undefined}>
  {@render children()}
</main>
