<!--
  026 decision 25: progress. The click applies 200 loading updates to one
  toast's id in one task; the stack draws once, not 200 times.
-->
<script lang="ts">
  import { toast, Toaster } from "#lib/components/ui/toast";

  function upload() {
    for (let i = 1; i <= 200; i++)
      toast.loading(`Uploading ${i} of 200`, { id: "upload" });
  }
</script>

<Toaster />
<button type="button" data-cost="target" onclick={upload}>Upload</button>
