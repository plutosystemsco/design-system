<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "label",
    title: "Do: a visible label",
    caption:
      "Its name stays on screen while you type, and a screen reader says it.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";
</script>

<div class="grid max-w-sm gap-2">
  <Label for="do-label-search">Search invoices</Label>
  <SearchField id="do-label-search" autocomplete="off" />
</div>
