<script lang="ts">
  import type { Door } from "../doors.ts";
  import { cn } from "#lib/utils";

  let {
    door,
    current,
    class: className,
    onclick,
  }: {
    door: Door;
    /** `"page"` on the door's landing, `"true"` on its other pages. */
    current?: "page" | "true";
    class?: string;
    onclick?: () => void;
  } = $props();
</script>

<!-- The dot is decoration: the door's name carries its meaning. -->
<a
  href={door.path}
  aria-current={current}
  class={cn(
    "site-door-link inline-flex min-h-10 items-center gap-2 rounded px-3 text-sm font-medium text-foreground hover:bg-accent",
    className,
  )}
  {onclick}
  ><span class="site-dot" data-door={door.n} aria-hidden="true"
  ></span>{door.name}</a
>
