<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "numbers",
    title: "Do: the numbers beside the bar",
    caption: "The numbers beside the bar say how much is done.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { Progress } from "#lib/registry/ui/progress";
</script>

<div class="grid max-w-xs gap-2">
  <div class="flex items-baseline justify-between gap-4">
    <Label for="do-numbers">Upload</Label>
    <span class="font-mono text-sm text-muted-foreground tabular-nums"
      >3 of 12 files</span
    >
  </div>
  <Progress id="do-numbers" value={3} max={12} valuetext="3 of 12 files" />
</div>
