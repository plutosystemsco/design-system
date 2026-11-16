<!--
  026 decision 25: the toaster in the page, and one native button whose
  click raises a success.
-->
<script lang="ts">
  import { toast, Toaster } from "#lib/components/ui/toast";
</script>

<Toaster />
<button type="button" data-cost="target" onclick={() => toast.success("Saved")}>
  Save
</button>
