<script lang="ts">
  import { IsMobile } from "#lib/hooks/is-mobile.svelte.js";

  const mobile = new IsMobile();
</script>

<p>{mobile.current ? "Narrow" : "Wide"}</p>
