<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "unknown",
    title: "Don't: a bar held at 0",
    caption: "A bar held at 0 while the wait goes on.",
    breaks: "A bar that never moves reads as stuck.",
  };
</script>

<script lang="ts">
  import { Progress } from "#lib/registry/ui/progress";
</script>

<div class="max-w-xs">
  <Progress aria-label="Loading results" value={0} />
</div>
