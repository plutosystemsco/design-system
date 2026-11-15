<script lang="ts" module>
  export const meta = {
    title: "Empty and with text",
    intro:
      "Empty at first render, so the region is in the page before anything changes it. With text, it says that text once. A visible status takes the colour of its context.",
  };
</script>

<script lang="ts">
  import { Status } from "#lib/registry/ui/status";
</script>

<div class="flex flex-wrap items-start gap-8">
  <Status visible class="min-h-6 min-w-48 rounded border border-border" />
  <Status visible text="Saved" class="text-sm text-success" />
</div>
