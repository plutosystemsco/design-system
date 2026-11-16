<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "#lib/utils";

  let { class: className, ...restProps }: HTMLAttributes<HTMLElement> =
    $props();
</script>

<section class={cn(className)} {...restProps}></section>
