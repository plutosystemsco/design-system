<!--
  026 decision 25: a burst. The click raises 100 distinct successes in one
  task; the stack draws three, and the "more" line counts the rest.
-->
<script lang="ts">
  import { toast, Toaster } from "#lib/components/ui/toast";

  function burst() {
    for (let i = 1; i <= 100; i++) toast.success(`Saved ${i}`);
  }
</script>

<Toaster />
<button type="button" data-cost="target" onclick={burst}>Save all</button>
