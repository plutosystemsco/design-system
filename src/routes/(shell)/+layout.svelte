<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  // A shell view renders the shell's own skip link, header, main and footer
  // (006 decision 12), so this layout adds nothing: no main of its own, no
  // theme script (the shell's layout, or the view's copy of it, renders
  // one). It marks the body once hydrated, for the tests.
  let { children }: { children: Snippet } = $props();
  onMount(() => {
    document.body.setAttribute("data-view-ready", "");
    return () => document.body.removeAttribute("data-view-ready");
  });
</script>

{@render children()}
