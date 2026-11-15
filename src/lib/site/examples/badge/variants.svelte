<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A label, not an action. A state is a border and text in its colour, with no tint, so it reads on a hover row; caution is solid yellow with ink text.",
  };
</script>

<script lang="ts">
  import { Badge } from "#lib/registry/ui/badge";
</script>

<div class="flex flex-wrap items-end gap-8">
  <Badge>Queued</Badge>
  <Badge variant="destructive">Failed</Badge>
  <Badge variant="success">Passed</Badge>
  <Badge variant="caution">Flaky</Badge>
</div>
