<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  // A view is what an app's layout gives a page: a bare <main> and nothing
  // else (003 decision 16). It marks itself once hydrated, for the tests.
  let { children }: { children: Snippet } = $props();
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
</script>

<main class="min-h-svh" data-view-ready={ready ? "" : undefined}>
  {@render children()}
</main>
