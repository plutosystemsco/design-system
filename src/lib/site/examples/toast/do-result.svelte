<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "result",
    caption:
      "The result is also on the page: the archived project now sits under Archived.",
  };
</script>

<script lang="ts">
  import { Toast } from "#lib/registry/ui/toast";
</script>

<div inert class="grid gap-3">
  <ol class="grid max-w-sm gap-2">
    <Toast kind="success" title="Project archived" />
  </ol>
  <dl class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-sm">
    <dt class="text-muted-foreground">Active</dt>
    <dd>Fuel report</dd>
    <dt class="text-muted-foreground">Archived</dt>
    <dd>pluto-sandbox</dd>
  </dl>
</div>
