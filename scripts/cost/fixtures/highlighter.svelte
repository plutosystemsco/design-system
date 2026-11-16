<script lang="ts">
  import { onMount } from "svelte";
  import { highlightCode, type HighlightedLine } from "#lib/highlighter";

  let lines = $state<HighlightedLine[]>([]);
  onMount(async () => {
    lines = (await highlightCode('print("hello")', "python")) ?? [];
    performance.mark("cost:settled");
  });
</script>

<p>{lines.length} line</p>
