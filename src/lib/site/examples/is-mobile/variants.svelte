<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A media-query store: true below 768 px, false from 768 up, and false on the server, where no width is known. Resize the window to see it change. Pass another breakpoint to the constructor.",
  };
</script>

<script lang="ts">
  import { IsMobile } from "#lib/registry/hooks/is-mobile.svelte.js";

  const mobile = new IsMobile();
  const narrow = new IsMobile(1024);
</script>

<div class="grid gap-2 text-sm">
  <p>
    This window is
    <strong>{mobile.current ? "below" : "at or above"} 768 px wide</strong>.
  </p>
  <p>
    With a breakpoint of 1024, it is
    <strong>{narrow.current ? "below" : "at or above"} 1024 px wide</strong>.
  </p>
</div>
