<script lang="ts">
  import { useHighlightedCode } from "#lib/hooks/use-highlighted-code.svelte.js";

  const lines = useHighlightedCode(
    () => 'print("hello")',
    () => "python",
  );

  // 025 decision 5: the hook highlights after mount; the mark says when.
  $effect(() => {
    if (lines.settled) performance.mark("cost:settled");
  });
</script>

<p>{lines.current.length} line</p>
