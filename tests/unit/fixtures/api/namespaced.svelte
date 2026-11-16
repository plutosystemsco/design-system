<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import { cn } from "#lib/utils";

  let { class: className }: { class?: string } = $props();
</script>

<Card.Root class={cn("p-4", className)} />
