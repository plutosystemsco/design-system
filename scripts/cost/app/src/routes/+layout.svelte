<script lang="ts">
  import "../app.css";
  import { onMount, type Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();

  // 025 decision 2.2: the root layout mounts after every child, so this mark
  // is when the page has hydrated.
  onMount(() => performance.mark("cost:hydrated"));
</script>

{@render children()}
