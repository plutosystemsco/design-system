<script lang="ts" module>
  export const meta = {
    title: "An upload",
    intro:
      "A label, the numbers beside the bar, and a status that says when the upload starts and when it ends. The bar itself is never spoken.",
  };
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { Label } from "#lib/registry/ui/label";
  import { Progress } from "#lib/registry/ui/progress";
  import { Status } from "#lib/registry/ui/status";

  const total = 12;
  let done = $state(3);
  let said = $state("");
  let timer: ReturnType<typeof setInterval> | undefined;

  // A stand-in for real uploads: one file every 400 ms.
  function upload() {
    clearInterval(timer);
    done = 0;
    said = `Uploading ${total} files`;
    timer = setInterval(() => {
      done += 1;
      if (done === total) {
        clearInterval(timer);
        said = "Upload complete";
      }
    }, 400);
  }

  onDestroy(() => clearInterval(timer));
</script>

<div class="grid max-w-md gap-2">
  <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <Label for="upload">Upload</Label>
    <span class="font-mono text-sm text-muted-foreground tabular-nums"
      >{done} of {total} files</span
    >
  </div>
  <Progress
    id="upload"
    value={done}
    max={total}
    valuetext="{done} of {total} files"
  />
  <div class="mt-2">
    <Button variant="secondary" size="sm" onclick={upload}
      >Upload {total} files</Button
    >
  </div>
  <Status text={said} />
</div>
