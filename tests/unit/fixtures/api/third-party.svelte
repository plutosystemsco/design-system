<script lang="ts">
  import SpinnerIcon from "phosphor-svelte/lib/Spinner";
  import { cn } from "#lib/utils";

  let { class: className }: { class?: string } = $props();
</script>

<SpinnerIcon class={cn("size-4", className)} />
