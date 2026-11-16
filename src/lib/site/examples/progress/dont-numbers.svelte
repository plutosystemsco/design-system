<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "numbers",
    title: "Don't: the bar alone",
    caption: "A bar with no numbers.",
    breaks: "The fill is the only sign of how much is done.",
  };
</script>

<script lang="ts">
  import { Progress } from "#lib/registry/ui/progress";
</script>

<div class="max-w-xs">
  <Progress aria-label="Upload" value={3} max={12} />
</div>
