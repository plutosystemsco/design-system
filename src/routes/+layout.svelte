<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";

  // The root layout has no chrome: the site's header lives in (site), and a
  // view (view) shows only its block (003 decision 16). Each of the two
  // renders the theme's head script, so a page holds exactly one (005
  // decision 16).
  let { children }: { children: Snippet } = $props();
</script>

{@render children()}
