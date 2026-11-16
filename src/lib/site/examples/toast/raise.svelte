<script lang="ts" module>
  export const meta = {
    title: "Raise",
    intro:
      "Each button raises a toast at the top end. Success and info leave after 6 s; the warning, the error and the upload wait to be dismissed.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { toast } from "#lib/registry/ui/toast";

  function saveTwo() {
    // Two results in one task: the error interrupts, and the success is
    // spoken after it.
    toast.success("Record A saved");
    toast.error("Couldn't save Record B");
  }
</script>

<div class="flex flex-wrap gap-3">
  <Button onclick={() => toast.success("Project saved")}>Save</Button>
  <Button variant="secondary" onclick={() => toast("Invite sent")}
    >Send invite</Button
  >
  <Button
    variant="secondary"
    onclick={() =>
      toast.caution("Storage almost full", {
        description: "You have used 90% of your space.",
      })}>Check storage</Button
  >
  <Button
    variant="secondary"
    onclick={() =>
      toast.error("Couldn't save", { description: "Check your connection." })}
    >Save with an error</Button
  >
  <Button
    variant="secondary"
    onclick={() => toast.loading("Uploading 3 of 10", { id: "upload" })}
    >Start upload</Button
  >
  <Button variant="secondary" onclick={saveTwo}>Save two records</Button>
</div>
