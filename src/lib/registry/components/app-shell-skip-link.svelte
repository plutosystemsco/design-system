<script lang="ts">
  import { cn } from "#lib/utils";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  let {
    href = "#main",
    class: className,
    ...restProps
  }: HTMLAnchorAttributes = $props();
</script>

<!--
  First in <body>, before the header: hidden until it has focus, then a box
  at the top start corner above everything, with the global ring. `sr-only`,
  not `hidden`: display none would leave the tab order. Enter lands focus on
  the shell's <main id="main" tabindex="-1">.
-->
<a
  data-slot="app-shell-skip-link"
  {href}
  class={cn(
    "sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded focus:bg-card focus:px-4 focus:py-2 focus:text-sm",
    className,
  )}
  {...restProps}
>
  Skip to main content
</a>
