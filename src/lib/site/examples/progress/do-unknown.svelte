<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "unknown",
    title: "Do: a spinner for an unknown wait",
    caption: "The spinner turns, and its label says what is loading.",
  };
</script>

<script lang="ts">
  import { Spinner } from "#lib/registry/ui/spinner";
</script>

<span class="flex items-center gap-2 text-sm text-muted-foreground">
  <Spinner label="Loading results" />
</span>
