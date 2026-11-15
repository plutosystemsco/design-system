<script lang="ts" module>
  export const meta = {
    title: "With an icon",
    intro:
      "An icon before the text is a second cue for the state. It is decoration, hidden from assistive technology.",
  };
</script>

<script lang="ts">
  import CheckCircle from "phosphor-svelte/lib/CheckCircle";
  import Warning from "phosphor-svelte/lib/Warning";
  import WarningCircle from "phosphor-svelte/lib/WarningCircle";
  import { Badge } from "#lib/registry/ui/badge";
</script>

<div class="flex flex-wrap items-end gap-8">
  <Badge variant="destructive"><WarningCircle aria-hidden="true" />Failed</Badge
  >
  <Badge variant="success"><CheckCircle aria-hidden="true" />Passed</Badge>
  <Badge variant="caution"><Warning aria-hidden="true" />Flaky</Badge>
</div>
