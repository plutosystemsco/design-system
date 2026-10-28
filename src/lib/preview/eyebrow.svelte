<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
</script>

<p
  class="font-mono text-xs font-medium tracking-eyebrow text-muted-foreground lowercase"
>
  {@render children()}
</p>
